import api from './api';

// Create new doctor
export const createDoctor = async (doctorData) => {
    const response = await api.post('/doctors', doctorData);
    return response.data;
};

// Get all doctors
export const getDoctors = async () => {
    const response = await api.get('/doctors');
    return response.data;
};

// Get single doctor
export const getDoctorById = async (id) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
};

// Update doctor
export const updateDoctor = async (id, doctorData) => {
    const response = await api.put(`/doctors/${id}`, doctorData);
    return response.data;
};

// Delete doctor
export const deleteDoctor = async (id) => {
    const response = await api.delete(`/doctors/${id}`);
    return response.data;
};

export const uploadPrescription = async (id, file) => {
    const formData = new FormData();
    formData.append('prescription', file);
    const response = await api.post(`/doctors/${id}/prescription`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};
