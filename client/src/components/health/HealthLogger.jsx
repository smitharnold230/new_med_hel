import { useState } from 'react';

export default function HealthLogger({ onSubmit }) {
    const [formData, setFormData] = useState({
        logDate: new Date().toISOString().split('T')[0],
        systolic: '',
        diastolic: '',
        bloodSugar: '',
        weight: '',
        heartRate: '',
        temperature: '',
        oxygenLevel: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Clean and format data - keep camelCase for backend compatibility
            const cleanData = { logDate: formData.logDate };

            // Convert string inputs to numbers and only include non-empty values
            if (formData.systolic) cleanData.systolic = Number(formData.systolic);
            if (formData.diastolic) cleanData.diastolic = Number(formData.diastolic);
            if (formData.bloodSugar) cleanData.bloodSugar = Number(formData.bloodSugar);
            if (formData.weight) cleanData.weight = Number(formData.weight);
            if (formData.heartRate) cleanData.heartRate = Number(formData.heartRate);
            if (formData.temperature) cleanData.temperature = Number(formData.temperature);
            if (formData.oxygenLevel) cleanData.oxygenLevel = Number(formData.oxygenLevel);
            if (formData.notes && formData.notes.trim()) cleanData.notes = formData.notes.trim();


            await onSubmit(cleanData);

            // Reset form
            setFormData({
                logDate: new Date().toISOString().split('T')[0],
                systolic: '',
                diastolic: '',
                bloodSugar: '',
                weight: '',
                heartRate: '',
                temperature: '',
                oxygenLevel: '',
                notes: ''
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create health log');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4">Log Health Data</h2>

            {error && (
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Date */}
                <div>
                    <label className="form-label">Date</label>
                    <input
                        type="date"
                        name="logDate"
                        value={formData.logDate}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                </div>

                {/* Blood Pressure */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="min-h-[2rem] flex items-end mb-1">
                            <label className="form-label mb-0">Systolic (BP)</label>
                        </div>
                        <input
                            type="number"
                            name="systolic"
                            value={formData.systolic}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="120"
                            min="0"
                            max="300"
                        />
                    </div>
                    <div>
                        <div className="min-h-[2rem] flex items-end mb-1">
                            <label className="form-label mb-0">Diastolic (BP)</label>
                        </div>
                        <input
                            type="number"
                            name="diastolic"
                            value={formData.diastolic}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="80"
                            min="0"
                            max="200"
                        />
                    </div>
                </div>

                {/* Blood Sugar & Weight */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="min-h-[3rem] flex items-end mb-1">
                            <label className="form-label mb-0">Blood Sugar (mg/dL)</label>
                        </div>
                        <input
                            type="number"
                            name="bloodSugar"
                            value={formData.bloodSugar}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="95"
                            step="0.1"
                        />
                    </div>
                    <div>
                        <div className="min-h-[3rem] flex items-end mb-1">
                            <label className="form-label mb-0">Weight (kg)</label>
                        </div>
                        <input
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="72.5"
                            step="0.1"
                        />
                    </div>
                </div>

                {/* Heart Rate & Temperature */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="min-h-[3rem] flex items-end mb-1">
                            <label className="form-label mb-0">Heart Rate (bpm)</label>
                        </div>
                        <input
                            type="number"
                            name="heartRate"
                            value={formData.heartRate}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="75"
                            min="0"
                            max="300"
                        />
                    </div>
                    <div>
                        <div className="min-h-[3rem] flex items-end mb-1">
                            <label className="form-label mb-0">Temperature (°F)</label>
                        </div>
                        <input
                            type="number"
                            name="temperature"
                            value={formData.temperature}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="98.6"
                            step="0.1"
                        />
                    </div>
                </div>

                {/* Oxygen Level */}
                <div>
                    <label className="form-label">Oxygen Level (%)</label>
                    <input
                        type="number"
                        name="oxygenLevel"
                        value={formData.oxygenLevel}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="97"
                        min="0"
                        max="100"
                    />
                </div>

                {/* Notes */}
                <div>
                    <label className="form-label">Notes (Optional)</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="input-field"
                        rows="3"
                        placeholder="Any additional observations..."
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="btn-primary w-full"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save Health Log'}
                </button>
            </form>
        </div>
    );
}
