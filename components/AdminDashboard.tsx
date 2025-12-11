import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, ArrowLeft } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

interface AdminDashboardProps {
    onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
    const { systemPrompt, knowledgeBase, updateConfig, resetConfig } = useConfig();

    const [localPrompt, setLocalPrompt] = useState(systemPrompt);
    const [localKnowledge, setLocalKnowledge] = useState(knowledgeBase);
    const [message, setMessage] = useState<string | null>(null);

    // Sync local state if context updates externally (optional, but good practice)
    useEffect(() => {
        setLocalPrompt(systemPrompt);
        setLocalKnowledge(knowledgeBase);
    }, [systemPrompt, knowledgeBase]);

    const handleSave = () => {
        updateConfig({
            systemPrompt: localPrompt,
            knowledgeBase: localKnowledge
        });
        setMessage("保存しました！");
        setTimeout(() => setMessage(null), 3000);
    };

    const handleReset = () => {
        if (window.confirm("設定を初期値に戻しますか？")) {
            resetConfig();
            setMessage("リセットしました。");
            setTimeout(() => setMessage(null), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 pb-safe">
            {/* Header */}
            <div className="bg-white shadow-sm px-4 py-4 flex items-center justify-between sticky top-0 z-10 pt-[env(safe-area-inset-top)]">
                <button onClick={onBack} className="p-2 -ml-2 text-gray-600">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-lg font-bold">管理画面</h1>
                <div className="w-8"></div> {/* Spacer for alignment */}
            </div>

            <div className="p-4 space-y-6 flex-1 overflow-y-auto">

                {/* System Prompt Section */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">
                        システムプロンプト (AIの役割)
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                        AIのキャラクターや振る舞いを定義します。
                    </p>
                    <textarea
                        value={localPrompt}
                        onChange={(e) => setLocalPrompt(e.target.value)}
                        className="w-full h-32 p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="例: あなたは親切なコンシェルジュです..."
                    />
                </div>

                {/* Knowledge Base Section */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">
                        ナレッジベース (独自知識)
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                        店舗情報、ルール、キャンペーン詳細などを入力してください。<br />
                        AIはこの情報を参照して回答します。
                    </p>
                    <textarea
                        value={localKnowledge}
                        onChange={(e) => setLocalKnowledge(e.target.value)}
                        className="w-full h-48 p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="[営業時間] 9:00-18:00&#10;[キャンペーン] 今なら入会金無料..."
                    />
                </div>

                {/* Feedback Message */}
                {message && (
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-bold text-center animate-pulse">
                        {message}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                    <button
                        onClick={handleReset}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-bold active:scale-95 transition-transform"
                    >
                        <RotateCcw size={18} />
                        リセット
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform"
                    >
                        <Save size={18} />
                        保存する
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
