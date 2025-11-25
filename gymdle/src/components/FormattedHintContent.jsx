import React from 'react';

const FormattedHintContent = ({ activeHint, content }) => {
    if (!content) {
        return <p className="text-gray-500 font-medium mb-2 whitespace-pre-wrap">Dica não carregada ou N/A.</p>;
    }

    if (activeHint === 'body') {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <p className="capitalize text-center text-3xl font-bold text-white whitespace-pre-wrap py-2">
                    {content}
                </p>
            </div>
        );
    }

    if (activeHint === 'instructions') {
        const instructions = content.split('\n').filter(step => step.trim() !== '');
        
        return (
            <ol className="list-decimal list-inside text-left space-y-2 mt-2 text-gray-300">
                {instructions.map((step, index) => (
                    <li key={index} className="pl-2 text-sm">
                        {step.replace(/Passo:\d\s?/, '').trim()} 
                    </li>
                ))}
            </ol>
        );
    }
    
    return (
        <p className="text-gray-300 font-medium mb-2 whitespace-pre-wrap">
            {content}
        </p>
    );
};

export default FormattedHintContent;