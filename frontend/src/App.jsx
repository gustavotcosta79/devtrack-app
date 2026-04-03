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

const API_BASE_URL = 'http://127.0.0.1:8000';

const App = () =>{

    const [searchTerm, setSearchTerm] = useState('');

    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

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

            }catch (error){
                console.error(`Error importing the user: ${error}`);
                setError(error.message);
            }
            finally {
                setIsLoading(false)
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

                               {/* A Grelha de Estatísticas (4 colunas no Desktop, 1 no Mobile) */}                               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 w-full text-left">
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
                           </div>
                       ) : error ? (
                           <p className="text-red-500 font-bold ">
                               {error}
                           </p>
                       ) : isLoading ? (
                           <p className="text-accent animate-pulse items-center">
                               Importing Repositories and calculating DevScore...
                               <Spinner/>
                           </p>
                       ) : null}
                   </div>
               </main>
            </div>
        </div>
    )
}

export default App


