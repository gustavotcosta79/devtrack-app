import React from 'react'
import {Code, Star,Eye, Pencil, Trash2} from "lucide-react";

const RepositoriesPage = ({username,repos,onDeleteRepo}) => {
    if (!repos || repos.length === 0){
        return (
            <p>
                No repositories found
            </p>
        )
    }

    const handleDelete = async (repoId,repoName) => {
        const isConfirmed = window.confirm(`Are you sure you want to delete ${repoName}?`);
        if (!isConfirmed) return;

        console.log("A preparar para apagar o repo")
        await onDeleteRepo(repoId);
    }

    const getComplexityBadge = (repo) => {
        const level = repo.complexity

        if (level === 'Large'){
            return {label: 'Large', classes: 'bg-red-900/50 text-red-400 border border-red-800'};
        }
        else if (level === 'Medium'){
            return {label: 'Medium', classes: 'bg-yellow-900/50 text-yellow-400 border border-yellow-800'}
        }
        else {
            return {label: 'Small', classes: 'bg-green-900/50 text-green-400 border border-green-800'}
        }
    };

    return (
        <div>
            {repos.map((repo) =>{
                const badge = getComplexityBadge(repo);

                return (
                    <div key={repo.id}
                        className=" flex items-center justify-between p-4 bg-primary border border-gray-800 rounded-lg mb-3">

                        <div>
                            <a href={`https://github.com/${username}/${repo.name}`} target="_blank" rel="noreferrer" className="text-lg font-bold text-white hover:text-accent transition-colors cursor-pointer">
                                {repo.name}
                            </a>
                        </div>

                        <div className="flex items-center gap-3 text-sm">

                            {/* Linguagem */}
                            {repo.language && (
                                <span className="flex items-center gap-1 text-gray-300 bg-secondary px-3 py-1 rounded-full border border-gray-700">
                                    <Code size={14} className="text-accent"/> {repo.language}
                                </span>
                            )}

                            {/* Estrelas */}
                            <span className="flex items-center gap-1 text-gray-300 bg-secondary px-3 py-1 rounded-full border border-gray-700">
                                <Star size={14} className="text-yellow-500"/> {repo.stars_count || 0}
                            </span>

                            {/* Etiqueta de Complexidade*/}
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.classes}`}>
                                {badge.label}
                            </span>

                            <button>
                                <Eye size={14} className="cursor-pointer hover:text-accent"/>
                            </button>

                            <button>
                                <Pencil size={14} className="cursor-pointer hover:text-accent"/>
                            </button>

                            <button>
                                <Trash2 size={14} className="cursor-pointer text-red-500" onClick={() => handleDelete(repo.id,repo.name)}/>
                            </button>

                        </div>

                    </div>
                )
            })}

        </div>
    )
}
export default RepositoriesPage
