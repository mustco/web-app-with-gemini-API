const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const generateText = async (prompt: string) => {
//     try {
//         const response = await geminiApiClient.generateText({ prompt });
//         return response;
//     } catch (error) {
//         console.error("Error calling Gemini API:", error);
//         return null;
//     }
// }