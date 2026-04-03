import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Uma paleta de cores vibrantes para as diferentes fatias do gráfico
const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'];

const FavoriteLanguagesChart = ({ data }) => {

    // O useMemo garante que só fazemos estas contas matemáticas quando a data muda
    const chartData = useMemo(() => {
        if (!data) return [];

        const langCounts = {};

        // 1. Percorrer todos os anos e somar as linguagens
        Object.values(data).forEach(yearData => {
            Object.entries(yearData).forEach(([lang, count]) => {
                langCounts[lang] = (langCounts[lang] || 0) + count;
            });
        });

        // 2. Transformar no formato do Recharts, ordenar e ficar apenas com o Top 5
        return Object.entries(langCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5); // Apenas as 5 linguagens principais para o gráfico não ficar confuso

    }, [data]);

    // Se o utilizador não tiver linguagens (ex: repositórios vazios)
    if (chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                Sem dados de linguagens
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                {/* O nosso Gráfico Circular (innerRadius cria o efeito de "Donut") */}
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60} // Raio interno (o buraco)
                    outerRadius={80} // Raio externo
                    paddingAngle={5} // Espaço entre as fatias
                    dataKey="value"
                    stroke="none" // Tira as bordas brancas feias
                >
                    {/* Pintar cada fatia com uma cor diferente da nossa paleta */}
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>

                {/* A Tooltip que aparece ao passar o rato */}
                <Tooltip
                    contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />

                {/* A Legenda em baixo com o nome das linguagens */}
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default FavoriteLanguagesChart;