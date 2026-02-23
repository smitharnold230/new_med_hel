import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/common/Navbar';
import BloodPressureChart from '../components/charts/BloodPressureChart';
import BloodSugarChart from '../components/charts/BloodSugarChart';
import WeightChart from '../components/charts/WeightChart';
import HeartRateChart from '../components/charts/HeartRateChart';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function HealthChartsPage() {
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30'); // days or 'custom'
    const [customDates, setCustomDates] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    const chartsRef = useRef(null);

    useEffect(() => {
        if (timeRange !== 'custom') {
            fetchHealthData();
        }
    }, [timeRange]);

    const fetchHealthData = async () => {
        try {
            setLoading(true);
            const { getHealthLogs } = await import('../services/healthService');

            let startDate, endDate;

            if (timeRange === 'custom') {
                startDate = new Date(customDates.startDate);
                endDate = new Date(customDates.endDate);
            } else {
                endDate = new Date();
                startDate = new Date();
                startDate.setDate(startDate.getDate() - parseInt(timeRange));
            }

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

    const handleCustomFilter = () => {
        setTimeRange('custom');
        fetchHealthData();
    };



    const downloadCSV = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/health/export`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `health_logs_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading CSV:', error);
            alert('Failed to export data.');
        }
    };

    const shareReport = async () => {
        const email = window.prompt("Enter doctor's email address:");
        if (!email) return;

        try {
            const { default: api } = await import('../services/api');
            await api.post('/health/share', {
                email,
                timeRange,
                logs
            });
            alert('Report shared successfully!');
        } catch (error) {
            console.error('Error sharing report:', error);
            alert('Failed to share report.');
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
            <div className="page-container gradient-bg min-h-screen p-4 md:p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header - Stacked on Mobile */}
                    <div className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2 whitespace-nowrap">
                                Health Trends 📈
                            </h1>
                            <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400">
                                Visualize your health journey over time
                            </p>
                        </div>
                        <div className="flex flex-wrap w-full md:w-auto gap-3">
                            <button
                                onClick={shareReport}
                                className="flex-1 md:flex-none btn-secondary flex items-center justify-center gap-2 text-sm md:text-base"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                </svg>
                                Share
                            </button>
                            <button
                                onClick={downloadCSV}
                                className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                                Export CSV
                            </button>

                        </div>
                    </div>

                    {/* Date Filter Controls - Grid on Mobile */}
                    <div className="mb-6 space-y-4">
                        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-3">
                            {['7', '30', '90', 'custom'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all text-sm md:text-base ${timeRange === range
                                        ? 'bg-primary-500 text-white shadow-lg'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {range === 'custom' ? 'Custom Range' : `${range} Days`}
                                </button>
                            ))}
                        </div>

                        {/* Custom Date Inputs */}
                        {timeRange === 'custom' && (
                            <div className="flex flex-col sm:flex-row items-end gap-3 animate-fade-in p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm w-full md:w-fit">
                                <div className="w-full sm:w-auto">
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={customDates.startDate}
                                        onChange={(e) => setCustomDates({ ...customDates, startDate: e.target.value })}
                                        className="input-field py-1 w-full"
                                    />
                                </div>
                                <div className="w-full sm:w-auto">
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        value={customDates.endDate}
                                        onChange={(e) => setCustomDates({ ...customDates, endDate: e.target.value })}
                                        className="input-field py-1 w-full"
                                    />
                                </div>
                                <button
                                    onClick={handleCustomFilter}
                                    className="btn-primary py-1.5 px-4 h-[38px] w-full sm:w-auto"
                                >
                                    Apply
                                </button>
                            </div>
                        )}
                    </div>

                    <div ref={chartsRef} className="p-3 md:p-6 bg-white/50 dark:bg-gray-900/50 rounded-xl">
                        {/* Charts Grid */}
                        {logs.length === 0 ? (
                            <div className="glass-card p-8 md:p-12 text-center">
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
                                <div className="glass-card p-4 md:p-6">
                                    <h3 className="text-lg md:text-xl font-bold mb-4">Period Summary</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">Total Logs</p>
                                            <p className="text-xl md:text-2xl font-bold text-primary-600">{logs.length}</p>
                                        </div>
                                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">Time Range</p>
                                            <p className="text-xl md:text-2xl font-bold text-primary-600">{timeRange === 'custom' ? 'Custom' : `${timeRange} Days`}</p>
                                        </div>
                                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">First Entry</p>
                                            <p className="text-sm md:text-lg font-semibold text-gray-700 dark:text-gray-300">
                                                {new Date(logs[logs.length - 1]?.logDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">Latest Entry</p>
                                            <p className="text-sm md:text-lg font-semibold text-gray-700 dark:text-gray-300">
                                                {new Date(logs[0]?.logDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
