import React from 'react'
import { Brain, Sparkles} from 'lucide-react';


const AiRecommendation = ({recommendation,isLoading}) => {

    if (!isLoading && !recommendation) return null;

    return (
        <div className="bg-secondary p-6 mb-8 border-accent/50 w-full rounded-2xl md:p-8 border relative shadow-[0_0_20px_rgba(16,185,129,0.15)]">

            <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl"></div>

            <div className="flex items-center gap-3 mb-4">
                <Brain className="text-accent" size={28}/>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-accent to-emerald-200">
                    AI Recommendation
                </h2>
            </div>

            <div className="relative z-10">
                {isLoading ? (
                    <div className="flex items-center gap-3 text-accent animate-pulse">
                        <Sparkles className="animate-spin size={20}"/>
                        <span className="text-lg font-medium">Analysing the code and generating recommendations...</span>
                    </div>
                ) : (
                    <p className="text-gray-300 text-lg leading-relaxed font-medium animate-in fade-in duration-1000">
                        {recommendation }
                    </p>
                )}
            </div>
        </div>
    );
};
export default AiRecommendation
