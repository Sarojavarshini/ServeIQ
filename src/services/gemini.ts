/// <reference types="vite/client" />
// import maathuna thaan vite-la work aagum
import { GoogleGenerativeAI } from '@google/generative-ai'; 
import { ChatMessage, MenuItem } from '../types';

// ✅ Vite-kaga process.env-ai import.meta.env-nu maathiruken
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.error("API Key is missing in .env file!");
}

const genAI = new GoogleGenerativeAI(apiKey);

const systemInstruction = `
You are Anna, a polite, enthusiastic waiter at ServeIQ.
Start your first message with "Welcome to ServeIQ."
Use words like 'Sir/Ma'am', 'Thank you', and 'Happy to help'.
Recommendation Logic:
- If a user is "confused" or doesn't know what to order, suggest the Mini Tiffin.
- If it's morning (or they mention breakfast), suggest Filter Coffee.
- If a user mentions a dish NOT on the menu, politely say "Sorry, we don't have that today, but may I suggest our famous Ghee Roast Dosa instead?"
- If a user asks for a combo suggestion for a specific dish, suggest a smart combo using other items from the menu.
Keep responses concise, helpful, and friendly.
`;

export async function getChatResponse(history: ChatMessage[], newMessage: string, imageBase64?: string): Promise<string> {
    try {
        // ✅ Model name-ai "gemini-1.5-flash" nu maathiruken (Stable version)
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: systemInstruction 
        });

        const chat = model.startChat({
            history: history.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }],
            })),
        });

        let result;
        if (imageBase64) {
            const base64Data = imageBase64.split(',')[1] || imageBase64;
            const imagePart = {
                inlineData: {
                    data: base64Data,
                    mimeType: 'image/jpeg'
                }
            };
            result = await model.generateContent([newMessage, imagePart]);
        } else {
            result = await chat.sendMessage(newMessage);
        }

        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error getting chat response:', error);
        return "Apologies, I am having a little trouble hearing you right now. Please try again!";
    }
}

export async function getMagicOrder(prompt: string, menu: MenuItem[]): Promise<{ items: { id: string, quantity: number }[], message: string }> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const menuContext = menu.map(m => `${m.id}: ${m.name} (₹${m.price}, ${m.calories} kcal, ${m.tags.join(', ')})`).join('\n');
        
        const fullPrompt = `Based on the user's request: "${prompt}", build a cart using ONLY the following menu items:\n${menuContext}\n\nReturn the result in JSON format: {"items": [{"id": "item_id", "quantity": 1}], "message": "explanation"}`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();
        
        // JSON clean up
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error('Error getting magic order:', error);
        return { items: [], message: "Sorry, I couldn't build that order right now." };
    }
}
// src/services/gemini.ts kulla kadeesiya ithai pottudunga

export async function getMealAnalysis(cartItems: { name: string, quantity: number, tags: string[], calories: number }[]): Promise<string> {
    try {
        if (cartItems.length === 0) return "";

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const cartContext = cartItems.map(item => `${item.quantity}x ${item.name} (${item.calories} kcal, tags: ${item.tags.join(', ')})`).join('\n');
        
        const prompt = `Analyze this restaurant order:\n${cartContext}\n\nProvide a fun, 1-2 sentence AI analysis of the meal's flavor profile or nutritional balance. Keep it short and engaging as Anna the waiter.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text() || "A wonderful selection! Enjoy your meal at ServeIQ.";
    } catch (error) {
        console.error('Error getting meal analysis:', error);
        return "A wonderful selection! Enjoy your meal at ServeIQ.";
    }
}
// Matha functions (Meal Analysis, etc.) ithu pola genAI model use panni update panna mudiyum.