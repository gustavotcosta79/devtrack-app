import React from 'react'
import { Search } from 'lucide-react';


const SearchBar = ({searchTerm, setSearchTerm,onSearch}) => {

    const handleKeyDown = (e) =>{
        if (e.key==='Enter' && searchTerm.trim() !== ''){
            onSearch(searchTerm);
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto mb-10">
            <div className='relative flex items-center '>
                <Search className="absolute left-4 w-5 h-5 text-gray-400"/>

                <input
                type={'text'}
                value={searchTerm}
                placeholder={"Search for an user"}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-secondary text-white py-4 pl-12 pr-32 rounded-xl border border-gray-800 focus:outline-none focus:border-accent transition-colors"
                />

            </div>
        </div>
    )
}

export default SearchBar;