import React, {useState} from 'react'
import {Code, Star,Eye, Pencil, Trash2} from "lucide-react";

const RepositoriesPage = ({username,repos,onDeleteRepo, onUpdateRepo}) => {

    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)

    const [repoToView, setRepoToView] = useState(null)

    const [repoToEdit, setRepoToEdit] = useState(null)
    const [editFormData, setEditFormData] = useState(null)

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

                return (
                    <div key={repo.id}
                        className=" flex items-center justify-between p-4 bg-primary border border-gray-800 rounded-lg mb-3">

                        <div>
                            <a href={`https://github.com/${username}/${repo.name}`} target="_blank" rel="noreferrer" className="text-lg font-bold text-white hover:text-accent transition-colors cursor-pointer">
                                {repo.name}
                            </a>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                            <button>
                                <Eye size={14} className="cursor-pointer hover:text-accent" onClick={() => {setIsViewModalOpen(true); setRepoToView(repo)}}/>
                            </button>

                            <button>
                                <Pencil size={14} className="cursor-pointer hover:text-accent" onClick={() => {setIsEditModalOpen(true); setRepoToEdit(repo);
                                setEditFormData(repo)}}/>
                            </button>

                            <button>
                                <Trash2 size={14} className="cursor-pointer text-red-500" onClick={() => handleDelete(repo.id,repo.name)}/>
                            </button>
                        </div>
                    </div>
                )
            })}

            {/* Modal para abrir a janela de edição do repositório */}
            {isEditModalOpen ? (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-secondary border border-gray-700 p-6 rounded-xl w-full max-w-md shadow-2xl">
                        <h2>
                            Edit Repository
                        </h2>
                        <form className="bg-primary border border-gray-700 rounded p-2 text-white w-full mb-3 flex flex-col gap-3">
                            Repository Name:
                            <input type="text" value={editFormData.name} name={"Repository Name"}
                                   className="w-full bg-secondary border border-gray-600 rounded-lg p-2 text-white outline-none focus:border-accent transition-colors"
                                   onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}/>
                            Language:
                            <input type="text" value={editFormData.language} name={"Language"}
                                   className="w-full bg-secondary border border-gray-600 rounded-lg p-2 text-white outline-none focus:border-accent transition-colors"
                                   onChange={(e) => setEditFormData({...editFormData, language: e.target.value})}/>
                            <label>
                                Select a complexity:
                                <select value={editFormData.complexity}
                                        onChange={(e) => setEditFormData({...editFormData, complexity: e.target.value})}
                                        className="w-full bg-secondary border border-gray-600 rounded-lg p-2 text-white outline-none focus:border-accent transition-colors">
                                    <option value="Small">Small</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Large">Large</option>
                                </select>
                            </label>
                        </form>
                        <div className="flex justify-end gap-3">
                            <button className="cursor-pointer w-18 bg-red-500 text-white rounded-2xl hover:bg-red-250 border-red-950 border-2"
                                    onClick={() => {setIsEditModalOpen(false); setRepoToEdit(null)}}>
                                Cancel
                            </button>
                            <button className="cursor-pointer w-30 bg-accent text-white rounded-2xl hover:bg-green-250 border-green-950 border-2"
                                    onClick={() => {onUpdateRepo(repoToEdit.id, editFormData); setIsEditModalOpen(false); setRepoToEdit(null)}}>
                                Save changes
                            </button>
                        </div>
                    </div>
                </div>

            ) : null
            }

            {/* Modal para ver os detalhes de um repositório */}
            {isViewModalOpen ? (
                <div>
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="bg-secondary border border-gray-700 p-6 rounded-xl w-full max-w-md shadow-2xl">
                            <h2 className=" text-2xl font-bold text-white">
                                {repoToView.name}
                            </h2>
                            <div className="grid">
                                <div>
                                    <h2>Github Repository ID: {repoToView.github_repo_id}</h2>
                                </div>
                                <div className="flex items-center">
                                    <h2>Language:</h2>
                                    <span className="flex items-center gap-1 text-gray-300 bg-secondary px-3 py-1 rounded-full">
                                        <Code size={14} className="text-accent"/> {repoToView.language}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <h2>Stars Given: </h2>
                                    <span className="flex items-center gap-1 text-gray-300 bg-secondary px-3 py-1 rounded-full ">
                                    <Star size={14} className="text-yellow-500"/> {repoToView.stars_count}
                                    </span>
                                </div>
                                <div>
                                    <h2>Created at: {new Date(repoToView.created_at).toLocaleDateString('pt-PT')}</h2>
                                </div>
                                <div className="flex items-center" >
                                    <h2>Complexity:</h2>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getComplexityBadge(repoToView).classes}`}>{getComplexityBadge(repoToView).label}</span>
                                </div>

                            </div>
                            <div className="flex justify-end gap-3">
                                <button className="cursor-pointer w-18 bg-red-500 text-white rounded-2xl hover:bg-red-250 border-red-950 border-2"
                                        onClick={() => {setIsViewModalOpen(false); setRepoToView(null)}}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null
            }
        </div>
    )
}
export default RepositoriesPage
