import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHealthLogs, createHealthLog } from '../services/healthService';
import HealthLogger from '../components/health/HealthLogger';
import HealthSummary from '../components/dashboard/HealthSummary';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Navbar from '../components/common/Navbar';

export default function DashboardPage() {
    const { user } = useAuth();
    const [healthLogs, setHealthLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLogger, setShowLogger] = useState(false);

    useEffect(() => {
        fetchHealthLogs();
    }, []);

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

    const handleLogSubmit = async (logData) => {
        try {
            await createHealthLog(logData);
            setShowLogger(false);
            fetchHealthLogs(); // Refresh logs
        } catch (error) {
            console.error('Error creating log:', error);
            throw error;
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
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome back, {user?.name}! 👋
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Track your health metrics and monitor your wellness journey
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="mb-8 flex gap-3">
                    <button
                        onClick={() => setShowLogger(!showLogger)}
                        className="btn-primary"
                    >
                        {showLogger ? '✕ Close Logger' : '+ Log Health Data'}
                    </button>
                    <Link to="/charts" className="btn-secondary">
                        📊 View Charts
                    </Link>
                </div>

                {/* Health Logger */}
                {showLogger && (
                    <div className="mb-8 animate-slide-up">
                        <HealthLogger onSubmit={handleLogSubmit} />
                    </div>
                )}

                {/* Health Summary */}
                <HealthSummary logs={healthLogs} />

                {/* Recent Logs Table */}
                <div className="glass-card p-6 mt-8">
                    <h2 className="text-2xl font-bold mb-4">Recent Health Logs</h2>

                    {healthLogs.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                No health logs yet. Start tracking your health today!
                            </p>
                            <button
                                onClick={() => setShowLogger(true)}
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
