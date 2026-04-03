import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ScoreEvolutionChart = ({ data }) => {

    // 1. Converter o dicionário do Backend para o formato do Recharts
    // Se o data for {"2023-10": 85}, vira [{ name: "2023-10", score: 85 }]
    const chartData = Object.keys(data || {}).map(key => ({
        name: key, // A Data
        score: data[key] // O Valor do Score
    }));

    // Se o user for muito novo e só tiver 1 dia, o gráfico de linha fica estranho.
    // Isto é um truque para duplicar o ponto e fazer uma linha reta.
    if (chartData.length === 1) {
        chartData.push({ ...chartData[0], name: 'Hoje' });
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                {/* As linhas de fundo (grelha) */}
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />

                {/* Eixo X (Datas) e Eixo Y (Notas de 0 a 100) */}
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />

                {/* A janelinha preta que aparece quando passas o rato por cima */}
                <Tooltip
                    contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#374151', borderRadius: '8px' }}
                    itemStyle={{ color: '#10B981' }}
                />

                {/* A Magia: A linha do Gráfico! */}
                <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#10B981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorScore)" // Um gradiente verde bonito!
                />

                {/* Definição do gradiente de cor verde */}
                <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                </defs>
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default ScoreEvolutionChart;