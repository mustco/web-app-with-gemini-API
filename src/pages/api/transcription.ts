import { IncomingForm } from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import { model } from '@src/utils/geminiApiClient';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form data:', err);
      return res.status(500).json({ message: 'Error parsing form data' });
    }

    const audioFile = files.audio?.[0];

    if (!audioFile) {
      return res.status(400).json({ message: 'No audio file uploaded' });
    }

    try {
      const filePath = audioFile.filepath; 
      const base64Buffer = fs.readFileSync(filePath);
      const base64AudioFile = base64Buffer.toString('base64');

      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: "audio/mp3",
            data: base64AudioFile,
          },
        },
        { text: "Generate a transcript and translate it into Indonesian" },
      ]);

      const transcription = result.response.text();
      res.status(200).json({ transcription });
    } catch (error) {
      console.error('Error processing audio:', error);
      res.status(500).json({ message: 'Error processing audio' });
    }
  });
}
