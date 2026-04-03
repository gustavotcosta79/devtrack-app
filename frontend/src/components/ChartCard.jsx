import React from 'react'

const ChartCard = ({title,children}) => {
    return (
        <div className="bg-secondary p-6 rounded-xl border border-gray-800 flex flex-col h-72">
            <h2 className="text-gray-400 mb-4 text-left">
                {title}
            </h2>

            <div className="flex-1 w-full relative">
                {children}
            </div>
        </div>
    )
}
export default ChartCard
