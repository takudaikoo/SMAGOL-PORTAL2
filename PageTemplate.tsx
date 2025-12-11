import React, { useState } from 'react';
import Navigation from './components/Navigation';
import HomeTab from './components/HomeTab';
import CardTab from './components/CardTab';
import CouponTab from './components/CouponTab';
import ProfileTab from './components/ProfileTab';
import CouponModal from './components/CouponModal';
import { Tab, Coupon } from './types'; // Removed User import as it comes from context
import { getCouponRecommendation } from './services/geminiService';
import { useAppData } from './contexts/AppDataContext';

const PageTemplate = () => {
    const { user, coupons: contextCoupons } = useAppData(); // Use dynamic data
    const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);

    // We maintain 'coupons' state for local interaction (e.g. usage status) if we want ephemeral state, 
    // BUT since we have a global context, we should probably rely on that or sync.
    // However, AppData 'coupons' are shared. 
    // If the user 'uses' a coupon, we should probably update the context?
    // For now, let's just use the contextCoupons for display. 
    // If we want to simulate usage persisting, we need to call updateCoupon from context.
    // Let's grab updateCoupon too.
    const { updateCoupon } = useAppData();

    const [showModal, setShowModal] = useState<Coupon | null>(null);

    // AI logic moved to HomeTab essentially, or passed down?
    // HomeTab handles its own AI now with context. 
    // But PageTemplate has `getCouponRecommendation` import... checking HomeTab usage.
    // HomeTab uses `getChatResponse`. 
    // The old `aiRecommendation` state here seems unused by the new HomeTab interaction? 
    // Let's verify HomeTab props.
    // HomeTab props: { user, setActiveTab }. It manages its own chat state now.
    // So we can remove aiRecommendation state here.

    // Handle coupon usage
    const handleUseCoupon = (coupon: Coupon) => {
        setShowModal(coupon);
    };

    const confirmUseCoupon = () => {
        if (showModal) {
            // Update context
            updateCoupon(showModal.id, { isUsed: true });
            setShowModal(null);
            alert(`${showModal.title}を使用しました！`);
        }
    };

    return (
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
                        coupons={contextCoupons}
                        onUse={handleUseCoupon}
                    />
                )}
                {activeTab === Tab.PROFILE && (
                    <ProfileTab
                        user={user}
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
    );
};

export default PageTemplate;
