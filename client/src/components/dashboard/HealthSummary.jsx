import { useMemo } from 'react';

export default function HealthSummary({ logs }) {
    const stats = useMemo(() => {
        if (!logs || logs.length === 0) {
            return {
                avgSystolic: 0,
                avgDiastolic: 0,
                avgSugar: 0,
                avgHeartRate: 0,
                totalLogs: 0
            };
        }

        let systolicSum = 0, systolicCount = 0;
        let diastolicSum = 0, diastolicCount = 0;
        let sugarSum = 0, sugarCount = 0;
        let hrSum = 0, hrCount = 0;

        logs.forEach(log => {
            if (log.systolic) { systolicSum += log.systolic; systolicCount++; }
            if (log.diastolic) { diastolicSum += log.diastolic; diastolicCount++; }
            if (log.bloodSugar) { sugarSum += parseFloat(log.bloodSugar); sugarCount++; }
            if (log.heartRate) { hrSum += log.heartRate; hrCount++; }
        });

        return {
            avgSystolic: systolicCount > 0 ? Math.round(systolicSum / systolicCount) : 0,
            avgDiastolic: diastolicCount > 0 ? Math.round(diastolicSum / diastolicCount) : 0,
            avgSugar: sugarCount > 0 ? (sugarSum / sugarCount).toFixed(1) : 0,
            avgHeartRate: hrCount > 0 ? Math.round(hrSum / hrCount) : 0,
            totalLogs: logs.length
        };
    }, [logs]);

    const getHealthStatus = (type, value) => {
        if (type === 'bp_systolic') {
            if (value < 120) return 'badge-normal';
            if (value < 140) return 'badge-warning';
            return 'badge-danger';
        }
        if (type === 'sugar') {
            if (value < 100) return 'badge-normal';
            if (value < 126) return 'badge-warning';
            return 'badge-danger';
        }
        if (type === 'heart_rate') {
            if (value >= 60 && value <= 100) return 'badge-normal';
            return 'badge-warning';
        }
        return 'badge-normal';
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Blood Pressure Card */}
            <div className="metric-card">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                        Blood Pressure
                    </h3>
                    <span className="text-2xl">🩺</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stats.avgSystolic}/{stats.avgDiastolic}
                </p>
                <span className={`health-badge ${getHealthStatus('bp_systolic', stats.avgSystolic)}`}>
                    {stats.avgSystolic < 120 ? 'Normal' : stats.avgSystolic < 140 ? 'Elevated' : 'High'}
                </span>
            </div>

            {/* Blood Sugar Card */}
            <div className="metric-card">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                        Blood Sugar
                    </h3>
                    <span className="text-2xl">🩸</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stats.avgSugar}
                    <span className="text-lg text-gray-500"> mg/dL</span>
                </p>
                <span className={`health-badge ${getHealthStatus('sugar', parseFloat(stats.avgSugar))}`}>
                    {stats.avgSugar < 100 ? 'Normal' : stats.avgSugar < 126 ? 'Prediabetes' : 'High'}
                </span>
            </div>

            {/* Heart Rate Card */}
            <div className="metric-card">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                        Heart Rate
                    </h3>
                    <span className="text-2xl">❤️</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stats.avgHeartRate}
                    <span className="text-lg text-gray-500"> bpm</span>
                </p>
                <span className={`health-badge ${getHealthStatus('heart_rate', stats.avgHeartRate)}`}>
                    {stats.avgHeartRate >= 60 && stats.avgHeartRate <= 100 ? 'Normal' : 'Check'}
                </span>
            </div>

            {/* Total Logs Card */}
            <div className="metric-card">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                        Total Logs
                    </h3>
                    <span className="text-2xl">📊</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stats.totalLogs}
                </p>
                <span className="health-badge badge-normal">
                    Last 10 entries
                </span>
            </div>
        </div>
    );
}
