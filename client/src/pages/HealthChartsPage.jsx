import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import BloodPressureChart from '../components/charts/BloodPressureChart';
import BloodSugarChart from '../components/charts/BloodSugarChart';
import WeightChart from '../components/charts/WeightChart';
import HeartRateChart from '../components/charts/HeartRateChart';

export default function HealthChartsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30'); // days

    useEffect(() => {
        fetchHealthData();
    }, [timeRange]);

    const fetchHealthData = async () => {
        try {
            setLoading(true);
            const { getHealthLogs } = await import('../services/healthService');

            // Calculate date range
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - parseInt(timeRange));

            const data = await getHealthLogs({
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                limit: 100
            });

            setLogs(data.healthLogs || []);
        } catch (error) {
            console.error('Error fetching health data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="page-container gradient-bg">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="spinner"></div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="page-container gradient-bg">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Health Trends 📈
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Visualize your health journey over time
                    </p>
                </div>

                {/* Time Range Filter */}
                <div className="mb-6 flex gap-3">
                    <button
                        onClick={() => setTimeRange('7')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${timeRange === '7'
                                ? 'bg-primary-500 text-white shadow-lg'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        7 Days
                    </button>
                    <button
                        onClick={() => setTimeRange('30')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${timeRange === '30'
                                ? 'bg-primary-500 text-white shadow-lg'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        30 Days
                    </button>
                    <button
                        onClick={() => setTimeRange('90')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${timeRange === '90'
                                ? 'bg-primary-500 text-white shadow-lg'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        90 Days
                    </button>
                </div>

                {/* Charts Grid */}
                {logs.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                            No health data available for the selected time range
                        </p>
                        <p className="text-gray-400 dark:text-gray-500">
                            Start logging your health metrics to see trends
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Blood Pressure Chart */}
                        <BloodPressureChart logs={logs} />

                        {/* Two Column Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <BloodSugarChart logs={logs} />
                            <WeightChart logs={logs} />
                        </div>

                        {/* Heart Rate Chart */}
                        <HeartRateChart logs={logs} />

                        {/* Stats Summary */}
                        <div className="glass-card p-6">
                            <h3 className="text-xl font-bold mb-4">Period Summary</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">Total Logs</p>
                                    <p className="text-2xl font-bold text-primary-600">{logs.length}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">Time Range</p>
                                    <p className="text-2xl font-bold text-primary-600">{timeRange} Days</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">First Entry</p>
                                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                        {new Date(logs[logs.length - 1]?.logDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">Latest Entry</p>
                                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                        {new Date(logs[0]?.logDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
