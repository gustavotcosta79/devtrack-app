import React, { useMemo } from 'react'

const movieQuotes = [
    { text: "These aren't the URLs you're looking for... *Jedi hand wave*" },
    { text: "YOU SHALL NOT PASS! ...because this route is not defined." },
    { text: "Hasta la vista, page. The link you were looking for has been terminated." },
    { text: "Houston, we have a (404) problem. We've lost connection with this URL." },
    { text: "I see dead pages..." },
    { text: "I'm gonna make you an offer you can't refuse: go back to the base, because this page doesn't exist." }
];

const NotFoundPage = ({navigate}) => {

    // Escolhe uma frase aleatória apenas uma vez quando o componente é renderizado
    const randomQuote = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * movieQuotes.length);
        return movieQuotes[randomIndex];
    }, []);

    return (
        <div className="flex flex-col gap-8 items-center justify-center mt-20 px-4 text-center animate-in fade-in zoom-in duration-500">

            <h1 className="text-8xl font-black text-transparent bg-clip-text bg-linear-to-r from-accent to-emerald-200 drop-shadow-lg">
                404
            </h1>

            <div className="bg-secondary border border-gray-800 p-8 rounded-2xl max-w-lg shadow-[0_0_20px_rgba(16,185,129,0.1)] relative">
                <p className="text-xl text-gray-300 italic mb-4 relative z-10">
                    {randomQuote.text}
                </p>
            </div>

            <button className="border-2 border-accent text-xl font-bold gap-2 px-8 py-4 rounded-xl bg-primary hover:bg-accent hover:text-white transition-all cursor-pointer shadow-lg"
                    onClick={() => navigate("/")}>
                Go back to the base
            </button>

        </div>
    )
}

export default NotFoundPage