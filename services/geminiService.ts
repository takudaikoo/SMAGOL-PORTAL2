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

// Existing function kept for backward compatibility or initial greeting reference
export const getCouponRecommendation = async (user: User, coupons: Coupon[]): Promise<string> => {
  return "AIコンシェルジュがチャットで対応します。";
};

import { ChatMessage } from "../types";

export const getChatResponse = async (
  user: User,
  coupons: Coupon[],
  history: ChatMessage[],
  userMessage: string,
  config: { systemPrompt: string; knowledgeBase: string }
): Promise<string> => {
  try {
    const ai = getAiClient();
    if (!ai) {
      return "申し訳ありません。現在AIとの通信ができません。";
    }

    const availableCoupons = coupons.filter(c => !c.isUsed).map(c => `${c.title} (${c.discount})`).join(', ');

    // Simulate current context
    const hour = new Date().getHours();
    let timeContext = "昼下がり";
    if (hour < 11) timeContext = "朝";
    else if (hour > 17) timeContext = "夜";
    else if (hour >= 11 && hour <= 14) timeContext = "ランチタイム";

    // Valid coupons info
    const contextInfo = `
    現在の時間は${timeContext}です。
    ユーザー情報: 名前=${user.name}, ランク=${user.tier}, 保有ポイント=${user.points}。
    利用可能なクーポンリスト: [${availableCoupons}]。
    
    [ナレッジベース]
    ${config.knowledgeBase}
    `;

    // Construct history for prompt
    const conversationHistory = history.map(msg =>
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.text}`
    ).join('\n');

    const prompt = `
      ${config.systemPrompt}
      
      以下のコンテキスト情報を踏まえて、ユーザーのチャットに返信してください。
      
      [コンテキスト]
      ${contextInfo}

      [これまでの会話]
      ${conversationHistory}
      User: ${userMessage}
      Assistant:
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "申し訳ありません。もう一度お聞きしてもよろしいですか？";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "申し訳ありません。エラーが発生しました。時間をおいて再度お試しください。";
  }
}