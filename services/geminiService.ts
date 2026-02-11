
import { GoogleGenAI, Type } from "@google/genai";
import { TradeAnalysis } from "../types";

export const getAIAdvisorOpinion = async (analysis: TradeAnalysis, pair: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Analyze this DeFi trade on Base blockchain for an Indian retail trader:
        Pair: ${pair}
        Price Impact: ${analysis.priceImpact.toFixed(2)}%
        Health Status: ${analysis.health}
        Suggested Action: ${analysis.suggestedAction}
        
        Provide a very short, punchy advisory note in professional but accessible language. 
        Focus on capital preservation. Mention specific risks like 'Low Liquidity' or 'Sandwich Attacks' if impact is high.
      `,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Fast response
      }
    });

    return response.text || "Analyzing market conditions...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ensure you are using a pool with deep liquidity to avoid slippage.";
  }
};
