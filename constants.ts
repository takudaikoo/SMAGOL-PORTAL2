import { Coupon, NewsItem, User, CompetitionEvent, Partner } from './types';

export const BRAND_COLOR = '#0d3280';

export const MOCK_USER: User = {
  id: '88029103',
  name: '山田 太郎',
  points: 1250,
  tier: 'Platinum',
  plan: 'プレミアムプラン',
  joinDate: '2023-01-15'
};

export const MOCK_PARTNERS: Partner[] = [
  { id: 'p1', name: 'レイクサイドカントリークラブ', category: 'GOLF_COURSE', logoUrl: 'https://placehold.jp/150x150.png?text=Golf', description: '自然豊かな名門コース' },
  { id: 'p2', name: 'ゴルフパートナー', category: 'SHOPPING', logoUrl: 'https://placehold.jp/150x150.png?text=Shop', description: '新品・中古クラブ販売' },
  { id: 'p3', name: '焼肉トラジ', category: 'GOURMET', logoUrl: 'https://placehold.jp/150x150.png?text=Meat', description: '厳選された極上の焼肉' },
  { id: 'p4', name: 'GDOショップ', category: 'ONLINE_STORE', logoUrl: 'https://placehold.jp/150x150.png?text=EC', description: '国内最大級のゴルフEC' },
  { id: 'p5', name: 'オリックスレンタカー', category: 'TRAVEL', logoUrl: 'https://placehold.jp/150x150.png?text=Car', description: '会員限定特別優待プラン' },
];

export const MOCK_COUPONS: Coupon[] = [
  {
    id: 'c1',
    partnerId: 'p2',
    title: '会計から10%OFF',
    description: '全店舗でご利用いただけます。',
    discount: '10% OFF',
    expiryDate: '2024-12-31',
    usageType: 'OneTime',
    isUsed: false,
    terms: '他のクーポンとの併用はできません。'
  },
  {
    id: 'c2',
    partnerId: 'p3',
    title: '生ビール1杯無料',
    description: 'お食事をご注文の方限定。',
    discount: 'FREE',
    expiryDate: '2024-06-30',
    usageType: 'OneTime',
    isUsed: false,
    terms: '1回のご来店につき1枚のみ使用可能です。'
  },
  {
    id: 'c3',
    partnerId: 'p1',
    title: 'プレーフィ 1,000円OFF',
    description: '平日予約限定。',
    discount: '¥1,000 OFF',
    expiryDate: '2024-09-30',
    usageType: 'OneTime',
    isUsed: false,
    terms: 'WEB予約時に自動適用されます。'
  },
  {
    id: 'c4',
    partnerId: 'p5',
    title: '基本料金 20%OFF',
    description: '全車種対象（一部除く）。',
    discount: '20% OFF',
    expiryDate: '2025-03-31',
    usageType: 'Unlimited',
    isUsed: false,
    terms: '予約時に会員番号をお伝えください。'
  }
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: '春の新商品が入荷しました',
    date: '2024.04.10',
    imageUrl: 'https://picsum.photos/400/200'
  },
  {
    id: 'n2',
    title: '営業時間変更のお知らせ',
    date: '2024.04.01',
    imageUrl: 'https://picsum.photos/400/201'
  },
  {
    id: 'n3',
    title: '会員ランク制度のリニューアルについて',
    date: '2024.03.25',
    imageUrl: 'https://picsum.photos/400/202'
  }
];

export const MOCK_COMPETITION: CompetitionEvent = {
  id: 'comp1',
  title: '新春オンラインゴルフコンペ2025',
  status: 'ongoing', // 'upcoming', 'ongoing', 'ended'
  startDate: '2025-01-05',
  endDate: '2025-01-31',
  url: 'https://example.com/competition',
  imageUrl: 'https://picsum.photos/800/400'
};