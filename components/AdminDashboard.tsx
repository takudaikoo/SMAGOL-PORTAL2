import React, { useState } from 'react';
import { Save, ArrowLeft, Plus, Trash2, Edit2 } from 'lucide-react';
import { useAppData } from '../contexts/AppDataContext';
import { Coupon, NewsItem } from '../types';

const AdminDashboard = () => {
    const {
        config, updateConfig, resetData,
        news, addNews, updateNews, deleteNews,
        coupons, addCoupon, updateCoupon, deleteCoupon,
        partners
    } = useAppData();

    const [activeTab, setActiveTab] = useState<'AI' | 'NEWS' | 'COUPON'>('AI');
    const [message, setMessage] = useState<string | null>(null);

    const showMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(null), 3000);
    };

    // --- AI Config State ---
    const [localPrompt, setLocalPrompt] = useState(config.systemPrompt);
    const [localKnowledge, setLocalKnowledge] = useState(config.knowledgeBase);

    const handleSaveAi = () => {
        updateConfig({ systemPrompt: localPrompt, knowledgeBase: localKnowledge });
        showMessage("AI設定を保存しました");
    };

    // --- News State ---
    const [isEditingNews, setIsEditingNews] = useState<boolean>(false);
    const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
    const [newsForm, setNewsForm] = useState<Omit<NewsItem, 'id'>>({ title: '', date: '', imageUrl: '' });

    const handleNewsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingNewsId) {
            updateNews(editingNewsId, newsForm);
            showMessage("お知らせを更新しました");
        } else {
            addNews(newsForm);
            showMessage("お知らせを追加しました");
        }
        setIsEditingNews(false);
        setEditingNewsId(null);
        setNewsForm({ title: '', date: '', imageUrl: '' });
    };

    const startEditNews = (item: NewsItem) => {
        setNewsForm({ title: item.title, date: item.date, imageUrl: item.imageUrl });
        setEditingNewsId(item.id);
        setIsEditingNews(true);
    };

    // --- Coupon State ---
    const [isEditingCoupon, setIsEditingCoupon] = useState<boolean>(false);
    const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
    const [couponForm, setCouponForm] = useState<Omit<Coupon, 'id' | 'description' | 'terms' | 'isUsed'>>({
        partnerId: partners[0]?.id || '',
        title: '',
        discount: '',
        expiryDate: '',
        usageType: 'OneTime',
        // Provide defaults for internal required fields not shown in simplified form
        description: '詳細な説明...',
        terms: '利用条件...',
        isUsed: false
    });

    const handleCouponSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Defaults for simplified form
        const submission = {
            ...couponForm,
            description: couponForm.description || '管理者により追加',
            terms: couponForm.terms || '利用条件は店舗にご確認ください',
            isUsed: false
        };

        if (editingCouponId) {
            updateCoupon(editingCouponId, submission);
            showMessage("クーポンを更新しました");
        } else {
            addCoupon(submission);
            showMessage("クーポンを追加しました");
        }
        setIsEditingCoupon(false);
        setEditingCouponId(null);
    };

    const startEditCoupon = (item: Coupon) => {
        setCouponForm({
            partnerId: item.partnerId,
            title: item.title,
            discount: item.discount,
            expiryDate: item.expiryDate,
            usageType: item.usageType,
            description: item.description,
            terms: item.terms,
            isUsed: item.isUsed
        });
        setEditingCouponId(item.id);
        setIsEditingCoupon(true);
    };

    // --- Render Components ---

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 pb-safe">
            {/* Header */}
            <div className="bg-white shadow-sm px-4 py-4 flex items-center justify-between sticky top-0 z-10 pt-[env(safe-area-inset-top)]">
                <div className="flex items-center gap-2">
                    <button onClick={() => window.location.href = '/'} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold">管理コンソール</h1>
                </div>
                <button onClick={resetData} className="text-xs text-red-500 font-bold border border-red-200 px-3 py-1 rounded-full">
                    初期化
                </button>
            </div>

            {/* Tabs */}
            <div className="flex bg-white border-b border-gray-200 sticky top-14 z-10 overflow-x-auto">
                {(['AI', 'NEWS', 'COUPON'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
                            }`}
                    >
                        {tab === 'AI' && 'AI設定'}
                        {tab === 'NEWS' && 'お知らせ'}
                        {tab === 'COUPON' && 'クーポン'}
                    </button>
                ))}
            </div>

            <div className="p-4 flex-1 overflow-y-auto max-w-2xl mx-auto w-full">

                {/* AI CONFIG TAB */}
                {activeTab === 'AI' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-800 mb-4">
                            ここではAIチャットの振る舞いを設定できます。変更は即座に反映されます。
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">システムプロンプト</label>
                            <textarea
                                value={localPrompt}
                                onChange={(e) => setLocalPrompt(e.target.value)}
                                className="w-full h-32 p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">ナレッジベース</label>
                            <textarea
                                value={localKnowledge}
                                onChange={(e) => setLocalKnowledge(e.target.value)}
                                className="w-full h-48 p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button onClick={handleSaveAi} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">
                            保存する
                        </button>
                    </div>
                )}

                {/* NEWS TAB */}
                {activeTab === 'NEWS' && (
                    <div className="animate-fade-in">
                        {!isEditingNews ? (
                            <div className="space-y-4">
                                <button
                                    onClick={() => { setNewsForm({ title: '', date: new Date().toLocaleDateString(), imageUrl: 'https://picsum.photos/400/200' }); setIsEditingNews(true); }}
                                    className="w-full bg-green-50 text-green-700 py-3 rounded-xl font-bold border border-green-200 flex justify-center items-center gap-2"
                                >
                                    <Plus size={18} /> お知らせを追加
                                </button>
                                {news.map(item => (
                                    <div key={item.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-3">
                                        <img src={item.imageUrl} className="w-16 h-16 rounded bg-gray-200 object-cover" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-400">{item.date}</p>
                                            <p className="text-sm font-bold line-clamp-2">{item.title}</p>
                                        </div>
                                        <div className="flex flex-col justify-between">
                                            <button onClick={() => startEditNews(item)} className="p-1 text-gray-400 hover:text-blue-500"><Edit2 size={16} /></button>
                                            <button onClick={() => { if (confirm('削除しますか？')) deleteNews(item.id) }} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <form onSubmit={handleNewsSubmit} className="space-y-4 bg-white p-4 rounded-xl shadow-sm">
                                <h3 className="font-bold">{editingNewsId ? 'お知らせを編集' : '新規お知らせ'}</h3>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">タイトル</label>
                                    <input required type="text" value={newsForm.title} onChange={e => setNewsForm({ ...newsForm, title: e.target.value })} className="w-full p-2 border rounded" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">日付</label>
                                    <input required type="text" value={newsForm.date} onChange={e => setNewsForm({ ...newsForm, date: e.target.value })} className="w-full p-2 border rounded" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">画像URL</label>
                                    <input type="text" value={newsForm.imageUrl} onChange={e => setNewsForm({ ...newsForm, imageUrl: e.target.value })} className="w-full p-2 border rounded" />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button type="button" onClick={() => { setIsEditingNews(false); setEditingNewsId(null); }} className="flex-1 py-2 bg-gray-100 rounded-lg">キャンセル</button>
                                    <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold">保存</button>
                                </div>
                            </form>
                        )}
                    </div>
                )}

                {/* COUPON TAB */}
                {activeTab === 'COUPON' && (
                    <div className="animate-fade-in">
                        {!isEditingCoupon ? (
                            <div className="space-y-4">
                                <button
                                    onClick={() => {
                                        setCouponForm({ partnerId: partners[0]?.id || '', title: '', discount: '', expiryDate: '2025-12-31', usageType: 'OneTime', description: '', terms: '', isUsed: false });
                                        setIsEditingCoupon(true);
                                    }}
                                    className="w-full bg-green-50 text-green-700 py-3 rounded-xl font-bold border border-green-200 flex justify-center items-center gap-2"
                                >
                                    <Plus size={18} /> クーポンを追加
                                </button>
                                {coupons.map(item => (
                                    <div key={item.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className={`text-[10px] px-2 py-0.5 rounded border ${item.usageType === 'Unlimited' ? 'bg-gold-50 text-yellow-700 border-yellow-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                                    {item.usageType === 'Unlimited' ? '使い放題' : '1回限り'}
                                                </span>
                                                <h4 className="font-bold mt-1">{item.title}</h4>
                                                <p className="text-xs text-red-500 font-bold">{item.discount}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <button onClick={() => startEditCoupon(item)} className="p-2 text-gray-400 hover:text-blue-500"><Edit2 size={16} /></button>
                                                <button onClick={() => { if (confirm('削除しますか？')) deleteCoupon(item.id) }} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <form onSubmit={handleCouponSubmit} className="space-y-4 bg-white p-4 rounded-xl shadow-sm">
                                <h3 className="font-bold">{editingCouponId ? 'クーポンを編集' : '新規クーポン'}</h3>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">提携パートナー</label>
                                    <select required value={couponForm.partnerId} onChange={e => setCouponForm({ ...couponForm, partnerId: e.target.value })} className="w-full p-2 border rounded">
                                        {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">タイトル</label>
                                    <input required type="text" value={couponForm.title} onChange={e => setCouponForm({ ...couponForm, title: e.target.value })} className="w-full p-2 border rounded" placeholder="例: 会計から10%OFF" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">割引内容</label>
                                    <input required type="text" value={couponForm.discount} onChange={e => setCouponForm({ ...couponForm, discount: e.target.value })} className="w-full p-2 border rounded" placeholder="例: 10% OFF / ¥1,000 OFF" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">有効期限</label>
                                    <input required type="date" value={couponForm.expiryDate} onChange={e => setCouponForm({ ...couponForm, expiryDate: e.target.value })} className="w-full p-2 border rounded" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">利用タイプ</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2">
                                            <input type="radio" checked={couponForm.usageType === 'OneTime'} onChange={() => setCouponForm({ ...couponForm, usageType: 'OneTime' })} />
                                            1回限り
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="radio" checked={couponForm.usageType === 'Unlimited'} onChange={() => setCouponForm({ ...couponForm, usageType: 'Unlimited' })} />
                                            使い放題
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button type="button" onClick={() => { setIsEditingCoupon(false); setEditingCouponId(null); }} className="flex-1 py-2 bg-gray-100 rounded-lg">キャンセル</button>
                                    <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold">保存</button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>

            {/* Toast Message */}
            {message && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
                    {message}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
