import React, {useState} from 'react'
import SearchBar from "./components/SearchBar.jsx";
import Spinner from "./components/Spinner.jsx";
import StatCard from "./components/StatCard.jsx";
import UserProfile from "./components/UserProfile.jsx";
import { FolderGit2, Star, GitCommit, Trophy } from 'lucide-react';
import ChartCard from "./components/ChartCard.jsx";
import ScoreEvolutionChart from "./components/charts/ScoreEvolutionChart.jsx";
import CommitsChart from "./components/charts/CommitsChart.jsx";
import FavoriteLanguagesChart from "./components/charts/FavoriteLanguagesChart.jsx";
import ProjectsEvolutionChart from "./components/charts/ProjectsEvolutionChart.jsx";
import RepoList from "./components/RepoList.jsx";
import AiRecommendation from "./components/AiRecommendation.jsx";

const API_BASE_URL = 'http://127.0.0.1:8000';

const App = () =>{

    const [searchTerm, setSearchTerm] = useState('');

    const [userData, setUserData] = useState(null);
    const [userRepos, setUserRepos] = useState([])
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [aiRecommendation, setAiRecommendation] = useState(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

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
                        accept: 'application/json'
                    }
                });

                if (!syncResponse.ok){
                    const errorData = await syncResponse.json();
                    throw new Error(errorData.detail || 'ERROR IMPORTING THE USER!');
                }

                const basicUser = await syncResponse.json();

                const dashboardEndpoint = `${API_BASE_URL}/users/${basicUser.id}/dashboard`
                const dashboardResponse = await fetch(dashboardEndpoint,{
                    method: 'GET',
                    headers: {
                        accept: 'application/json'
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

    const fetchUserRepositories = async (userId) => {
        const reposEndpoint = `${API_BASE_URL}/users/${userId}/repositories`;

        const reposResponse = await fetch(reposEndpoint,{
            method: 'GET',
            headers:{
                accept: 'application/json'
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
                    accept: 'application/json'
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




    return (
        <div className="min-h-screen bg-primary text-white font-sans selection:bg-accent selection:text-white">
            <div className="max-w-5xl mx-auto px-6 py-10">

                <header className="flex items-center justify-between mb-12">
                    <h1 className="text-2xl font-bold tracking-wider">
                        <span className="text-accent">{'{'}</span> DevTrack <span className="text-accent">{'}'}</span>
                    </h1>
                </header>

               <main>
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch}></SearchBar>

                   <div className="mt-10 text-center items-center">
                       { userData? (
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
                       ) : error ? (
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
               </main>
            </div>
        </div>
    )
}

export default App


