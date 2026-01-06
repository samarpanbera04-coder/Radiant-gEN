
import { GoogleGenAI, Type } from "@google/genai";

// Standard client for most operations
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export type GenMode = 'fast' | 'deep';

/**
 * PEAK LEVEL GENERATOR
 * Enforces strictly professional, enterprise-grade architecture for Minecraft and Discord environments.
 */
export const generateMinecraftContent = async (
  prompt: string, 
  type: string, 
  version?: string, 
  platform?: string, 
  existingFiles?: any[], 
  requiresResourcePack?: boolean,
  mode: GenMode = 'deep'
) => {
  const context = `
    Target Version: ${version || 'Latest'}
    Platform: ${platform || 'Standard'}
    Category: ${type}
    Includes Resource Pack Integration: ${requiresResourcePack ? 'YES' : 'NO'}
    ${existingFiles ? `Project Context: ${JSON.stringify(existingFiles)}` : ''}
  `;

  const modelName = mode === 'deep' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  
  const config: any = {
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        files: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              content: { type: Type.STRING },
              language: { type: Type.STRING }
            },
            required: ["name", "content", "language"]
          }
        },
        steps: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
      required: ["title", "files", "steps"]
    },
    // MAX THINKING BUDGET for peak performance reasoning
    thinkingConfig: mode === 'deep' ? { thinkingBudget: 32768 } : { thinkingBudget: 0 }
  };

  const response = await ai.models.generateContent({
    model: modelName,
    contents: `You are the RADIANT SYSTEM SUPREME ARCHITECT (v5.0 Peak). 
    TASK: ${prompt}. 
    CONTEXT: ${context}. 
    
    ULTIMATE ENGINEERING REQUIREMENTS:
    1. ARCHITECTURE: Utilize advanced design patterns (Dependency Injection, Service Layers, Factory Pattern).
    2. OPTIMIZATION: Zero-overhead logic, asynchronous data handling, and peak JVM/Node performance.
    3. STRUCTURE: Return a FULL PROJECT structure. No snippets. Every file required for a professional deployment.
    4. DOCUMENTATION: Include complex configuration files (YAML/JSON) with detailed internal commentary.
    5. SAFETY: Implement robust error handling, null safety, and thread-safe operations.
    
    Return strictly valid JSON conforming to the schema.`,
    config
  });
  
  // Use .text property directly
  const text = response.text?.trim() || "{}";
  return JSON.parse(text);
};

export const generateCommandGuide = async (files: any[]) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Synthesize a PEAK-LEVEL ARCH_DOCS.md for this project. Focus on advanced deployment instructions, performance tuning, and human-readable API documentation.
    Files: ${JSON.stringify(files)}`,
    config: { thinkingConfig: { thinkingBudget: 8000 } }
  });
  return response.text;
};

export const searchServerMOTD = async (ip: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Search and extract live MOTD data for Minecraft IP: ${ip}. Detect hex colors. Return as JSON {line1, line2}.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          line1: { type: Type.STRING },
          line2: { type: Type.STRING }
        },
        required: ["line1", "line2"]
      }
    },
  });
  return JSON.parse(response.text || "{}");
};

export const askAssistant = async (question: string, history: { role: string, text: string }[]) => {
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    history: history.map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.text }]
    })),
    config: {
      systemInstruction: 'You are the RADIANT SYSTEM ARCHITECT. You provide elite-level engineering advice, server optimization strategies, and complex logic troubleshooting. Always maintain a professional, high-fidelity engineering persona.',
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 16000 }
    }
  });

  const response = await chat.sendMessage({ message: question });
  return response.text;
};

// Creating a new GoogleGenAI instance for high-quality models as required by guidelines to pick up updated user API keys
export const generateImageImagen = async (prompt: string, aspectRatio: string) => {
  const localAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await localAi.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: `PEAK FIDELITY CINEMATIC RENDER: ${prompt}. Ultra-detailed, 4K texture mapping, professional lighting, photorealistic pixel accuracy.` }]
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any,
        imageSize: "1K"
      }
    },
  });

  // Extracting image part from parts array as per guidelines
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

// Fixing missing generateVideoVeo function used in MediaStudio.tsx
export const generateVideoVeo = async (prompt: string, aspectRatio: '16:9' | '9:16', imageBase64?: string) => {
  const localAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const videoParams: any = {
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt || 'High-fidelity cinematic Minecraft render',
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio
    }
  };

  if (imageBase64) {
    // Decoding data URI to imageBytes for video generation
    const match = imageBase64.match(/^data:(image\/\w+);base64,(.+)$/);
    if (match) {
      videoParams.image = {
        imageBytes: match[2],
        mimeType: match[1]
      };
    }
  }

  let operation = await localAi.models.generateVideos(videoParams);

  // Poll the operation status until it is done
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await localAi.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed to return a download URI.");

  // Fetching the generated video using the API key
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const diagnoseCrash = async (log: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Perform an ATOMIC ANALYSIS of this system crash log: ${log}. Determine exact bytecode failure point and provide a high-level engineering fix.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          error: { type: Type.STRING },
          cause: { type: Type.STRING },
          solution: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ['low', 'medium', 'high', 'critical'] }
        },
        required: ["error", "cause", "solution", "severity"]
      },
      thinkingConfig: { thinkingBudget: 24000 }
    }
  });
  return JSON.parse(response.text || "{}");
};
