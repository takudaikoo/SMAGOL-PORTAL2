import { GoogleGenAI } from "@google/genai";
import { Coupon, User } from "../types";

// Initialize AI client lazily or safely
const getAiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is not set (VITE_GEMINI_API_KEY). AI features will utilize fallback responses.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getCouponRecommendation = async (user: User, coupons: Coupon[]): Promise<string> => {
  try {
    const ai = getAiClient();
    if (!ai) {
      return "お得なクーポンをご用意しております。ぜひご利用ください！(AI未連携)";
    }

    const availableCoupons = coupons.filter(c => !c.isUsed).map(c => `${c.title} (${c.discount})`).join(', ');

    // Simulate current context
    const hour = new Date().getHours();
    let timeContext = "昼下がり";
    if (hour < 11) timeContext = "朝";
    else if (hour > 17) timeContext = "夜";
    else if (hour >= 11 && hour <= 14) timeContext = "ランチタイム";

    const prompt = `
      あなたは企業の公式アプリのAIコンシェルジュです。
      現在の時間は${timeContext}です。
      ユーザー情報: 名前=${user.name}, ランク=${user.tier}, 保有ポイント=${user.points}。
      利用可能なクーポンリスト: [${availableCoupons}]。

      ユーザーに対して、今の時間帯やユーザーのランクに合わせて、最もおすすめのクーポンを1つ選び、
      親しみやすく、かつ丁寧な日本語で推薦してください。
      100文字以内で簡潔にお願いします。
      挨拶から始めてください。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "本日のおすすめクーポンをチェックしてください！";
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback message
    return "お得なクーポンをご用意しております。ぜひご利用ください！";
  }
};