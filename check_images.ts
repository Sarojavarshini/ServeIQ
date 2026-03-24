import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const urls = [
  'https://storage.googleapis.com/aistudio-user-assets/2026-03-21/1742662062640_ghee_roast.png',
  'https://storage.googleapis.com/aistudio-user-assets/2026-03-21/1742662062638_medu_vada.png',
  'https://storage.googleapis.com/aistudio-user-assets/2026-03-21/1742662062643_chicken_65.png',
  'https://storage.googleapis.com/aistudio-user-assets/2026-03-21/1742662062641_filter_coffee.png'
];

async function checkImages() {
  for (const url of urls) {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            inlineData: {
              data: base64,
              mimeType: 'image/png'
            }
          },
          "What food is this? Choose exactly one from: Ghee Roast, Medu Vada, Chicken 65, Filter Coffee."
        ]
      });
      console.log(`URL: ${url}`);
      console.log(`Food: ${result.text?.trim()}`);
      console.log('---');
    } catch (e: any) {
      console.error(`Error with ${url}:`, e.message);
    }
  }
}

checkImages();
