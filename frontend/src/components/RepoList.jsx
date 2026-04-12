import React from 'react';
import { BookMarked, Star, Code } from 'lucide-react';

const RepoList = ({repos,username}) => {
    if (!repos || repos.length == 0){
        return null;
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
        <div className="bg-secondary p-6 rounded-xl border border-gray-800 mt-6 w-full text-left animate-in fade-in duration-700">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BookMarked className="text-accent" /> Repositories
            </h3>

            {/* A "Caixa" com barra de scroll vertical (overflow-y-auto) */}
            <div className="max-h-96 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {repos.map((repo) => {
                    const badge = getComplexityBadge(repo);

                    return (
                        <div
                            key={repo.id} // O React exige sempre uma chave única (key) dentro de um .map()
                            className="bg-primary p-4 rounded-lg border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-accent transition-colors"
                        >
                            {/* Lado Esquerdo: Nome */}
                            <div>
                                <a href={`https://github.com/${username}/${repo.name}`} target="_blank" rel="noreferrer" className="text-lg font-bold text-white hover:text-accent transition-colors cursor-pointer">
                                    {repo.name}
                                </a>

                            </div>

                            {/* Lado Direito: Tags (Linguagem, Estrelas e Complexidade) */}
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

                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RepoList;