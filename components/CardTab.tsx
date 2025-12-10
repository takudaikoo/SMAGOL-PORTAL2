import React, { useState } from 'react';
import { Gift, Trophy, ShoppingBag, GraduationCap, ExternalLink } from 'lucide-react';
import MembershipCard from './MembershipCard';
import { User } from '../types';
import { MOCK_COMPETITION, BRAND_COLOR } from '../constants';

interface CardTabProps {
    user: User;
}

const CardTab: React.FC<CardTabProps> = ({ user }) => {
    const [bonusClaimed, setBonusClaimed] = useState(false);

    const handleClaimBonus = () => {
        setBonusClaimed(true);
        alert('本日のログインボーナス+10ポイントを獲得しました！');
    };

    // Check if competition should be shown (upcoming or ongoing)
    const showCompetition = MOCK_COMPETITION.status === 'upcoming' || MOCK_COMPETITION.status === 'ongoing';

    return (
        <div className="px-6 py-8 pb-24 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 text-center">デジタル会員証</h2>

            {/* Membership Card */}
            <div className="flex flex-col items-center">
                <MembershipCard user={user} />
                <p className="mt-6 text-sm text-gray-400 text-center">
                    お会計の際にこちらの画面をご提示ください。<br />
                    画面の明るさを最大にすると読み取りやすくなります。
                </p>
            </div>

            {/* Login Bonus */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white p-2 rounded-full shadow-sm">
                            <Gift size={20} className="text-orange-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-sm">ログインボーナス</h3>
                            <p className="text-xs text-gray-600">毎日ログインでポイントGET!</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClaimBonus}
                        disabled={bonusClaimed}
                        className={`px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-all ${bonusClaimed
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-orange-600 hover:bg-orange-50'
                            }`}
                    >
                        {bonusClaimed ? '受取済' : '受け取る'}
                    </button>
                </div>
            </div>

            {/* Online Competition - Conditional Display */}
            {showCompetition && (
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-4 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                        <div className="flex items-start space-x-3 mb-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <Trophy size={24} className="text-yellow-300" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${MOCK_COMPETITION.status === 'ongoing'
                                        ? 'bg-red-500 text-white animate-pulse'
                                        : 'bg-yellow-400 text-gray-800'
                                        }`}>
                                        {MOCK_COMPETITION.status === 'ongoing' ? '開催中' : '開催予定'}
                                    </span>
                                    <span className="text-xs opacity-80">
                                        {MOCK_COMPETITION.startDate} ~ {MOCK_COMPETITION.endDate}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg mb-1">{MOCK_COMPETITION.title}</h3>
                                <p className="text-xs opacity-90 mb-3">
                                    会員限定のオンラインコンペに参加してスコアを競おう！豪華賞品をご用意しています。
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => window.open(MOCK_COMPETITION.url, '_blank')}
                            className="w-full bg-white text-blue-600 font-bold py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-50 transition-colors"
                        >
                            <span>コンペサイトへ</span>
                            <ExternalLink size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Net Shop - Golf Balls */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-green-50 p-2 rounded-full">
                        <ShoppingBag size={20} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-sm">オンラインショップ</h3>
                        <p className="text-xs text-gray-600">人気ゴルフボール13銘柄を販売中</p>
                    </div>
                </div>
                <button
                    onClick={() => alert('ネットショップページへ遷移します')}
                    className="w-full bg-green-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                    <span>ショップを見る</span>
                    <ExternalLink size={16} />
                </button>
            </div>

            {/* Lessons */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-purple-50 p-2 rounded-full">
                        <GraduationCap size={20} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-sm">レッスンプログラム</h3>
                        <p className="text-xs text-gray-600">対面・オンラインレッスンをご用意</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => alert('対面レッスンポータルへ遷移します')}
                        className="bg-purple-100 text-purple-700 font-bold py-2 px-3 rounded-lg hover:bg-purple-200 transition-colors text-xs"
                    >
                        対面レッスン
                    </button>
                    <button
                        onClick={() => alert('オンラインレッスンポータルへ遷移します')}
                        className="bg-purple-100 text-purple-700 font-bold py-2 px-3 rounded-lg hover:bg-purple-200 transition-colors text-xs"
                    >
                        オンライン
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CardTab;
