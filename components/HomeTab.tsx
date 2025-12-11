import React, { useState } from 'react';
import { Bell, Sparkles, ChevronRight } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';
import { useAppData } from '../contexts/AppDataContext';
import { User, Tab, ChatMessage } from '../types';

interface HomeTabProps {
    user: User;
    setActiveTab: (tab: Tab) => void;
}

const HomeTab: React.FC<HomeTabProps> = ({
    user,
    setActiveTab
}) => {
    // Destructure everything needed from context
    const { config, news, coupons } = useAppData();

    // Local chat state
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [loadingAi, setLoadingAi] = useState(false);

    const handleSendMessage = async () => {
        if (!inputText.trim() || loadingAi) return;

        const userMsg: ChatMessage = { role: 'user', text: inputText };
        const newHistory = [...chatHistory, userMsg];

        setChatHistory(newHistory);
        setInputText('');
        setLoadingAi(true);

        // Get AI response using dynamic data from context
        const responseText = await getChatResponse(
            user,
            coupons, // Pass dynamic coupons to AI
            newHistory,
            userMsg.text,
            config // Pass dynamic config (system prompt/knowledge)
        );

        setChatHistory([...newHistory, { role: 'model', text: responseText }]);
        setLoadingAi(false);
    };

    return (
        <div className="space-y-6 pb-24">
            {/* Header Area */}
            <div className="bg-white rounded-b-3xl shadow-sm pb-6 pt-[env(safe-area-inset-top)]">
                <div className="px-6 pt-4 mb-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Hello, {user.name}</h1>
                    <button className="p-2 bg-gray-50 rounded-full relative">
                        <Bell size={20} className="text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                </div>

                {/* Mini Card Preview */}
                <div className="px-6 mb-6">
                    <div
                        onClick={() => setActiveTab(Tab.CARD)}
                        className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 text-white shadow-lg flex justify-between items-center cursor-pointer"
                    >
                        <div>
                            <p className="text-xs opacity-70 mb-1">現在の保有ポイント</p>
                            <p className="text-2xl font-bold">{user.points.toLocaleString()} <span className="text-sm font-normal">pts</span></p>
                        </div>
                        <ChevronRight size={20} className="opacity-50" />
                    </div>
                </div>

                {/* AI Concierge */}
                <div className="px-6">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 relative overflow-hidden">

                        {/* Title & Mode */}
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="bg-white p-2 rounded-full shadow-sm">
                                <Sparkles size={18} className="text-yellow-500" />
                            </div>
                            <h3 className="font-bold text-blue-900 text-sm">AI コンシェルジュ</h3>
                        </div>

                        {/* Chat Area */}
                        <div className="bg-white/60 rounded-lg p-3 min-h-[200px] max-h-[300px] overflow-y-auto mb-3 space-y-3">
                            {chatHistory.length === 0 ? (
                                <p className="text-xs text-blue-800 text-center py-4 opacity-70">
                                    クーポンやサービスについて<br />お気軽にお尋ねください。
                                </p>
                            ) : (
                                chatHistory.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-white text-gray-800 shadow-sm rounded-tl-none'
                                            }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))
                            )}
                            {loadingAi && (
                                <div className="flex justify-start">
                                    <div className="bg-white text-gray-800 shadow-sm rounded-2xl rounded-tl-none px-3 py-2 text-xs">
                                        <span className="animate-pulse">...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="質問を入力..."
                                className="flex-1 text-xs px-3 py-2 rounded-full border border-blue-200 focus:outline-none focus:border-blue-500 bg-white"
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                disabled={loadingAi}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={loadingAi || !inputText.trim()}
                                className={`p-2 rounded-full text-white transition-colors ${loadingAi || !inputText.trim() ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* News Section */}
            <div className="px-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-gray-800">最新のお知らせ</h2>
                    <span className="text-xs text-gray-400">すべて見る</span>
                </div>
                <div className="space-y-4">
                    {news.map(item => (
                        <div key={item.id} className="flex bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                            <img src={item.imageUrl} alt={item.title} className="w-16 h-16 rounded-lg object-cover bg-gray-200" />
                            <div className="ml-3 flex-1 flex flex-col justify-center">
                                <p className="text-xs text-gray-400 mb-1">{item.date}</p>
                                <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomeTab;
