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

export default function WeightChart({ logs }) {
    const dates = logs.map(log => new Date(log.logDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    const weightData = logs.map(log => log.weight ? parseFloat(log.weight) : null);

    const data = {
        labels: dates.reverse(),
        datasets: [
            {
                label: 'Weight (kg)',
                data: weightData.reverse(),
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: 'rgb(16, 185, 129)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Weight Tracking',
                color: '#1f2937',
                font: {
                    size: 18,
                    weight: 'bold'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                callbacks: {
                    label: function (context) {
                        return 'Weight: ' + context.parsed.y + ' kg';
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                ticks: {
                    color: '#6b7280',
                    callback: function (value) {
                        return value + ' kg';
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                ticks: {
                    color: '#6b7280',
                    maxRotation: 45
                },
                grid: {
                    display: false
                }
            }
        }
    };

    if (logs.length === 0 || weightData.every(val => val === null)) {
        return (
            <div className="glass-card p-6 h-80 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">No weight data available</p>
            </div>
        );
    }

    return (
        <div className="glass-card p-6 h-80">
            <Line data={data} options={options} />
        </div>
    );
}
