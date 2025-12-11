import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Coupon, NewsItem, User, Partner } from '../types';
import { MOCK_NEWS, MOCK_COUPONS, MOCK_USER, MOCK_PARTNERS } from '../constants';

interface AppConfig {
    systemPrompt: string;
    knowledgeBase: string;
}

interface AppData {
    user: User; // We won't really update user in admin for now, but good to have in context
    news: NewsItem[];
    coupons: Coupon[];
    partners: Partner[]; // Partners might be static or dynamic
    config: AppConfig;

    // Actions
    updateConfig: (newConfig: Partial<AppConfig>) => void;

    // News Actions
    addNews: (item: Omit<NewsItem, 'id'>) => void;
    updateNews: (id: string, item: Partial<NewsItem>) => void;
    deleteNews: (id: string) => void;

    // Coupon Actions
    addCoupon: (item: Omit<Coupon, 'id'>) => void;
    updateCoupon: (id: string, item: Partial<Coupon>) => void;
    deleteCoupon: (id: string) => void;

    resetData: () => void;
}

const DEFAULT_SYSTEM_PROMPT = `あなたは企業の公式アプリのAIコンシェルジュです。
ユーザーに対して、親しみやすく丁寧な日本語で接してください。
`;

const DEFAULT_KNOWLEDGE_BASE = `
[店舗情報]
・営業時間: 9:00 - 22:00
・定休日: 年中無休
・電話番号: 03-1234-5678
`;

const AppDataContext = createContext<AppData | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Initial load logic
    const loadInitialState = <T,>(key: string, defaultVal: T): T => {
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error(`Failed to parse ${key}`, e);
            }
        }
        return defaultVal;
    };

    const [user] = useState<User>(MOCK_USER); // User is static for this demo
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [partners] = useState<Partner[]>(MOCK_PARTNERS); // Partners static for now

    const [news, setNews] = useState<NewsItem[]>(() => loadInitialState('app_news', MOCK_NEWS));
    const [coupons, setCoupons] = useState<Coupon[]>(() => loadInitialState('app_coupons', MOCK_COUPONS));
    const [config, setConfig] = useState<AppConfig>(() => loadInitialState('app_config', {
        systemPrompt: DEFAULT_SYSTEM_PROMPT,
        knowledgeBase: DEFAULT_KNOWLEDGE_BASE
    }));

    // Persistence Effects
    useEffect(() => localStorage.setItem('app_news', JSON.stringify(news)), [news]);
    useEffect(() => localStorage.setItem('app_coupons', JSON.stringify(coupons)), [coupons]);
    useEffect(() => localStorage.setItem('app_config', JSON.stringify(config)), [config]);

    // Actions implementation
    const updateConfig = (newConfig: Partial<AppConfig>) => {
        setConfig(prev => ({ ...prev, ...newConfig }));
    };

    const addNews = (item: Omit<NewsItem, 'id'>) => {
        const newItem: NewsItem = { ...item, id: `n${Date.now()}` };
        setNews(prev => [newItem, ...prev]);
    };

    const updateNews = (id: string, item: Partial<NewsItem>) => {
        setNews(prev => prev.map(n => n.id === id ? { ...n, ...item } : n));
    };

    const deleteNews = (id: string) => {
        setNews(prev => prev.filter(n => n.id !== id));
    };

    const addCoupon = (item: Omit<Coupon, 'id'>) => {
        const newItem: Coupon = { ...item, id: `c${Date.now()}` };
        setCoupons(prev => [newItem, ...prev]);
    };

    const updateCoupon = (id: string, item: Partial<Coupon>) => {
        setCoupons(prev => prev.map(c => c.id === id ? { ...c, ...item } : c));
    };

    const deleteCoupon = (id: string) => {
        setCoupons(prev => prev.filter(c => c.id !== id));
    };

    const resetData = () => {
        if (window.confirm('全てのデータを初期状態に戻しますか？')) {
            setNews(MOCK_NEWS);
            setCoupons(MOCK_COUPONS);
            setConfig({
                systemPrompt: DEFAULT_SYSTEM_PROMPT,
                knowledgeBase: DEFAULT_KNOWLEDGE_BASE
            });
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <AppDataContext.Provider value={{
            user,
            news,
            coupons,
            partners,
            config,
            updateConfig,
            addNews,
            updateNews,
            deleteNews,
            addCoupon,
            updateCoupon,
            deleteCoupon,
            resetData
        }}>
            {children}
        </AppDataContext.Provider>
    );
};

export const useAppData = () => {
    const context = useContext(AppDataContext);
    if (context === undefined) {
        throw new Error('useAppData must be used within an AppDataProvider');
    }
    return context;
};
