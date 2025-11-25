import api from './api';

export const fetchExercisesNames = async () => {
    try {
        const response = await api.get('/exercises/simple/');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch exercise names:", error);
        throw error;
    }
};