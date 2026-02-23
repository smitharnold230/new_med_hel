import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import { getDoctors, createDoctor, deleteDoctor } from '../services/doctorService';
import { toast } from 'react-hot-toast';

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        specialization: '',
        hospital: '',
        phone: '',
        email: '',
        address: '',
        notes: ''
    });

    // Upload Modal State
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [uploadDate, setUploadDate] = useState(new Date().toISOString().split('T')[0]);
    const [uploadFile, setUploadFile] = useState(null);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const data = await getDoctors();
            setDoctors(data.doctors || []);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            toast.error('Failed to load doctors');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createDoctor(formData);
            toast.success('Doctor added successfully!');
            setShowModal(false);
            setFormData({
                name: '',
                specialization: '',
                hospital: '',
                phone: '',
                email: '',
                address: '',
                notes: ''
            });
            fetchDoctors();
        } catch (error) {
            console.error('Error adding doctor:', error);
            toast.error(error.response?.data?.message || 'Failed to add doctor');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this doctor?')) return;
        try {
            await deleteDoctor(id);
            toast.success('Doctor deleted');
            fetchDoctors();
        } catch (error) {
            console.error('Error deleting doctor:', error);
            toast.error('Failed to delete doctor');
        }
    };

    const openUploadModal = (doctor) => {
        setSelectedDoctor(doctor);
        setUploadDate(new Date().toISOString().split('T')[0]);
        setUploadFile(null);
        setShowUploadModal(true);
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        if (!uploadFile || !selectedDoctor) return;

        try {
            const { uploadPrescription } = await import('../services/doctorService');
            // Create FormData to send file and date
            // valid way for backend to read is via FormData
            // but our service might expect just file and id, let's check service
            // actually we need to modify service too or pass extra args

            // Temporary fix: we need to update the service to accept date
            // For now, let's assume we update service locally

            // We need to manually construct the request here or update service
            // Let's implement the logic here to be safe and clear
            const formData = new FormData();
            formData.append('prescription', uploadFile);
            formData.append('date', uploadDate);

            const { default: api } = await import('../services/api');
            await api.post(`/doctors/${selectedDoctor.id}/prescription`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Prescription uploaded successfully');
            setShowUploadModal(false);
            fetchDoctors();
        } catch (error) {
            console.error('Error uploading prescription:', error);
            toast.error('Failed to upload prescription');
        }
    };

    return (
        <>
            <Navbar />
            <div className="page-container gradient-bg min-h-screen">
                <div className="flex justify-between items-center mb-8 gap-4">
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
                            My Doctors 👨‍⚕️
                        </h1>
                        <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400 mt-2 max-w-[180px] sm:max-w-none">
                            Manage your healthcare providers
                        </p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary flex items-center gap-1.5 whitespace-nowrap px-3 sm:px-6 py-2 text-sm sm:text-base"
                    >
                        <span>+</span> Add Doctor
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center mt-12">
                        <div className="spinner"></div>
                    </div>
                ) : doctors.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">You haven't added any doctors yet.</p>
                        <button onClick={() => setShowModal(true)} className="text-primary-600 font-medium hover:underline">
                            Add your first doctor
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {doctors.map((doctor) => (
                            <div key={doctor.id} className="glass-card p-6 relative group flex flex-col h-full">
                                <button
                                    onClick={() => handleDelete(doctor.id)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete Doctor"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xl font-bold shrink-0">
                                        {doctor.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{doctor.name}</h3>
                                        <p className="text-primary-600 font-medium text-sm">{doctor.specialization || 'General Physician'}</p>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{doctor.hospital}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4 flex-grow">
                                    {doctor.phone && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                            📞 {doctor.phone}
                                        </p>
                                    )}
                                    {doctor.email && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                            📧 {doctor.email}
                                        </p>
                                    )}
                                </div>

                                {/* Prescriptions Section */}
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Prescriptions</h4>

                                    {doctor.prescriptions && doctor.prescriptions.length > 0 ? (
                                        <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                                            {doctor.prescriptions.map((script) => (
                                                <div key={script.id} className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        {new Date(script.date).toLocaleDateString()}
                                                    </span>
                                                    <a
                                                        href={`${import.meta.env.VITE_API_URL}/${script.file_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary-600 hover:text-primary-700 flex items-center gap-1 text-xs font-medium"
                                                    >
                                                        View
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400 mb-3 italic">No prescriptions yet</p>
                                    )}

                                    <button
                                        onClick={() => openUploadModal(doctor)}
                                        className="w-full py-1.5 border border-dashed border-primary-300 rounded-lg text-primary-600 hover:bg-primary-50 text-xs font-medium transition-colors flex items-center justify-center gap-1"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Prescription
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Doctor Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="glass-card w-full max-w-lg p-6 animate-fade-in relative max-h-[90vh] overflow-y-auto">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                ✕
                            </button>

                            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Add New Doctor</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="Dr. Smith"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Specialization</label>
                                        <input
                                            type="text"
                                            name="specialization"
                                            value={formData.specialization}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="Cardiologist"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hospital / Clinic</label>
                                    <input
                                        type="text"
                                        name="hospital"
                                        value={formData.hospital}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="City Hospital"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="+1 234..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="doctor@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="input-field min-h-[80px]"
                                        placeholder="Clinic address..."
                                    />
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                    >
                                        Save Doctor
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Upload Prescription Modal */}
                {showUploadModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="glass-card w-full max-w-md p-6 animate-fade-in relative">
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                ✕
                            </button>

                            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Upload Prescription</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Add a new prescription for <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedDoctor?.name}</span>
                            </p>

                            <form onSubmit={handleUploadSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prescription Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={uploadDate}
                                        onChange={(e) => setUploadDate(e.target.value)}
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">File (Image/PDF)</label>
                                    <input
                                        type="file"
                                        required
                                        accept="image/*,application/pdf"
                                        onChange={(e) => setUploadFile(e.target.files[0])}
                                        className="block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-primary-50 file:text-primary-700
                                            hover:file:bg-primary-100
                                            dark:file:bg-gray-700 dark:file:text-gray-300
                                        "
                                    />
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowUploadModal(false)}
                                        className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        disabled={!uploadFile}
                                    >
                                        Upload
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
