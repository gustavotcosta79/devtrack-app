import React from 'react'
import { LucideRefreshCw } from 'lucide-react';


const UserProfile = ({userInfo, devScore, onRefresh,isRefreshing}) => {
    return (
        //foto e nome do lado esquerdo
        <div className="flex flex-col md:flex-row items-center justify-between bg-secondary p-8 rounded-2xl border border-gray-800 mb-8 w-full">
            <img
                src={userInfo.avatar_url}
                alt={userInfo.username}
                className="w-24 h-24 rounded-full border-4 border-accent shadow-[0_0_15px_rgba(16,185,129,0.3)] object-cover"
            />
            <h2 className="text-left text-4xl text-white">
                @{userInfo.username}
            </h2>

            <div>
                <p className="text-gray-400 mt-1 ">Synchronize user data</p>
                <button className="bg-green-950 px-5 border-4 rounded-full w-20 h-full border-0.5 border-accent hover:cursor-pointer mt-2 transition-colors"
                onClick={() => onRefresh()}>
                    <LucideRefreshCw size={30} className={isRefreshing ? "animate-spin text-accent": ""} />
                </button>
            </div>

            <div className="text-center md:text-right">
                <p className="text-gray-400 text-sm uppercase tracking-widest mb-1 font-bold">DevScore</p>
                <p className="text-6xl font-black text-accent drop-shadow-lg">
                    {devScore ? devScore.toFixed(1) : '0.0'}
                </p>
            </div>
        </div>

    )
}
export default UserProfile
