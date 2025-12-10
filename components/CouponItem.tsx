import React from 'react';
import { Coupon } from '../types';
import { Clock, CheckCircle } from 'lucide-react';

interface CouponItemProps {
  coupon: Coupon;
  onUse: (coupon: Coupon) => void;
}

const CouponItem: React.FC<CouponItemProps> = ({ coupon, onUse }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col ${coupon.isUsed ? 'opacity-60 grayscale' : ''}`}>
      <div className="p-4 flex-1">
        <div className="flex justify-between items-start mb-2">
          {coupon.usageType === 'Unlimited' ? (
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
              期間中使い放題
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-orange-100 text-orange-700">
              1回限り
            </span>
          )}

          {coupon.isUsed && (
            <span className="flex items-center text-gray-500 text-xs font-bold">
              <CheckCircle size={14} className="mr-1" /> 使用済み
            </span>
          )}
        </div>
        <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{coupon.title}</h3>
        <p className="text-gray-500 text-xs mb-3">{coupon.description}</p>

        <div className="flex items-center text-gray-400 text-xs mt-auto">
          <Clock size={12} className="mr-1" />
          <span>有効期限: {coupon.expiryDate}</span>
        </div>
      </div>

      <div className="border-t border-dashed border-gray-200 relative">
        {/* Scalloped edge visual trick (dots) */}
        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-gray-50 rounded-full"></div>
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-gray-50 rounded-full"></div>

        <div className="p-3 bg-gray-50">
          {coupon.usageType === 'Unlimited' ? (
            <div className="text-center font-bold text-sm text-blue-900 bg-blue-50 py-2.5 rounded-lg border border-blue-200">
              会計時に画面を提示
            </div>
          ) : (
            <button
              onClick={() => !coupon.isUsed && onUse(coupon)}
              disabled={coupon.isUsed}
              className={`w-full py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95 ${coupon.isUsed
                  ? 'bg-gray-300 text-white cursor-not-allowed'
                  : 'bg-white text-blue-900 border border-blue-900 hover:bg-blue-50'
                }`}
            >
              {coupon.isUsed ? '使用済み' : 'クーポンを使う'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponItem;