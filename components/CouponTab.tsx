import React, { useState } from 'react';
import CouponItem from './CouponItem';
import { Coupon, CategoryType, Partner } from '../types';
import { BRAND_COLOR, MOCK_PARTNERS } from '../constants';
import { ChevronLeft, MapPin, Store, Utensils, ShoppingBag, Truck, Plane, Sparkles, MoreHorizontal, Trophy } from 'lucide-react';

interface CouponTabProps {
    coupons: Coupon[];
    onUse: (coupon: Coupon) => void;
}

type ViewMode = 'CATEGORY' | 'PARTNER_LIST' | 'COUPON_LIST';

const CategoryIcon: React.FC<{ type: CategoryType, size?: number }> = ({ type, size = 24 }) => {
    switch (type) {
        case 'GOLF_COURSE': return <Trophy size={size} />;
        case 'SPORTS': return <MapPin size={size} />;
        case 'SHOPPING': return <ShoppingBag size={size} />;
        case 'ONLINE_STORE': return <Store size={size} />;
        case 'GOURMET': return <Utensils size={size} />;
        case 'TRAVEL': return <Plane size={size} />; // Fallback icon for Travel
        case 'BEAUTY': return <Sparkles size={size} />;
        case 'SERVICE': return <Truck size={size} />;
        default: return <MoreHorizontal size={size} />;
    }
};

const CATEGORIES: { type: CategoryType, label: string }[] = [
    { type: 'GOLF_COURSE', label: 'ゴルフ場' },
    { type: 'SPORTS', label: '練習場・ジム' },
    { type: 'SHOPPING', label: '店舗・小売' },
    { type: 'ONLINE_STORE', label: 'ネット通販' },
    { type: 'GOURMET', label: 'グルメ' },
    { type: 'TRAVEL', label: '旅行・宿泊' },
    { type: 'BEAUTY', label: '美容・健康' },
    { type: 'SERVICE', label: 'サービス' },
];

const CouponTab: React.FC<CouponTabProps> = ({ coupons, onUse }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('CATEGORY');
    const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

    const handleCategorySelect = (cat: CategoryType) => {
        setSelectedCategory(cat);
        setViewMode('PARTNER_LIST');
    };

    const handlePartnerSelect = (partner: Partner) => {
        setSelectedPartner(partner);
        setViewMode('COUPON_LIST');
    };

    const handleBack = () => {
        if (viewMode === 'COUPON_LIST') {
            setViewMode('PARTNER_LIST');
            setSelectedPartner(null);
        } else if (viewMode === 'PARTNER_LIST') {
            setViewMode('CATEGORY');
            setSelectedCategory(null);
        }
    };

    // Filter Logic
    const filteredPartners = selectedCategory
        ? MOCK_PARTNERS.filter(p => p.category === selectedCategory)
        : [];

    const filteredCoupons = selectedPartner
        ? coupons.filter(c => c.partnerId === selectedPartner.id)
        : [];

    return (
        <div className="px-4 py-6 pb-24">
            {/* Header / Back Navigation */}
            <div className="flex items-center mb-6 px-2">
                {viewMode !== 'CATEGORY' && (
                    <button onClick={handleBack} className="mr-3 p-1 rounded-full hover:bg-gray-100">
                        <ChevronLeft size={24} className="text-gray-600" />
                    </button>
                )}
                <h2 className="text-xl font-bold text-gray-800">
                    {viewMode === 'CATEGORY' && '提携クーポンを探す'}
                    {viewMode === 'PARTNER_LIST' && CATEGORIES.find(c => c.type === selectedCategory)?.label}
                    {viewMode === 'COUPON_LIST' && selectedPartner?.name}
                </h2>
            </div>

            {/* VIEW 1: CATEGORY GRID */}
            {viewMode === 'CATEGORY' && (
                <div className="grid grid-cols-2 gap-4">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.type}
                            onClick={() => handleCategorySelect(cat.type)}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-3 hover:shadow-md transition-all active:scale-95"
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-900">
                                <CategoryIcon type={cat.type} />
                            </div>
                            <span className="font-bold text-gray-700 text-sm">{cat.label}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* VIEW 2: PARTNER LIST */}
            {viewMode === 'PARTNER_LIST' && (
                <div className="space-y-3">
                    {filteredPartners.length > 0 ? (
                        filteredPartners.map(partner => (
                            <button
                                key={partner.id}
                                onClick={() => handlePartnerSelect(partner)}
                                className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 text-left hover:bg-gray-50 transition-colors"
                            >
                                <img src={partner.logoUrl} alt={partner.name} className="w-12 h-12 rounded-lg object-contain bg-gray-50 p-1" />
                                <div>
                                    <h3 className="font-bold text-gray-800">{partner.name}</h3>
                                    <p className="text-xs text-gray-500 line-clamp-1">{partner.description}</p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-400">
                            <p>このカテゴリーの提携先は<br />まだありません。</p>
                        </div>
                    )}
                </div>
            )}

            {/* VIEW 3: COUPON LIST */}
            {viewMode === 'COUPON_LIST' && (
                <div className="space-y-4">
                    {filteredCoupons.length > 0 ? (
                        filteredCoupons.map(coupon => (
                            <CouponItem key={coupon.id} coupon={coupon} onUse={onUse} />
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-400">
                            <p>現在利用可能なクーポンは<br />ありません。</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CouponTab;
