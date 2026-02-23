import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHealthLogs, createHealthLog } from '../services/healthService';
import HealthLogger from '../components/health/HealthLogger';
import HealthSummary from '../components/dashboard/HealthSummary';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Navbar from '../components/common/Navbar';
import { useUI } from '../context/UIContext';

export default function DashboardPage() {
    const { user } = useAuth();
    const { openLogger } = useUI();
    const [searchParams, setSearchParams] = useSearchParams();
    const [healthLogs, setHealthLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHealthLogs();

        // Listen for global health log creation to refresh
        const handleNewLog = () => fetchHealthLogs();
        window.addEventListener('health-log-created', handleNewLog);

        // Open logger if action=log is in URL
        if (searchParams.get('action') === 'log') {
            openLogger();
            // Clear the param after opening so it doesn't reopen on refresh
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('action');
            setSearchParams(newParams, { replace: true });
        }

        return () => window.removeEventListener('health-log-created', handleNewLog);
    }, [searchParams, setSearchParams, openLogger]);

    const fetchHealthLogs = async () => {
        try {
            const data = await getHealthLogs({ limit: 10 });
            setHealthLogs(data.healthLogs || []);
        } catch (error) {
            console.error('Error fetching health logs:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <Navbar />
            <div className="page-container gradient-bg">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                        Welcome back, {user?.name}! 👋
                    </h1>
                    <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400">
                        Track your health metrics and monitor your wellness journey
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="mb-8 flex gap-3">
                    <button
                        onClick={openLogger}
                        className="btn-primary flex items-center gap-1.5 whitespace-nowrap px-3 sm:px-6 py-2 text-sm sm:text-base"
                    >
                        + Log Health Data
                    </button>
                </div>

                {/* Health Summary */}
                <HealthSummary logs={healthLogs} />

                {/* Recent Logs Table */}
                <div className="glass-card p-6 mt-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 whitespace-nowrap">Recent Health Logs</h2>

                    {healthLogs.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                No health logs yet. Start tracking your health today!
                            </p>
                            <button
                                onClick={openLogger}
                                className="btn-primary"
                            >
                                Create Your First Log
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left py-3 px-4">Date</th>
                                        <th className="text-left py-3 px-4">BP</th>
                                        <th className="text-left py-3 px-4">Sugar</th>
                                        <th className="text-left py-3 px-4">Weight</th>
                                        <th className="text-left py-3 px-4">Heart Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {healthLogs.map((log) => (
                                        <tr
                                            key={log.id}
                                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                        >
                                            <td className="py-3 px-4">
                                                {new Date(log.logDate).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-4">
                                                {log.systolic && log.diastolic
                                                    ? `${log.systolic}/${log.diastolic}`
                                                    : '-'}
                                            </td>
                                            <td className="py-3 px-4">
                                                {log.bloodSugar ? `${log.bloodSugar} mg/dL` : '-'}
                                            </td>
                                            <td className="py-3 px-4">
                                                {log.weight ? `${log.weight} kg` : '-'}
                                            </td>
                                            <td className="py-3 px-4">
                                                {log.heartRate ? `${log.heartRate} bpm` : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
