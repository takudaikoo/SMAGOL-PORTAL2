import React from 'react';
import { Home, CreditCard, Tag, User as UserIcon } from 'lucide-react';
import { Tab } from '../types';
import { BRAND_COLOR } from '../constants';

interface NavigationProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  const getIconColor = (tab: Tab) => currentTab === tab ? BRAND_COLOR : '#9ca3af';
  const getTextStyle = (tab: Tab) => currentTab === tab ? { color: BRAND_COLOR, fontWeight: 600 } : { color: '#9ca3af' };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)] pt-2 px-6 h-20 shadow-lg z-50 flex justify-between items-start">
      <button
        onClick={() => onTabChange(Tab.HOME)}
        className="flex flex-col items-center justify-center w-16 space-y-1"
      >
        <Home size={24} color={getIconColor(Tab.HOME)} />
        <span className="text-[10px]" style={getTextStyle(Tab.HOME)}>ホーム</span>
      </button>

      <button
        onClick={() => onTabChange(Tab.CARD)}
        className="flex flex-col items-center justify-center w-16 space-y-1"
      >
        <CreditCard size={24} color={getIconColor(Tab.CARD)} />
        <span className="text-[10px]" style={getTextStyle(Tab.CARD)}>会員証</span>
      </button>

      <button
        onClick={() => onTabChange(Tab.COUPON)}
        className="flex flex-col items-center justify-center w-16 space-y-1"
      >
        <Tag size={24} color={getIconColor(Tab.COUPON)} />
        <span className="text-[10px]" style={getTextStyle(Tab.COUPON)}>クーポン</span>
      </button>

      <button
        onClick={() => onTabChange(Tab.PROFILE)}
        className="flex flex-col items-center justify-center w-16 space-y-1"
      >
        <UserIcon size={24} color={getIconColor(Tab.PROFILE)} />
        <span className="text-[10px]" style={getTextStyle(Tab.PROFILE)}>メニュー</span>
      </button>
    </div>
  );
};

export default Navigation;