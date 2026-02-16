import api from './api';

/**
 * Create new health log
 */
export const createHealthLog = async (logData) => {
    const response = await api.post('/health/logs', logData);
    return response.data;
};

/**
 * Get all health logs with pagination
 */
export const getHealthLogs = async (params = {}) => {
    const response = await api.get('/health/logs', { params });
    return response.data;
};

/**
 * Get single health log
 */
export const getHealthLog = async (id) => {
    const response = await api.get(`/health/logs/${id}`);
    return response.data;
};

/**
 * Update health log
 */
export const updateHealthLog = async (id, logData) => {
    const response = await api.put(`/health/logs/${id}`, logData);
    return response.data;
};

/**
 * Delete health log
 */
export const deleteHealthLog = async (id) => {
    const response = await api.delete(`/health/logs/${id}`);
    return response.data;
};

/**
 * Get health statistics
 */
export const getHealthStats = async (days = 30) => {
    const response = await api.get('/health/stats', { params: { days } });
    return response.data;
};
