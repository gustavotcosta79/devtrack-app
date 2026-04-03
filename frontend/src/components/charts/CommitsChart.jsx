import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CommitsChart = ({ data }) => {

    // 1. Converter o dicionário para o formato do Recharts
    // Passa de {"2026-02": 18} para [{ name: "2026-02", commits: 18 }]
    const chartData = Object.keys(data || {}).map(key => ({
        name: key, // O Mês/Ano
        commits: data[key] // O número de commits
    }));

    // 2. Opcional: Inverter a ordem se o backend mandar do mais recente para o mais antigo,
    // para que o gráfico leia da esquerda (passado) para a direita (presente).
    chartData.reverse();

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                {/* Grelha de fundo subtil */}
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />

                {/* Eixos */}
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />

                {/* Tooltip com design escuro */}
                <Tooltip
                    contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#10B981', fontWeight: 'bold' }}
                    cursor={{ fill: '#2A2A2A' }} // Cor de fundo da barra quando passas o rato
                />

                {/* A Barra de Commits! Usamos a nossa cor verde (accent) e arredondamos o topo */}
                <Bar
                    dataKey="commits"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]} // Arredonda os cantos superiores da barra
                    barSize={40} // Largura máxima da barra para não ficar gigante se houver poucos meses
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default CommitsChart;