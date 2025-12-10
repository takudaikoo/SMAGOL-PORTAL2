import React from 'react';
import { Tag } from 'lucide-react';
import { Coupon } from '../types';
import { BRAND_COLOR } from '../constants';

interface CouponModalProps {
    coupon: Coupon;
    onClose: () => void;
    onConfirm: () => void;
}

const CouponModal: React.FC<CouponModalProps> = ({ coupon, onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl transform transition-all scale-100">
                <div className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                        <Tag size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{coupon.title}</h3>
                    <p className="text-sm text-gray-500 mb-6">このクーポンを使用しますか？<br />スタッフにご提示ください。</p>

                    <div className="bg-gray-50 p-3 rounded-lg text-xs text-left text-gray-600 mb-6">
                        <p className="font-bold mb-1">利用条件:</p>
                        <p>{coupon.terms}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={onClose}
                            className="py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200"
                        >
                            キャンセル
                        </button>
                        <button
                            onClick={onConfirm}
                            className="py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-900/20"
                            style={{ backgroundColor: BRAND_COLOR }}
                        >
                            使用する
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CouponModal;
