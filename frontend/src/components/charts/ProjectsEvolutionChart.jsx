import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProjectsEvolutionChart = ({ data }) => {

    const chartData = useMemo(() => {
        if (!data) return [];

        // 1. Converter o dicionário para array
        const formattedData = Object.keys(data).map(year => ({
            name: year,
            projects: data[year]
        }));

        // 2. Ordenar cronologicamente (do ano mais pequeno para o maior)
        return formattedData.sort((a, b) => parseInt(a.name) - parseInt(b.name));
    }, [data]);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                {/* Grelha de fundo */}
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />

                {/* Eixos */}
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />

                {/* Tooltip bonita */}
                <Tooltip
                    contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#374151', borderRadius: '8px' }}
                    itemStyle={{ color: '#3B82F6', fontWeight: 'bold' }} // Cor azulada para contrastar com os verdes!
                />

                {/* A nossa Linha */}
                <Line
                    type="monotone"
                    dataKey="projects"
                    stroke="#3B82F6" // Um azul bonito para dar destaque
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }} // As bolinhas em cada ano
                    activeDot={{ r: 8 }} // A bolinha fica maior quando passas o rato
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default ProjectsEvolutionChart;