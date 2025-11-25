import api from './api';

export const fetchBodyPartHint = async (exerciseId) => {
    try {
        const response = await api.get(`/exercises/hint/body-part/`, { exerciseId: exerciseId });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch body part hint:", error);
        throw error;
    }
};

export const fetchInstructionsHint = async (exerciseId) => {
    try {
        const response = await api.get(`/exercises/hint/instructions/`, { exerciseId: exerciseId });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch instructions hint:", error);
        throw error;
    }
};

export const fetchGifHint = async (exerciseId) => {
    try {
        const response = await api.get(`/exercises/hint/gif-url/`, { exerciseId: exerciseId });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch GIF hint:", error);
        throw error;
    }
};