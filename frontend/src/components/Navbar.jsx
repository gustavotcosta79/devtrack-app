import React, {Fragment, useState} from 'react'



const Navbar = ({handleLogout, navigate, userData, setIsMenuOpen, isMenuOpen}) => {

    return (
        <Fragment>
            <h1 className="text-2xl font-bold tracking-wider cursor-pointer" onClick={() => {navigate("/"); setIsMenuOpen(false)}}>
                <span className="text-accent">{'{'}</span> DevTrack <span className="text-accent">{'}'}</span>
            </h1>
            <div className="relative flex-col items-center" >
                {userData ? (
                        <img
                            src={userData.user_info.avatar_url}
                            alt={userData.username}
                            className={"w-10 h-10 rounded-full cursor-pointer hover:ring-2 hover:ring-accent object-cover"}
                            onClick={()=>setIsMenuOpen(!isMenuOpen)}
                        />
                    )
                    : null
                }

                { isMenuOpen ? (
                    <div className="absolute right-0 top-14 w-48 bg-secondary border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                        <button className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors cursor-pointer">
                            My profile
                        </button>
                        <button onClick={() => {navigate("/repositories"); setIsMenuOpen(false)}}
                            className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors cursor-pointer">
                            My Repositories
                        </button>
                        <button onClick={() => {navigate("/dashboard"); setIsMenuOpen(false)}}
                                className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors cursor-pointer">
                            My Dashboard
                        </button>
                        <button onClick={() => {handleLogout(); setIsMenuOpen(false)}}
                                className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-gray-800 transition-colors font-bold cursor-pointer">
                            Logout
                        </button>
                    </div>
                ) : null
                }
            </div>
        </Fragment>

    )
}
export default Navbar
