import type { NextApiRequest, NextApiResponse } from "next";
import { model } from "@src/utils/geminiApiClient";

export default async function handler(
    req: NextApiRequest, 
    res: NextApiResponse
) {
    if(req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    const { input } = req.body;
    if(!input) {
        res.status(400).json({ error: "Missing input" });
        return;
    }
   try {
        const result = await model.generateContent(input);
        const response = result.response;
        const script = response.text();

        res.status(200).json({ script });
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}