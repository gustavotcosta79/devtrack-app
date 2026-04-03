import React from 'react'

const StatCard = ({title, value, icon: Icon}) => {
    return (
        <div className="bg-secondary p-6 rounded-xl border border-gray-800 flex items-center space-x-4 hover:border-accent transition-colors">
            <div className="p-4 bg-primary rounded-lg text-accent">
                {Icon && <Icon size={24} />}
            </div>

            <div>
                <p className="text-gray-400 text-sm font-medium">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    );
};
export default StatCard
