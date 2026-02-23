import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useUI } from '../context/UIContext';

export default function MedicinePage() {
    const { token } = useAuth();
    const { openSafetyCheck } = useUI();
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        dosage: '',
        frequency: 'Daily',
        time: '',
        instructions: ''
    });

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/medicines`, config);
            setMedicines(res.data.medicines);
        } catch (error) {
            console.error('Error fetching medicines:', error);
            if (error.response && error.response.status === 401) {
                // If token is invalid/expired
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (medicine) => {
        setFormData({
            name: medicine.name,
            dosage: medicine.dosage,
            frequency: medicine.frequency,
            time: medicine.time || '',
            instructions: medicine.instructions || ''
        });
        setEditingId(medicine.id);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({
            name: '',
            dosage: '',
            frequency: 'Daily',
            time: '',
            instructions: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            if (editingId) {
                await axios.put(`${import.meta.env.VITE_API_URL}/medicines/${editingId}`, formData, config);
                toast.success('Medicine updated successfully');
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/medicines`, formData, config);
                toast.success('Medicine added successfully');
            }

            closeForm();
            fetchMedicines();
        } catch (error) {
            console.error('Error saving medicine:', error);
            toast.error('Failed to save medicine');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this medicine?')) return;
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            await axios.delete(`${import.meta.env.VITE_API_URL}/medicines/${id}`, config);
            toast.success('Medicine removed');
            fetchMedicines();
        } catch (error) {
            console.error('Error deleting medicine:', error);
            toast.error('Failed to delete medicine');
        }
    };

    return (
        <>
            <Navbar />
            <div className="page-container gradient-bg min-h-screen p-4 md:p-6">
                <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
                    {/* Header Section - Stacked on Mobile, Row on Desktop */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
                                Medicine Cabinet 💊
                            </h1>
                            <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                                Manage your prescriptions and get reminders
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">

                            <button
                                onClick={openSafetyCheck}
                                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                            >
                                <span>🛡️</span> Safety Check
                            </button>
                            <button
                                onClick={() => {
                                    setEditingId(null);
                                    setFormData({
                                        name: '',
                                        dosage: '',
                                        frequency: 'Daily',
                                        time: '',
                                        instructions: ''
                                    });
                                    setShowForm(true);
                                }}
                                className="w-full sm:w-auto btn-primary flex items-center justify-center gap-1.5 whitespace-nowrap px-3 sm:px-6 py-2 text-sm sm:text-base"
                            >
                                <span>+</span> Add Medicine
                            </button>
                        </div>
                    </div>

                    {/* Add/Edit Medicine Modal */}
                    {showForm && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                            <div className="glass-card w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
                                <button
                                    onClick={closeForm}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    ✕
                                </button>

                                <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
                                    {editingId ? 'Edit Prescription' : 'Add New Prescription'}
                                </h2>

                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="form-label">Medicine Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="e.g. Amoxicillin"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Dosage</label>
                                        <input
                                            type="text"
                                            name="dosage"
                                            value={formData.dosage}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="e.g. 500mg"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Frequency</label>
                                        <select
                                            name="frequency"
                                            value={formData.frequency}
                                            onChange={handleChange}
                                            className="input-field"
                                        >
                                            <option value="Daily">Daily</option>
                                            <option value="Weekly">Weekly</option>
                                            <option value="As Needed">As Needed</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">Time (Optional)</label>
                                        <input
                                            type="time"
                                            name="time"
                                            value={formData.time}
                                            onChange={handleChange}
                                            className="input-field"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="form-label">Instructions / Notes</label>
                                        <textarea
                                            name="instructions"
                                            value={formData.instructions}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="e.g. Take after food"
                                            rows="2"
                                        ></textarea>
                                    </div>
                                    <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                                        <button
                                            type="button"
                                            onClick={closeForm}
                                            className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn-primary">
                                            {editingId ? 'Update Medicine' : 'Save Medicine'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Medicine List */}
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="spinner"></div>
                        </div>
                    ) : medicines.length === 0 ? (
                        <div className="glass-card p-12 text-center">
                            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">Your medicine cabinet is empty.</p>
                            <p className="text-gray-600 dark:text-gray-500">Add your prescriptions to get reminders and AI insights.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {medicines.map((med) => (
                                <div key={med.id} className="glass-card p-6 relative group transform transition hover:scale-[1.02]">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                            {med.name}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <span className="bg-primary-100 text-primary-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-900">
                                                {med.frequency}
                                            </span>

                                            {/* Always visible on mobile, hover on desktop */}
                                            <div className="flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(med)}
                                                    className="text-gray-400 hover:text-blue-500 p-1"
                                                    title="Edit"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(med.id)}
                                                    className="text-gray-400 hover:text-red-500 p-1"
                                                    title="Remove"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                        <p className="flex items-center gap-2">
                                            <span className="font-semibold w-16">Dosage:</span> {med.dosage || 'N/A'}
                                        </p>
                                        {med.time && (
                                            <p className="flex items-center gap-2">
                                                <span className="font-semibold w-16">Time:</span> {med.time}
                                            </p>
                                        )}
                                        {med.instructions && (
                                            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                                <p className="italic text-gray-500">"{med.instructions}"</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
