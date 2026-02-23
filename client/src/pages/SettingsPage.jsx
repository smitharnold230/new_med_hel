import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { updateProfile } from '../services/authService';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
    const { user, token, logout, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

    // Notification Settings
    const [reminderTime, setReminderTime] = useState(user?.reminderTime || 20);
    const [notificationsEnabled, setNotificationsEnabled] = useState(
        'Notification' in window && Notification.permission === 'granted'
    );

    // Password Change State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        // Sync dark mode
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    useEffect(() => {
        if (user?.reminderTime !== undefined) {
            setReminderTime(user.reminderTime);
        }
    }, [user]);

    const handleThemeToggle = () => {
        setDarkMode(!darkMode);
    };

    const handleReminderTimeChange = async (e) => {
        const time = parseInt(e.target.value);
        setReminderTime(time);
        try {
            await axios.put(
                `${import.meta.env.VITE_API_URL}/auth/profile`,
                { reminderTime: time },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Reminder time updated');
        } catch (error) {
            console.error('Error updating reminder time:', error);
            toast.error('Failed to update time');
        }
    };

    const requestNotificationPermission = () => {
        if (!('Notification' in window)) {
            toast.error('This browser does not support desktop notifications');
            return;
        }

        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                setNotificationsEnabled(true);
                toast.success('Notifications enabled!');
                new Notification('Health Tracker', { body: 'Notifications are working! 🔔' });
            } else {
                setNotificationsEnabled(false);
                toast.error('Notifications denied');
            }
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const submitPasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await axios.put(
                `${import.meta.env.VITE_API_URL}/auth/change-password`,
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Password changed successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure? This action is IRREVERSIBLE. All your data will be lost.')) return;

        // Double confirmation
        const input = window.prompt('Type "DELETE" to confirm account deletion:');
        if (input !== 'DELETE') return;

        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/auth/delete-account`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Account deleted. Goodbye! 👋');
            logout();
            window.location.href = '/login';
        } catch (error) {
            console.error('Error deleting account:', error);
            toast.error('Failed to delete account');
        }
    };

    return (
        <>
            <Navbar />
            <div className="page-container gradient-bg min-h-screen p-4 md:p-6">
                <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 whitespace-nowrap">Settings ⚙️</h1>

                    {/* Appearance Section */}
                    <section className="glass-card p-6">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b pb-2 border-gray-100 dark:border-gray-700 whitespace-nowrap">
                            Appearance 🌗
                        </h2>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={darkMode}
                                    onChange={handleThemeToggle}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </section>

                    {/* Notifications Section */}
                    <section className="glass-card p-6">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b pb-2 border-gray-100 dark:border-gray-700 whitespace-nowrap">
                            Notifications & Reminders 🔔
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Browser Notifications</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Get alerts for medicine times</p>
                                </div>
                                <button
                                    onClick={requestNotificationPermission}
                                    disabled={notificationsEnabled}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${notificationsEnabled
                                        ? 'bg-green-100 text-green-700 cursor-default'
                                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                        }`}
                                >
                                    {notificationsEnabled ? 'Enabled ✅' : 'Enable Notifications'}
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Daily Log Reminder</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">When should we remind you to log vitals?</p>
                                </div>
                                <select
                                    value={reminderTime}
                                    onChange={handleReminderTimeChange}
                                    className="input-field w-32"
                                >
                                    {Array.from({ length: 24 }).map((_, i) => (
                                        <option key={i} value={i}>
                                            {i === 0 ? '12 AM' : i === 12 ? '12 PM' : i > 12 ? `${i - 12} PM` : `${i} AM`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Privacy & AI Section */}
                    <section className="glass-card p-6">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b pb-2 border-gray-100 dark:border-gray-700 whitespace-nowrap">
                            Privacy & AI 🤖
                        </h2>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">AI Data Access</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Allow AI to analyze your health logs and meds</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={user?.aiDataAccess || false}
                                    onChange={async (e) => {
                                        const allowed = e.target.checked;
                                        try {
                                            const data = await updateProfile({ aiDataAccess: allowed });
                                            // Update context state
                                            updateUser(data.user);
                                            toast.success(allowed ? 'AI access enabled' : 'AI access disabled');
                                        } catch (error) {
                                            console.error('Error updating AI access:', error);
                                            toast.error('Failed to update settings');
                                        }
                                    }}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                            </label>
                        </div>
                    </section>

                    {/* Security Section */}
                    <section className="glass-card p-6">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b pb-2 border-gray-100 dark:border-gray-700 whitespace-nowrap">
                            Security 🔒
                        </h2>
                        <form onSubmit={submitPasswordChange} className="space-y-4 max-w-md">
                            <div>
                                <label className="form-label">Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="input-field"
                                    required
                                    minLength="6"
                                />
                            </div>
                            <div>
                                <label className="form-label">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full sm:w-auto"
                            >
                                {loading ? 'Updating...' : 'Change Password'}
                            </button>
                        </form>
                    </section>

                    {/* Data Management Section */}
                    <section className="glass-card p-6 border-l-4 border-red-500">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-red-600 dark:text-red-400 border-b pb-2 border-gray-100 dark:border-gray-700 whitespace-nowrap">
                            Danger Zone ⚠️
                        </h2>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Delete Account</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Permanently remove your account and all data</p>
                            </div>
                            <button
                                onClick={handleDeleteAccount}
                                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                            >
                                Delete Account
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
