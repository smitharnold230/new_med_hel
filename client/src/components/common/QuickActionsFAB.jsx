import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';

export default function QuickActionsFAB() {
    const [isOpen, setIsOpen] = useState(false);
    const { openLogger } = useUI();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated) return null;

    const toggleMenu = () => setIsOpen(!isOpen);

    const actions = [
        {
            label: 'AI Chat',
            icon: '🤖',
            color: 'bg-purple-500',
            onClick: () => {
                navigate('/ai-chat');
                setIsOpen(false);
            }
        },
        {
            label: 'Log Vitals',
            icon: '📊',
            color: 'bg-blue-500',
            onClick: () => {
                openLogger();
                setIsOpen(false);
            }
        }
    ];

    return (
        <div className="hidden md:block fixed bottom-36 right-6 z-40">
            {/* Action Menu */}
            {isOpen && (
                <div className="flex flex-col-reverse items-end gap-3 mb-4 animate-fade-in-up">
                    {actions.map((action, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <span className="bg-white dark:bg-gray-800 px-3 py-1 rounded-lg text-sm font-medium shadow-lg text-gray-700 dark:text-gray-200">
                                {action.label}
                            </span>
                            <button
                                onClick={action.onClick}
                                className={`w-12 h-12 ${action.color} text-white rounded-full shadow-lg flex items-center justify-center text-xl hover:scale-110 transition-transform active:scale-95`}
                            >
                                {action.icon}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Main FAB */}
            <button
                onClick={toggleMenu}
                className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl text-white transition-all duration-300 ${isOpen ? 'bg-red-500 rotate-45' : 'bg-blue-600 hover:bg-blue-700'
                    } active:scale-90`}
            >
                {isOpen ? '✕' : '+'}
            </button>
        </div>
    );
}
