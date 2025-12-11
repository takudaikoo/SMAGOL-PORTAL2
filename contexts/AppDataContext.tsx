import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Coupon, NewsItem, User, Partner } from '../types';
import { MOCK_NEWS, MOCK_COUPONS, MOCK_USER, MOCK_PARTNERS } from '../constants';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AppConfig {
    systemPrompt: string;
    knowledgeBase: string;
}

interface AppData {
    user: User;
    news: NewsItem[];
    coupons: Coupon[];
    partners: Partner[];
    config: AppConfig;
    loading: boolean;

    // Config Actions
    updateConfig: (newConfig: Partial<AppConfig>) => Promise<void>;

    // News Actions
    addNews: (item: Omit<NewsItem, 'id'>) => Promise<void>;
    updateNews: (id: string, item: Partial<NewsItem>) => Promise<void>;
    deleteNews: (id: string) => Promise<void>;

    // Coupon Actions
    addCoupon: (item: Omit<Coupon, 'id'>) => Promise<void>;
    updateCoupon: (id: string, item: Partial<Coupon>) => Promise<void>;
    deleteCoupon: (id: string) => Promise<void>;

    // Partner Actions
    addPartner: (item: Omit<Partner, 'id'>) => Promise<void>;
    updatePartner: (id: string, item: Partial<Partner>) => Promise<void>;
    deletePartner: (id: string) => Promise<void>;

    resetData: () => Promise<void>;
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
    const [user] = useState<User>(MOCK_USER);
    const [partners, setPartners] = useState<Partner[]>([]);
    const [news, setNews] = useState<NewsItem[]>([]);
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [config, setConfig] = useState<AppConfig>({
        systemPrompt: DEFAULT_SYSTEM_PROMPT,
        knowledgeBase: DEFAULT_KNOWLEDGE_BASE
    });
    const [loading, setLoading] = useState(true);

    const useSupabase = isSupabaseConfigured();

    // ============ SUPABASE FUNCTIONS ============

    const fetchFromSupabase = async () => {
        if (!supabase) return;

        try {
            // Fetch partners
            const { data: partnersData } = await supabase.from('partners').select('*').order('created_at', { ascending: false });
            if (partnersData) {
                setPartners(partnersData.map(p => ({
                    id: p.id,
                    name: p.name,
                    category: p.category as any,
                    logoUrl: p.logo_url || '',
                    description: p.description || ''
                })));
            }

            // Fetch news
            const { data: newsData } = await supabase.from('news').select('*').order('created_at', { ascending: false });
            if (newsData) {
                setNews(newsData.map(n => ({
                    id: n.id,
                    title: n.title,
                    date: n.date,
                    imageUrl: n.image_url || ''
                })));
            }

            // Fetch coupons
            const { data: couponsData } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
            if (couponsData) {
                setCoupons(couponsData.map(c => ({
                    id: c.id,
                    partnerId: c.partner_id,
                    title: c.title,
                    description: c.description || '',
                    discount: c.discount,
                    expiryDate: c.expiry_date,
                    usageType: c.usage_type as 'OneTime' | 'Unlimited',
                    imageUrl: c.image_url || undefined,
                    terms: c.terms || '',
                    isUsed: c.is_used
                })));
            }

            // Fetch config
            const { data: configData } = await supabase.from('config').select('*');
            if (configData) {
                const configObj: any = {};
                configData.forEach(item => {
                    configObj[item.key] = item.value;
                });
                setConfig({
                    systemPrompt: configObj.systemPrompt || DEFAULT_SYSTEM_PROMPT,
                    knowledgeBase: configObj.knowledgeBase || DEFAULT_KNOWLEDGE_BASE
                });
            }
        } catch (error) {
            console.error('Error fetching from Supabase:', error);
        }
    };

    // ============ LOCALSTORAGE FUNCTIONS ============

    const loadFromLocalStorage = () => {
        const loadItem = <T,>(key: string, defaultVal: T): T => {
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

        setPartners(loadItem('app_partners', MOCK_PARTNERS));
        setNews(loadItem('app_news', MOCK_NEWS));
        setCoupons(loadItem('app_coupons', MOCK_COUPONS));
        setConfig(loadItem('app_config', {
            systemPrompt: DEFAULT_SYSTEM_PROMPT,
            knowledgeBase: DEFAULT_KNOWLEDGE_BASE
        }));
    };

    // ============ INITIAL LOAD ============

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            if (useSupabase) {
                await fetchFromSupabase();
            } else {
                loadFromLocalStorage();
            }
            setLoading(false);
        };
        loadData();
    }, [useSupabase]);

    // ============ PERSISTENCE ============

    useEffect(() => {
        if (!useSupabase && !loading) {
            localStorage.setItem('app_partners', JSON.stringify(partners));
        }
    }, [partners, useSupabase, loading]);

    useEffect(() => {
        if (!useSupabase && !loading) {
            localStorage.setItem('app_news', JSON.stringify(news));
        }
    }, [news, useSupabase, loading]);

    useEffect(() => {
        if (!useSupabase && !loading) {
            localStorage.setItem('app_coupons', JSON.stringify(coupons));
        }
    }, [coupons, useSupabase, loading]);

    useEffect(() => {
        if (!useSupabase && !loading) {
            localStorage.setItem('app_config', JSON.stringify(config));
        }
    }, [config, useSupabase, loading]);

    // ============ ACTIONS ============

    const updateConfig = async (newConfig: Partial<AppConfig>) => {
        const updated = { ...config, ...newConfig };
        setConfig(updated);

        if (useSupabase && supabase) {
            try {
                for (const [key, value] of Object.entries(newConfig)) {
                    await supabase.from('config').upsert({ key, value }, { onConflict: 'key' });
                }
            } catch (error) {
                console.error('Error updating config:', error);
            }
        }
    };

    const addNews = async (item: Omit<NewsItem, 'id'>) => {
        if (useSupabase && supabase) {
            const { data, error } = await supabase.from('news').insert({
                title: item.title,
                date: item.date,
                image_url: item.imageUrl
            }).select().single();

            if (data && !error) {
                setNews(prev => [{
                    id: data.id,
                    title: data.title,
                    date: data.date,
                    imageUrl: data.image_url || ''
                }, ...prev]);
            }
        } else {
            const newItem: NewsItem = { ...item, id: `n${Date.now()}` };
            setNews(prev => [newItem, ...prev]);
        }
    };

    const updateNews = async (id: string, item: Partial<NewsItem>) => {
        if (useSupabase && supabase) {
            await supabase.from('news').update({
                title: item.title,
                date: item.date,
                image_url: item.imageUrl
            }).eq('id', id);
        }
        setNews(prev => prev.map(n => n.id === id ? { ...n, ...item } : n));
    };

    const deleteNews = async (id: string) => {
        if (useSupabase && supabase) {
            await supabase.from('news').delete().eq('id', id);
        }
        setNews(prev => prev.filter(n => n.id !== id));
    };

    const addCoupon = async (item: Omit<Coupon, 'id'>) => {
        if (useSupabase && supabase) {
            const { data, error } = await supabase.from('coupons').insert({
                partner_id: item.partnerId,
                title: item.title,
                description: item.description,
                discount: item.discount,
                expiry_date: item.expiryDate,
                usage_type: item.usageType,
                image_url: item.imageUrl,
                terms: item.terms,
                is_used: item.isUsed
            }).select().single();

            if (data && !error) {
                setCoupons(prev => [{
                    id: data.id,
                    partnerId: data.partner_id,
                    title: data.title,
                    description: data.description || '',
                    discount: data.discount,
                    expiryDate: data.expiry_date,
                    usageType: data.usage_type as 'OneTime' | 'Unlimited',
                    imageUrl: data.image_url || undefined,
                    terms: data.terms || '',
                    isUsed: data.is_used
                }, ...prev]);
            }
        } else {
            const newItem: Coupon = { ...item, id: `c${Date.now()}` };
            setCoupons(prev => [newItem, ...prev]);
        }
    };

    const updateCoupon = async (id: string, item: Partial<Coupon>) => {
        if (useSupabase && supabase) {
            await supabase.from('coupons').update({
                partner_id: item.partnerId,
                title: item.title,
                description: item.description,
                discount: item.discount,
                expiry_date: item.expiryDate,
                usage_type: item.usageType,
                image_url: item.imageUrl,
                terms: item.terms,
                is_used: item.isUsed
            }).eq('id', id);
        }
        setCoupons(prev => prev.map(c => c.id === id ? { ...c, ...item } : c));
    };

    const deleteCoupon = async (id: string) => {
        if (useSupabase && supabase) {
            await supabase.from('coupons').delete().eq('id', id);
        }
        setCoupons(prev => prev.filter(c => c.id !== id));
    };

    const addPartner = async (item: Omit<Partner, 'id'>) => {
        if (useSupabase && supabase) {
            const { data, error } = await supabase.from('partners').insert({
                name: item.name,
                category: item.category,
                logo_url: item.logoUrl,
                description: item.description
            }).select().single();

            if (data && !error) {
                setPartners(prev => [{
                    id: data.id,
                    name: data.name,
                    category: data.category as any,
                    logoUrl: data.logo_url || '',
                    description: data.description || ''
                }, ...prev]);
            }
        } else {
            const newItem: Partner = { ...item, id: `p${Date.now()}` };
            setPartners(prev => [newItem, ...prev]);
        }
    };

    const updatePartner = async (id: string, item: Partial<Partner>) => {
        if (useSupabase && supabase) {
            await supabase.from('partners').update({
                name: item.name,
                category: item.category,
                logo_url: item.logoUrl,
                description: item.description
            }).eq('id', id);
        }
        setPartners(prev => prev.map(p => p.id === id ? { ...p, ...item } : p));
    };

    const deletePartner = async (id: string) => {
        if (useSupabase && supabase) {
            await supabase.from('partners').delete().eq('id', id);
        }
        setPartners(prev => prev.filter(p => p.id !== id));
    };

    const resetData = async () => {
        if (window.confirm('全てのデータを初期状態に戻しますか？')) {
            if (useSupabase && supabase) {
                // Delete all data from Supabase
                await supabase.from('partners').delete().neq('id', '00000000-0000-0000-0000-000000000000');
                await supabase.from('coupons').delete().neq('id', '00000000-0000-0000-0000-000000000000');
                await supabase.from('news').delete().neq('id', '00000000-0000-0000-0000-000000000000');

                // Reset config
                await supabase.from('config').upsert([
                    { key: 'systemPrompt', value: DEFAULT_SYSTEM_PROMPT },
                    { key: 'knowledgeBase', value: DEFAULT_KNOWLEDGE_BASE }
                ], { onConflict: 'key' });

                await fetchFromSupabase();
            } else {
                setPartners(MOCK_PARTNERS);
                setNews(MOCK_NEWS);
                setCoupons(MOCK_COUPONS);
                setConfig({
                    systemPrompt: DEFAULT_SYSTEM_PROMPT,
                    knowledgeBase: DEFAULT_KNOWLEDGE_BASE
                });
                localStorage.clear();
            }
        }
    };

    return (
        <AppDataContext.Provider value={{
            user,
            news,
            coupons,
            partners,
            config,
            loading,
            updateConfig,
            addNews,
            updateNews,
            deleteNews,
            addCoupon,
            updateCoupon,
            deleteCoupon,
            addPartner,
            updatePartner,
            deletePartner,
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
