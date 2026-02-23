import { useState, useEffect } from 'react';
import { getMedicines } from '../../services/medicineService';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const MedicineReminder = () => {
    const { token } = useAuth();
    const [medicines, setMedicines] = useState([]);
    const [notifiedTimes, setNotifiedTimes] = useState(new Set());

    // Request notification permission on mount with visual prompt if needed
    useEffect(() => {
        if (!('Notification' in window)) {
            console.log('This browser does not support desktop notification');
            return;
        }

        if (Notification.permission === 'default') {
            toast((t) => (
                <div className="flex flex-col gap-2">
                    <p className="font-medium text-gray-900">Enable Desktop Notifications? 🔔</p>
                    <p className="text-sm text-gray-500">We need this to remind you about your medicines even when you're not on this page.</p>
                    <div className="flex gap-2 mt-1">
                        <button
                            onClick={() => {
                                Notification.requestPermission().then(permission => {
                                    if (permission === 'granted') {
                                        toast.success('Awesome! You will be notified.');
                                    } else {
                                        toast.error('Notifications blocked.');
                                    }
                                    toast.dismiss(t.id);
                                });
                            }}
                            className="bg-primary-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-primary-700"
                        >
                            Enable
                        </button>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="text-gray-500 px-3 py-1.5 rounded text-sm hover:bg-gray-100"
                        >
                            Later
                        </button>
                    </div>
                </div>
            ), { duration: 10000, icon: '👋' });
        } else if (Notification.permission === 'denied') {
            // Optional: gently remind them if they blocked it
            console.log('Notifications are currently denied.');
        }
    }, []);

    // Fetch medicines when token changes and poll for updates
    useEffect(() => {
        if (token) {
            fetchMedicines();

            // Poll for data updates every 5 seconds to catch newly added meds immediately
            const pollId = setInterval(fetchMedicines, 5000);
            return () => clearInterval(pollId);
        }
    }, [token]);

    const fetchMedicines = async () => {
        try {
            const data = await getMedicines();
            console.log('Fetched medicines for reminders:', data.medicines);
            setMedicines(data.medicines || []);
        } catch (error) {
            console.error('Error fetching medicines for reminders:', error);
        }
    };

    // Check for reminders
    useEffect(() => {
        if (!medicines.length) return;

        const checkReminders = () => {
            const now = new Date();
            const currentHour = now.getHours().toString().padStart(2, '0');
            const currentMinute = now.getMinutes().toString().padStart(2, '0');
            const currentTime = `${currentHour}:${currentMinute}`;

            // Create a unique key for this minute to prevent double notifications
            const timeKey = `${now.toDateString()}-${currentTime}`;

            medicines.forEach(med => {
                // Check if we already notified for this med at this time
                const notificationKey = `${med.id}-${timeKey}`;

                if (med.time === currentTime && !notifiedTimes.has(notificationKey)) {
                    console.log(`Triggering reminder for ${med.name} at ${currentTime}`);
                    sendNotification(med);

                    // Mark as notified
                    setNotifiedTimes(prev => {
                        const newSet = new Set(prev);
                        newSet.add(notificationKey);
                        return newSet;
                    });
                }
            });
        };

        // Check every 10 seconds to ensure we don't miss a minute
        const intervalId = setInterval(checkReminders, 10000);

        // Initial check
        checkReminders();

        return () => clearInterval(intervalId);
    }, [medicines, notifiedTimes]);

    const sendNotification = (med) => {
        const title = `Time to take your medicine! 💊`;
        const body = `Take ${med.name} (${med.dosage}). ${med.instructions || ''}`;

        // Browser Notification
        if ('Notification' in window && Notification.permission === 'granted') {
            try {
                new Notification(title, {
                    body: body,
                    icon: '/vite.svg',
                    badge: '/vite.svg', // Small icon for notification bar
                    vibrate: [200, 100, 200], // Vibrate phone
                    requireInteraction: true, // Keep notification on screen until user interacts
                    tag: `med-reminder-${med.id}` // Prevent multiple notifications for the same med
                });
            } catch (e) {
                console.error('Error creating notification:', e);
            }
        } else {
            console.log('Browser notifications not active. Permission:', Notification.permission);
        }

        // In-app Toast
        toast(
            (t) => (
                <div className="flex items-start gap-3">
                    <div className="text-2xl">💊</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Medicine Alert</h4>
                        <p className="text-sm text-gray-600">{body}</p>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="text-xs text-primary-600 mt-2 font-medium hover:underline"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            ),
            { duration: 10000, position: 'top-right' }
        );


    };

    return null;
};

export default MedicineReminder;
