import api from './api';

export const fetchGuess = async (exerciseId) => {
    try {
        const response = await api.post(`/exercises/evaluate-game/`, { exerciseId: exerciseId });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch guess:", error);
        throw error;
    }
};