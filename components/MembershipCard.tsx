import React from 'react';
import { User } from '../types';
import { BRAND_COLOR } from '../constants';

interface MembershipCardProps {
  user: User;
}

const MembershipCard: React.FC<MembershipCardProps> = ({ user }) => {
  return (
    <div className="w-full relative group perspective">
      <div
        className="relative w-full aspect-[1.586/1] rounded-2xl shadow-2xl overflow-hidden text-white transition-transform duration-500"
        style={{ background: `linear-gradient(135deg, ${BRAND_COLOR} 0%, #1e4bb5 100%)` }}
      >
        {/* Decorative Circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 -left-10 w-32 h-32 bg-white opacity-5 rounded-full blur-xl"></div>

        <div className="p-6 h-full flex flex-col justify-between relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs opacity-70 tracking-wider">MEMBER CARD</p>
              <h2 className="text-2xl font-bold tracking-tight mt-1">{user.plan || user.tier}</h2>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-70">POINTS</p>
              <p className="text-2xl font-bold font-mono">{user.points.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Simulated Barcode */}
            <div className="bg-white p-2 rounded-lg flex justify-center items-center h-16">
              <div className="w-full h-full flex justify-between items-end px-2">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-black"
                    style={{
                      width: Math.random() > 0.5 ? '4px' : '2px',
                      height: '100%'
                    }}
                  ></div>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] opacity-60">MEMBER NAME</p>
                <p className="font-medium text-lg">{user.name}</p>
              </div>
              <div>
                <p className="text-[10px] opacity-60 text-right">ID NUMBER</p>
                <p className="font-mono tracking-widest text-sm">{user.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipCard;