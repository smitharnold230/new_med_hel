import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/charts', label: 'Charts', icon: '📈' },
        { path: '/doctors', label: 'Doctors', icon: '👨‍⚕️' },
        { path: '/medicines', label: 'Medicines', icon: '💊' },
        { path: '/ai-chat', label: 'AI Assistant', icon: '✨' },
    ];

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo & Brand */}
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex items-center space-x-2 whitespace-nowrap">
                            <span className="text-xl sm:text-2xl">🏥</span>
                            <span className="text-base sm:text-lg md:text-xl font-bold text-gray-800 dark:text-white">
                                Health Tracker
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 font-medium ${isActive(link.path)
                                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <span>{link.icon}</span>
                                <span>{link.label}</span>
                            </Link>
                        ))}

                        {/* User Menu */}
                        <div className="ml-4 pl-4 border-l border-gray-200 dark:border-gray-700 flex items-center gap-3">
                            <Link to="/profile" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                {user?.name}
                            </Link>
                            <Link to="/settings" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                ⚙️
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-sm font-medium transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Mobile View: Simple Header */}
                    <div className="flex items-center md:hidden space-x-4">
                        <Link to="/settings" className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                            <span className="text-xl">⚙️</span>
                        </Link>
                        <Link to="/profile" className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold border border-primary-200">
                            {user?.name?.charAt(0)}
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="p-1.5 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                            title="Logout"
                        >
                            <svg
                                className="w-6 h-6 text-red-500 drop-shadow-[0_0_3px_rgba(239,68,68,0.3)]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
