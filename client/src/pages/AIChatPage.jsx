import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import { chatWithAI, getHealthInsights } from '../services/aiService';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AIChatPage() {
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('ai_chat_history');
        return savedMessages ? JSON.parse(savedMessages) : [
            {
                role: 'assistant',
                content: "Hello! I'm Dr. AI. I have access to your health logs. Ask me anything about your health trends or general wellness!"
            }
        ];
    });
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        localStorage.setItem('ai_chat_history', JSON.stringify(messages));
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const data = await chatWithAI(userMessage);
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (error) {
            console.error('AI Error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to my brain right now. Please try again later." }]);
            toast.error('Failed to get response');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateInsights = async () => {
        setLoading(true);
        // Add a temporary "system" message to show we are working
        setMessages(prev => [...prev, { role: 'user', content: "Please analyze my health trends." }]);

        try {
            const data = await getHealthInsights();
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (error) {
            console.error('Insight Error:', error);
            toast.error('Failed to generate insights');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="page-container gradient-bg h-[calc(100vh-64px)] flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Intro / Insights Button */}
                        {messages.length === 1 && (
                            <div className="text-center mb-8 animate-fade-in">
                                <div className="inline-block p-4 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4">
                                    <span className="text-4xl">🤖</span>
                                </div>
                                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Your Personal Health Assistant
                                </h2>
                                {!user?.aiDataAccess && (
                                    <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-lg flex items-center gap-3">
                                        <span className="text-xl">🔒</span>
                                        <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-300">
                                            AI Data Access is DISABLED. The AI cannot see your health logs or medicines.
                                            <Link to="/settings" className="ml-1 underline font-medium hover:text-purple-800">Enable in Settings</Link>
                                        </p>
                                    </div>
                                )}
                                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
                                    Ask me anything about your health logs, medications, or general wellness.
                                </p>
                                <button
                                    onClick={handleGenerateInsights}
                                    className="btn-secondary whitespace-nowrap px-4 py-2 text-sm sm:text-base"
                                    disabled={loading}
                                >
                                    ✨ Generate Insights
                                </button>
                            </div>
                        )}

                        {/* Chat Messages */}
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${msg.role === 'user'
                                        ? 'bg-primary-600 text-white rounded-br-none'
                                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-700'
                                        }`}
                                >
                                    <div className="prose dark:prose-invert max-w-none text-sm md:text-base">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 rounded-bl-none border border-gray-100 dark:border-gray-700">
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
                    <div className="max-w-4xl mx-auto">
                        <form onSubmit={handleSend} className="flex gap-4">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about health..."
                                className="flex-1 input-field"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                className="btn-primary px-4 w-auto flex justify-center items-center"
                                disabled={loading || !input.trim()}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    'Send'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
