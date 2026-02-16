import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function BloodPressureChart({ logs }) {
    // Prepare data
    const dates = logs.map(log => new Date(log.logDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    const systolicData = logs.map(log => log.systolic || null);
    const diastolicData = logs.map(log => log.diastolic || null);

    const data = {
        labels: dates.reverse(),
        datasets: [
            {
                label: 'Systolic',
                data: systolicData.reverse(),
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6
            },
            {
                label: 'Diastolic',
                data: diastolicData.reverse(),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#6b7280',
                    font: {
                        size: 12,
                        weight: '600'
                    }
                }
            },
            title: {
                display: true,
                text: 'Blood Pressure Trend',
                color: '#1f2937',
                font: {
                    size: 18,
                    weight: 'bold'
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14
                },
                bodyFont: {
                    size: 13
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                min: 40,
                max: 200,
                ticks: {
                    color: '#6b7280'
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                ticks: {
                    color: '#6b7280',
                    maxRotation: 45,
                    minRotation: 0
                },
                grid: {
                    display: false
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    if (logs.length === 0) {
        return (
            <div className="glass-card p-6 h-80 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">No blood pressure data available</p>
            </div>
        );
    }

    return (
        <div className="glass-card p-6 h-80">
            <Line data={data} options={options} />
        </div>
    );
}
