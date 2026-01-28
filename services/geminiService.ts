
import { GoogleGenAI } from "@google/genai";
import { Material, PedidoAtendimento } from "../types";

export const analyzeStock = async (materials: Material[], pedidos: PedidoAtendimento[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Como um especialista em gestão de suprimentos e logística, analise os seguintes dados de estoque e pedidos:
    
    ESTOQUE ATUAL:
    ${JSON.stringify(materials, null, 2)}
    
    HISTÓRICO RECENTE DE PEDIDOS:
    ${JSON.stringify(pedidos, null, 2)}
    
    Por favor, forneça:
    1. Uma análise crítica da saúde do estoque (quais itens estão em risco de ruptura).
    2. Sugestões de reposição baseadas nos níveis mínimos.
    3. Insights sobre o nível de serviço ao cliente (atendimento).
    4. 3 recomendações práticas para melhorar a eficiência operacional.
    
    Responda em Português do Brasil, formatado em Markdown claro.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Não foi possível gerar a análise no momento.";
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    return "Erro ao processar análise inteligente. Verifique a conexão.";
  }
};
