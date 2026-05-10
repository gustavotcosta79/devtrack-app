import React, {useEffect, useState} from 'react'
import {toast} from "react-hot-toast";
import Spinner from "../components/Spinner.jsx";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const LeaderboardPage = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [leaderboardData, setLeaderboardData] = useState(null);

    const fetchLeaderboard = async () => {
        setIsLoading(true);
        try {
            const leaderboardEndpoint = `${API_BASE_URL}/users/leaderboard`;
            const response =  await fetch(leaderboardEndpoint,{
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`

                }
            });

            if (!response.ok){
                throw new Error("Error Fetching the Leaderboard!");
            }
            const data = await response.json();
            console.log("TOP 50 UTILIZADORES",data);
            setLeaderboardData (data);

        }catch (error){
            console.error(`Erro ao dar fetch no ranking: ${error}`);
            toast.error("The leaderboard is unavailable at this moment. Try again later!");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {

        fetchLeaderboard();

    }, []);


    return (
        <div className="min-h-screen bg-primary text-white p-8 ">
            <h1 className="text-2xl text-accent text-center">Global Leaderboard</h1>
            {isLoading ? (
                <div className="flex flex-col items-center gap-4 mt-20">
                    <Spinner />
                    <p className="text-gray-400 animate-pulse">Fetching the Global Leaderboard...</p>
                </div>
            ) : leaderboardData ? (
                <div className="bg-secondary border-2 border-accent rounded-2xl p-6 mt-10">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col items-center">
                            <span className="text-sm text-gray-400 font-medium">Rank</span>
                            <span className="text-5xl text-accent font-black">
                            {leaderboardData.current_user.rank}
                            </span>
                        </div>
                        <div className="flex items-center text-center gap-4">
                            <img
                                src={leaderboardData.current_user.avatar_url}
                                alt={leaderboardData.current_user.username}
                                className="rounded-full w-12 h-12 border border-gray-700 "/>
                            <span>
                                <a href={`https://github.com/${leaderboardData.current_user.username}`} target="_blank" rel="noreferrer" className="font-bold text-white hover:text-accent transition-colors cursor-pointer">
                                    @{leaderboardData.current_user.username}
                                </a>
                            </span>
                        </div>
                        <span className="text-accent">
                            {leaderboardData.current_user.devscore}
                        </span>
                    </div>

                    <hr className=" mt-8 border-accent" />

                    <div className="mt-4">
                        <h2 className="text-2xl font-bold mb-6 text-gray-300">Top 50 developers</h2>
                        <div className="flex flex-col gap-4">
                            {leaderboardData.top_users.map((user,index) =>(
                                <div key={user.username} className="bg-[#24292e] border border-gray-800 rounded-xl p-4 flex items-center justify-between hover:scale-[1.02] transition-all duration-300 shadow-md">
                                    <div className="flex items-center gap-6">
                                        <span className="text-accent">
                                                {index + 1}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={user.avatar_url}
                                                alt ={user.username}
                                                className="rounded-full w-12 h-12 border border-gray-700 "/>
                                            <span>
                                                <a href={`https://github.com/${user.username}`} target="_blank" rel="noreferrer" className="font-bold text-white hover:text-accent transition-colors cursor-pointer">
                                                    @{user.username}
                                                </a>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-black text-accent">
                                            {user.dev_score}
                                        </span>
                                        <span className="text-sm text-gray-400 font-medium">pts</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : null
            }
        </div>
    )
}
export default LeaderboardPage
