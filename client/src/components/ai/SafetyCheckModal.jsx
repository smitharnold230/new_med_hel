import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function SafetyCheckModal() {
    const [newMedicine, setNewMedicine] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();
    const { closeSafetyCheck } = useUI();

    const handleCheck = async (e) => {
        e.preventDefault();
        if (!newMedicine.trim()) return;

        setLoading(true);
        setResult(null);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/ai/safety-check`,
                { newMedicine },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setResult(response.data.response);
        } catch (error) {
            console.error('Safety Check Error:', error);
            setResult('### ❌ Error\nFailed to perform safety check. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[60] p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative border border-gray-200 dark:border-gray-700 animate-slide-up">

                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-800">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="text-2xl sm:text-3xl">🛡️</span> AI Safety Checker
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Check potential drug-drug interactions instantly</p>
                    </div>
                    <button
                        onClick={closeSafetyCheck}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <span className="text-xl sm:text-2xl text-gray-400">✕</span>
                    </button>
                </div>

                <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
                    {/* Disclaimer Banner */}
                    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-3 sm:p-4 mb-4 sm:mb-6">
                        <div className="flex items-start gap-2 sm:gap-3">
                            <span className="text-lg sm:text-xl">⚠️</span>
                            <div>
                                <h4 className="font-bold text-red-800 dark:text-red-400 text-xs sm:text-sm">Medical Disclaimer</h4>
                                <p className="text-[10px] sm:text-xs text-red-700 dark:text-red-300 mt-0.5">
                                    This tool is for informational purposes only. Do NOT start or stop medication based on this output. Always consult your doctor or pharmacist.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleCheck} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Which medication are you considering?
                            </label>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    value={newMedicine}
                                    onChange={(e) => setNewMedicine(e.target.value)}
                                    placeholder="e.g., Warfarin, Aspirin..."
                                    className="flex-1 px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white text-sm sm:text-base"
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !newMedicine.trim()}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2.5 sm:py-3 px-6 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <><span>🔍</span> Check</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Results Area */}
                    {result && (
                        <div className="mt-6 sm:mt-8 animate-fade-in">
                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 sm:p-6 border border-gray-100 dark:border-gray-700 prose dark:prose-invert max-w-none text-sm sm:text-base">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {result}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}

                    {!result && !loading && (
                        <div className="mt-6 sm:mt-8 text-center py-8 sm:py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                            <div className="text-3xl sm:text-4xl mb-3 opacity-50">💊</div>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium px-4">
                                Enter a medication name above to see how it interacts with your active medicines.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                        Powered by Dr. AI • Advanced Health Intelligence
                    </p>
                </div>
            </div>
        </div>
    );
}
