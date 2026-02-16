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

export default function BloodSugarChart({ logs }) {
    const dates = logs.map(log => new Date(log.logDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    const sugarData = logs.map(log => log.bloodSugar ? parseFloat(log.bloodSugar) : null);

    const data = {
        labels: dates.reverse(),
        datasets: [
            {
                label: 'Blood Sugar (mg/dL)',
                data: sugarData.reverse(),
                borderColor: 'rgb(168, 85, 247)',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: 'rgb(168, 85, 247)',
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
                text: 'Blood Sugar Levels',
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
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += context.parsed.y + ' mg/dL';

                        // Add health status
                        const value = context.parsed.y;
                        if (value < 100) {
                            label += ' (Normal)';
                        } else if (value < 126) {
                            label += ' (Prediabetes)';
                        } else {
                            label += ' (High)';
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                min: 60,
                max: 200,
                ticks: {
                    color: '#6b7280',
                    callback: function (value) {
                        return value + ' mg/dL';
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

    if (logs.length === 0 || sugarData.every(val => val === null)) {
        return (
            <div className="glass-card p-6 h-80 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">No blood sugar data available</p>
            </div>
        );
    }

    return (
        <div className="glass-card p-6 h-80">
            <Line data={data} options={options} />
        </div>
    );
}
