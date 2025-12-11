export enum Tab {
  HOME = 'HOME',
  CARD = 'CARD',
  COUPON = 'COUPON',
  PROFILE = 'PROFILE'
}

// カテゴリー定義（拡張版）
export type CategoryType =
  | 'GOLF_COURSE'   // ゴルフ場
  | 'SPORTS'        // 練習場・スポーツジムなど
  | 'SHOPPING'      // 実店舗・一般小売
  | 'ONLINE_STORE'  // オンラインショップ（EC）
  | 'GOURMET'       // 飲食
  | 'TRAVEL'        // 旅行・宿泊
  | 'BEAUTY'        // 美容・健康
  | 'SERVICE'       // クリーニング等のサービス
  | 'OTHER';        // その他

// ユーザー情報
export interface User {
  id: string;
  name: string;
  points: number;
  tier: 'Regular' | 'Gold' | 'Platinum';
  plan?: string;
  joinDate: string;
}

// 【新規】提携先（店舗・企業）
export interface Partner {
  id: string;
  name: string;
  category: CategoryType;
  logoUrl: string;
  description?: string;
}

// 【変更】クーポン
export interface Coupon {
  id: string;
  partnerId: string;
  title: string;
  description: string;
  discount: string;
  expiryDate: string;
  usageType: 'OneTime' | 'Unlimited';
  isUsed: boolean;
  terms: string;
  imageUrl?: string; // Optional banner image for the coupon
  // UI helper property for listing (optional, but useful if backend joins data, otherwise we join on frontend)
  // For the purpose of this refactor, we will rely on partnerId to look up Partner info.
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
}

export interface CompetitionEvent {
  id: string;
  title: string;
  date: string;
  course: string;
  participants: number;
  status: 'Open' | 'Closed' | 'Upcoming';
  imageUrl: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}