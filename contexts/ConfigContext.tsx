import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppConfig {
    systemPrompt: string;
    knowledgeBase: string;
}

interface ConfigContextType extends AppConfig {
    updateConfig: (newConfig: Partial<AppConfig>) => void;
    resetConfig: () => void;
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

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<AppConfig>({
        systemPrompt: DEFAULT_SYSTEM_PROMPT,
        knowledgeBase: DEFAULT_KNOWLEDGE_BASE,
    });

    // Load from localStorage on mount
    useEffect(() => {
        const savedConfig = localStorage.getItem('app_config');
        if (savedConfig) {
            try {
                setConfig(JSON.parse(savedConfig));
            } catch (e) {
                console.error("Failed to parse config", e);
            }
        }
    }, []);

    // Save to localStorage whenever config changes
    useEffect(() => {
        localStorage.setItem('app_config', JSON.stringify(config));
    }, [config]);

    const updateConfig = (newConfig: Partial<AppConfig>) => {
        setConfig(prev => ({ ...prev, ...newConfig }));
    };

    const resetConfig = () => {
        setConfig({
            systemPrompt: DEFAULT_SYSTEM_PROMPT,
            knowledgeBase: DEFAULT_KNOWLEDGE_BASE,
        });
    };

    return (
        <ConfigContext.Provider value={{ ...config, updateConfig, resetConfig }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (context === undefined) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
};
