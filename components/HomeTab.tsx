import React, { useState } from 'react';
import { Bell, Sparkles, ChevronRight } from 'lucide-react';
import { User, Tab, NewsItem } from '../types';
import { MOCK_NEWS } from '../constants';

interface HomeTabProps {
    user: User;
    setActiveTab: (tab: Tab) => void;
    loadingAi: boolean;
    aiRecommendation: string | null;
    fetchAiRecommendation: () => void;
}

const HomeTab: React.FC<HomeTabProps> = ({
    user,
    setActiveTab,
    loadingAi,
    aiRecommendation,
    fetchAiRecommendation
}) => {
    const [aiMode, setAiMode] = useState<'coupon' | 'inquiry'>('coupon');

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

                        {/* Toggle Switch */}
                        <div className="flex justify-center mb-4 relative z-10">
                            <div className="bg-white/50 p-1 rounded-full flex relative">
                                <div
                                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-all duration-300 ease-out ${aiMode === 'coupon' ? 'left-1' : 'left-[calc(50%)]'}`}
                                ></div>
                                <button
                                    onClick={() => setAiMode('coupon')}
                                    className={`relative z-10 px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${aiMode === 'coupon' ? 'text-blue-900' : 'text-blue-400'}`}
                                >
                                    クーポン
                                </button>
                                <button
                                    onClick={() => setAiMode('inquiry')}
                                    className={`relative z-10 px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${aiMode === 'inquiry' ? 'text-blue-900' : 'text-blue-400'}`}
                                >
                                    お問い合わせ
                                </button>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3 relative z-10">
                            <div className="bg-white p-2 rounded-full shadow-sm">
                                <Sparkles size={20} className="text-yellow-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-blue-900 text-sm mb-1">
                                    {aiMode === 'coupon' ? 'AI クーポンコンシェルジュ' : 'AI お問い合わせアシスタント'}
                                </h3>

                                {aiMode === 'coupon' ? (
                                    <>
                                        {loadingAi ? (
                                            <p className="text-xs text-blue-700 animate-pulse">考え中...</p>
                                        ) : aiRecommendation ? (
                                            <p className="text-xs text-blue-800 leading-relaxed">{aiRecommendation}</p>
                                        ) : (
                                            <p className="text-xs text-blue-700">あなたにぴったりのクーポンをご提案します。</p>
                                        )}

                                        {!aiRecommendation && !loadingAi && (
                                            <button
                                                onClick={fetchAiRecommendation}
                                                className="mt-2 text-xs bg-white text-blue-900 px-3 py-1.5 rounded-full font-bold shadow-sm inline-block"
                                            >
                                                おすすめを聞く
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <p className="text-xs text-blue-700 mb-2">
                                            施設のご利用やサービスについて、ご不明な点はありませんか？AIがお答えします。
                                        </p>
                                        <button
                                            className="mt-1 text-xs bg-white text-blue-900 px-3 py-1.5 rounded-full font-bold shadow-sm inline-block"
                                            onClick={() => alert('AIチャットボット（Dify連携予定）を起動します')}
                                        >
                                            チャットを始める
                                        </button>
                                    </>
                                )}
                            </div>
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
                    {MOCK_NEWS.map(news => (
                        <div key={news.id} className="flex bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                            <img src={news.imageUrl} alt={news.title} className="w-16 h-16 rounded-lg object-cover bg-gray-200" />
                            <div className="ml-3 flex-1 flex flex-col justify-center">
                                <p className="text-xs text-gray-400 mb-1">{news.date}</p>
                                <p className="text-sm font-medium text-gray-800 line-clamp-2">{news.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomeTab;
