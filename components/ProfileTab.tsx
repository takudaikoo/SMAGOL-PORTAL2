import React from 'react';
import { Settings, HelpCircle, LogOut, Gift, ChevronRight } from 'lucide-react';
import { User } from '../types';

interface ProfileTabProps {
    user: User;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ user }) => {
    return (
        <div className="px-6 py-8 pb-24">
            <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-500">
                    {user.name.charAt(0)}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{user.name} 様</h2>
                    <p className="text-sm text-gray-500">{user.plan || user.tier} 会員</p>
                </div>
            </div>

            <div className="space-y-3">
                {[
                    { icon: <Gift size={20} />, label: 'ポイント履歴' },
                    { icon: <Settings size={20} />, label: 'アカウント設定' },
                    { icon: <HelpCircle size={20} />, label: 'ヘルプ・お問い合わせ' },
                    { icon: <LogOut size={20} />, label: 'ログアウト' },
                ].map((item, i) => (
                    <button key={i} className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center justify-between text-gray-700 hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                            <div className="text-gray-400">{item.icon}</div>
                            <span className="font-medium">{item.label}</span>
                        </div>
                        <ChevronRight size={18} className="text-gray-300" />
                    </button>
                ))}


            </div>

            <div className="mt-8 text-center text-xs text-gray-400">
                <p>アプリバージョン 1.0.0</p>
                <p className="mt-2">© 2024 Corporate Name</p>
            </div>
        </div>
    );
};

export default ProfileTab;
