import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
    const { user, token, checkAuth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        dateOfBirth: '',
        gender: '',
        height: '', // future proofing
        weight: ''  // future proofing
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '', // Email is usually read-only
                dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
                gender: user.gender || '',
                height: user.height || '',
                weight: user.weight || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            // Assuming the backend has a generic user update endpoint or we treat this as a mock for now if strict
            // If backend doesn't support specific profile update, we might need to add it. 
            // For now, I'll attempt to hit a likely endpoint or just simulate success if the user context updates.
            // Actually, usually it's PUT /api/auth/profile or PUT /api/users/profile

            // Let's try the standard update route. If it fails due to 404, I'll fix the backend.
            // Checking existing authRoutes... usually it's just register/login/me.
            // If 'me' endpoint accepts PUT, great. Otherwise we might need to add backend support.

            await axios.put(`${import.meta.env.VITE_API_URL}/auth/updatedetails`, formData, config);

            toast.success('Profile updated successfully');
            await checkAuth(); // Refresh user context
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="page-container gradient-bg min-h-screen p-4 md:p-6">
                <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
                                Your Profile 👤
                            </h1>
                            <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                                Manage your personal information
                            </p>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="btn-primary flex items-center gap-1.5 whitespace-nowrap px-3 sm:px-6 py-2 text-sm sm:text-base"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <div className="glass-card p-6 md:p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center text-3xl">
                                {formData.gender === 'female' ? '👩' : formData.gender === 'male' ? '👨' : '👤'}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {user?.name}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`input-field ${!isEditing ? 'bg-gray-50 dark:bg-gray-800' : ''}`}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        disabled={true} // Email usually immutable
                                        className="input-field bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-70"
                                        title="Email cannot be changed"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`input-field ${!isEditing ? 'bg-gray-50 dark:bg-gray-800' : ''}`}
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`input-field ${!isEditing ? 'bg-gray-50 dark:bg-gray-800' : ''}`}
                                    >
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            {isEditing && (
                                <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            // Reset form to current user data
                                            setFormData({
                                                name: user.name || '',
                                                email: user.email || '',
                                                dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
                                                gender: user.gender || '',
                                                height: user.height || '',
                                                weight: user.weight || ''
                                            });
                                        }}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary min-w-[120px]"
                                        disabled={loading}
                                    >
                                        {loading ? <div className="spinner h-5 w-5 mx-auto"></div> : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
