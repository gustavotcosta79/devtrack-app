import React, {useEffect, useState} from 'react'
import SearchBar from "./components/SearchBar.jsx";
import Spinner from "./components/Spinner.jsx";
import StatCard from "./components/StatCard.jsx";
import UserProfile from "./components/UserProfile.jsx";
import { FolderGit2, Star, GitCommit, Trophy} from 'lucide-react';
import ChartCard from "./components/ChartCard.jsx";
import ScoreEvolutionChart from "./components/charts/ScoreEvolutionChart.jsx";
import CommitsChart from "./components/charts/CommitsChart.jsx";
import FavoriteLanguagesChart from "./components/charts/FavoriteLanguagesChart.jsx";
import ProjectsEvolutionChart from "./components/charts/ProjectsEvolutionChart.jsx";
import RepoList from "./components/RepoList.jsx";
import AiRecommendation from "./components/AiRecommendation.jsx";
import {Routes} from "react-router-dom";
import {Route} from "react-router-dom";
import {useSearchParams} from "react-router-dom";
import {useNavigate, useLocation} from "react-router-dom";


const API_BASE_URL = import.meta.env.VITE_API_URL;

const App = () =>{

    const [searchTerm, setSearchTerm] = useState('');

    const [userData, setUserData] = useState(null);
    const [userRepos, setUserRepos] = useState([])
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [aiRecommendation, setAiRecommendation] = useState(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/dashboard") {
            const token = searchParams.get("token");

            if (token){
                localStorage.setItem("token", token); // armazenar o token no "porta-chaves" do browser
                navigate("/dashboard",{replace: true})// limpar o url do utilizador (sem o lixo do token)

                if (!userData){
                    fetchCurrentUser(token);
                }

            }

            else {
                const savedToken = localStorage.getItem("token");
                if (savedToken && !userData){
                    fetchCurrentUser(savedToken);
                }
            }
        }

    }, [searchParams, navigate,location.pathname]); // sempre que um componente dá re-render ou os searchParams mudam a hook do useEffect é chamada.

    const handleSearch = async (username, isRefresh = false) => {

            setIsLoading(true);
            setError(null);

            if (!isRefresh){
                setUserData(null);
            }

            try {
                const syncEndpoint = `${API_BASE_URL}/users/import/${username}`;
                const syncResponse = await fetch(syncEndpoint,{
                    method: 'POST',
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (!syncResponse.ok){
                    const errorData = await syncResponse.json();
                    throw new Error(errorData.detail || 'ERROR IMPORTING THE USER!');
                }

                const basicUser = await syncResponse.json();
                console.log("Basic User:" ,basicUser)

                const dashboardEndpoint = `${API_BASE_URL}/users/${basicUser.id}/dashboard`
                const dashboardResponse = await fetch(dashboardEndpoint,{
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem("token")}`

                    }
                });

                if (!dashboardResponse.ok){
                    throw new Error('Error loading the user data');
                }

                const dashboardData = await dashboardResponse.json();

                setUserData(dashboardData);
                console.log("UserDATA!", userData)

                const reposData = await fetchUserRepositories(basicUser.id);
                setUserRepos(reposData)

                // sem await que é para o dashboard carregar sem  a recomendação da ai (porque normalmente a recomendação demora mais tempo
                // que o dashboard), desta maneira o dashboard carrega logo e a recomendação do LLM fica a carregar de fundo
                fetchAiRecommendation(basicUser.id);

            }catch (error){
                console.error(`Error importing the user: ${error}`);
                setError(error.message);
            }
            finally {
                setIsLoading(false);
            }

    }

    const fetchCurrentUser = async (token) => {
        setIsLoading(true);

        try {
            const responseEndoint = `${API_BASE_URL}/users/me`;
            const response = await fetch(responseEndoint,{
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok){
                const currentUser = await response.json();
                console.log ("Current user: ", currentUser);

                handleSearch(currentUser.username, true);
            }
            else {
                localStorage.removeItem("token");
                navigate("/",{replace : true})
            }



        } catch (error){
            console.log ("Erro no fetch do current user: ", error)
        }
        finally {
            setIsLoading(false);
        }

    }


    const fetchUserRepositories = async (userId) => {
        const reposEndpoint = `${API_BASE_URL}/users/${userId}/repositories`;

        const reposResponse = await fetch(reposEndpoint,{
            method: 'GET',
            headers:{
                accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem("token")}`

            }
        });

        if (!reposResponse.ok){
            throw new Error('Error Loading the User repositories')
        }

        const reposData = await reposResponse.json();

        console.log("Dados dos repositorios de um utilizador: ",reposData);
        return reposData;

    }

    const fetchAiRecommendation = async (userId) => {

        setIsAiLoading(true);
        try {
            const aiRecommendationEndpoint = `${API_BASE_URL}/users/${userId}/recommendation`;

            const aiRecommendationResponse = await fetch(aiRecommendationEndpoint, {
                method: 'GET',
                headers:{
                    accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`

                }
            });

            const aiRecommendationData = await aiRecommendationResponse.json()

            console.log("Resposta da AI (recomendação): ", aiRecommendationData)
            setAiRecommendation(aiRecommendationData)
        }
        catch (error){
            console.error("Erro no LLM: ", error)
            setAiRecommendation("AI Recommendation unavailable at this moment")
        }finally {
            setIsAiLoading(false)
        }
    }

    const handleLogout = () => {
            navigate("/",{replace:true});

            setUserData(null);
            setUserRepos([]);
            setAiRecommendation(null);

            localStorage.removeItem("token");

    }


    return (
        <div className="min-h-screen bg-primary text-white font-sans selection:bg-accent selection:text-white">
            <div className="max-w-5xl mx-auto px-6 py-10">

                <header className="flex items-center justify-between mb-12">
                    <h1 className="text-2xl font-bold tracking-wider cursor-pointer" onClick={()=>navigate("/")}>
                        <span className="text-accent">{'{'}</span> DevTrack <span className="text-accent">{'}'}</span>
                    </h1>
                    {localStorage.getItem("token") ? (
                        <button onClick={() => handleLogout()} className="inline-flex items-center justify-center gap-3 rounded-2xl bg-red-700 px-8 py-4 text-white font-bold border-2 border-transparent hover:bg-red-400 hover:border-red-500 hover:scale-105 transition-all cursor-pointer shadow-lg">
                            Logout
                        </button> ) : null
                    }
                </header>


                <main>
                    <Routes>
                        <Route path="/" element={

                            <div className="mt-10 text-center items-center">
                                {localStorage.getItem("token") ? (
                                    <div>
                                        <button onClick={() =>navigate("/dashboard")} className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#24292e] px-8 py-4 text-white font-bold border-2 border-transparent hover:bg-gray-700 hover:border-gray-500 hover:scale-105 transition-all cursor-pointer shadow-lg">
                                            Go to dashboard
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mb-5 mt-4 flex justify-center">
                                        <a href = {`${API_BASE_URL}/auth/github/login`} className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#24292e] px-8 py-4 text-white font-bold border-2 border-transparent hover:bg-gray-700 hover:border-gray-500 hover:scale-105 transition-all cursor-pointer shadow-lg">
                                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
                                            </svg>
                                            Login with Github
                                        </a>
                                    </div>
                                )
                                }


                                {error ? (
                                    <p className="text-red-500 font-bold ">
                                        {error}
                                    </p>
                                ) : isLoading ? (
                                    <div>
                                        <p className="text-accent animate-pulse items-center">
                                            Importing Repositories and calculating DevScore...
                                        </p>
                                        <Spinner/>
                                    </div>
                                ) : null}
                            </div>
                        } />

                        <Route path="/dashboard" element={
                            <div className="mt-10 text-center items-center">
                                <div className="mb-10">
                                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch}></SearchBar>
                                </div>

                                {userData ? (
                                    <div className="animate-in fade-in duration-700 w-full">

                                        {/*O Perfil de Utilizador */}
                                        <UserProfile
                                            userInfo={userData.user_info}
                                            devScore={userData.current_devscore}
                                            onRefresh={()=>handleSearch(userData.user_info.username,true)}
                                            isRefreshing={isLoading}
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 w-full text-left">
                                            <StatCard
                                                title="Total Repositories"
                                                value={userData.total_repos}
                                                icon={FolderGit2}
                                            />
                                            <StatCard
                                                title="Total Stars"
                                                value={userData.total_stars}
                                                icon={Star}
                                            />
                                            <StatCard
                                                title="Last Commits"
                                                // Vai buscar o último mês do dicionário, ou 0 se não houver
                                                value={Object.values(userData.commits_per_month).pop() || 0}
                                                icon={GitCommit}
                                            />
                                            <StatCard
                                                title="DevTrack Level"
                                                // Uma pequena lógica para dar um "Nível" com base na nota
                                                value={userData.current_devscore >= 80 ? "Sénior" : userData.current_devscore >= 40 ? "Pleno" : "Júnior"}
                                                icon={Trophy}
                                            />
                                        </div>


                                        <AiRecommendation recommendation={aiRecommendation} isLoading={isAiLoading}/>



                                        <div className="grid gap-6 md:grid-cols-2 grid-cols-1">
                                            <ChartCard title={"DevScore Evolution"}>
                                                <ScoreEvolutionChart data={userData.devscore_evolution}/>
                                            </ChartCard>
                                            <ChartCard title={"Commits per Month"}>
                                                <CommitsChart data={userData.commits_per_month}/>
                                            </ChartCard>
                                            <ChartCard title={"Favorite Languages"}>
                                                <FavoriteLanguagesChart data={userData.languages_evolution}/>
                                            </ChartCard>
                                            <ChartCard title={"Projects Evolution"}>
                                                <ProjectsEvolutionChart data={userData.projects_over_time}/>

                                            </ChartCard>
                                        </div>
                                        {userRepos && (
                                            <RepoList repos={userRepos} username={userData.user_info.username} />
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 mt-20 text-xl animate-pulse">
                                        A carregar o teu DevTrack...
                                    </p>
                                )}
                            </div>
                        }/>
                    </Routes>
               </main>
            </div>
        </div>
    )
}

export default App


