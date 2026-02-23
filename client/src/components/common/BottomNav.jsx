import { Link, useLocation } from 'react-router-dom';
import { useUI } from '../../context/UIContext';

export default function BottomNav() {
    const location = useLocation();
    const { openLogger } = useUI();

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: '/dashboard', label: 'Home', icon: '📊' },
        { path: '/medicines', label: 'Meds', icon: '💊' },
        { path: '/ai-chat', label: 'AI', icon: '✨' },
        { path: '/doctors', label: 'Docs', icon: '👨‍⚕️' },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 z-50 px-2 py-1 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center max-w-lg mx-auto relative px-2">

                {/* Home & Meds */}
                <div className="flex space-x-2 flex-1 justify-around">
                    {navLinks.slice(0, 2).map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex flex-col items-center p-2 rounded-xl transition-all ${isActive(link.path)
                                ? 'text-primary-600'
                                : 'text-gray-500 dark:text-gray-400'
                                }`}
                        >
                            <span className="text-xl mb-0.5">{link.icon}</span>
                            <span className="text-[10px] font-medium uppercase tracking-wider">{link.label}</span>
                        </Link>
                    ))}
                </div>

                {/* Central "Log" Button */}
                <div className="relative -top-4 px-2">
                    <button
                        onClick={openLogger}
                        className="w-14 h-14 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white dark:border-gray-800 active:scale-95 transition-transform"
                    >
                        <span className="text-2xl">➕</span>
                    </button>
                </div>

                {/* AI & Settings */}
                <div className="flex space-x-2 flex-1 justify-around">
                    {navLinks.slice(2).map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex flex-col items-center p-2 rounded-xl transition-all ${isActive(link.path)
                                ? 'text-primary-600'
                                : 'text-gray-500 dark:text-gray-400'
                                }`}
                        >
                            <span className="text-xl mb-0.5">{link.icon}</span>
                            <span className="text-[10px] font-medium uppercase tracking-wider">{link.label}</span>
                        </Link>
                    ))}
                </div>

            </div>
        </div>
    );
}
