'use client';

import React, { useState } from 'react';
import Navigation from './components/Navigation';
import HomeTab from './components/HomeTab';
import CardTab from './components/CardTab';
import CouponTab from './components/CouponTab';
import ProfileTab from './components/ProfileTab';
import CouponModal from './components/CouponModal';
import AdminDashboard from './components/AdminDashboard';
import { ConfigProvider } from './contexts/ConfigContext';
import { Tab, User, Coupon } from './types';
import { MOCK_USER, MOCK_COUPONS } from './constants';
import { getCouponRecommendation } from './services/geminiService';

const PageTemplate = () => {
    const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [user] = useState<User>(MOCK_USER);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
    const [showModal, setShowModal] = useState<Coupon | null>(null);
    const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
    const [loadingAi, setLoadingAi] = useState(false);

    // Handle coupon usage
    const handleUseCoupon = (coupon: Coupon) => {
        setShowModal(coupon);
    };

    const confirmUseCoupon = () => {
        if (showModal) {
            setCoupons(prev => prev.map(c => c.id === showModal.id ? { ...c, isUsed: true } : c));
            setShowModal(null);
            // Show success feedback (simplified alert for demo)
            alert(`${showModal.title}を使用しました！`);
        }
    };

    const fetchAiRecommendation = async () => {
        setLoadingAi(true);
        const message = await getCouponRecommendation(user, coupons);
        setAiRecommendation(message);
        setLoadingAi(false);
    };

    if (isAdminMode) {
        return (
            <ConfigProvider>
                <AdminDashboard onBack={() => setIsAdminMode(false)} />
            </ConfigProvider>
        );
    }

    return (
        <ConfigProvider>
            <div className="min-h-screen bg-gray-50 font-sans text-gray-900 max-w-md mx-auto shadow-2xl overflow-hidden relative">

                {/* Content Area */}
                <main className="h-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {activeTab === Tab.HOME && (
                        <HomeTab
                            user={user}
                            setActiveTab={setActiveTab}
                        />
                    )}
                    {activeTab === Tab.CARD && <CardTab user={user} />}
                    {activeTab === Tab.COUPON && (
                        <CouponTab
                            coupons={coupons}
                            onUse={handleUseCoupon}
                        />
                    )}
                    {activeTab === Tab.PROFILE && (
                        <ProfileTab
                            user={user}
                            onAdminClick={() => setIsAdminMode(true)}
                        />
                    )}
                </main>

                {/* Navigation */}
                <Navigation currentTab={activeTab} onTabChange={setActiveTab} />

                {/* Coupon Modal Overlay */}
                {showModal && (
                    <CouponModal
                        coupon={showModal}
                        onClose={() => setShowModal(null)}
                        onConfirm={confirmUseCoupon}
                    />
                )}
            </div>
        </ConfigProvider>
    );
};

export default PageTemplate;
