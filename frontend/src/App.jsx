import React, {useState} from 'react'
import SearchBar from "./components/SearchBar.jsx";
import Spinner from "./components/Spinner.jsx";

const API_BASE_URL = 'http://127.0.0.1:8000';

const App = () =>{

    const [searchTerm, setSearchTerm] = useState('');

    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (username) => {

            setIsLoading(true);
            setError(null);
            setUserData(null);

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
                       {isLoading ? (
                           <p className="text-accent animate-pulse items-center">
                               A calcular DevScore e importar repositórios...
                               <Spinner/>
                           </p>
                       ) : error ? (
                           <p className="text-red-500 font-bold ">
                               {error}
                           </p>
                       ) : userData ?(
                           <div className="text-left bg-secondary p-6 rounded-xl border border-gray-800 overflow-auto">
                               <h2 className="text-xl font-bold mb-4 text-accent">Dados Recebidos do Backend:</h2>
                               <pre className="text-sm text-gray-300">
                                    {JSON.stringify(userData, null, 2)}
                                </pre>
                           </div>
                       ) : null}
                   </div>
               </main>
            </div>
        </div>
    )
}

export default App
