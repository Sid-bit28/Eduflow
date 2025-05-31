import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  const { question } = await request.json();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Tell me ${question}`,
    });
    return NextResponse.json(
      {
        status: 200,
        reply: response.text,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
        },
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      error: 'Error connecting with Gemini.',
    });
  }
}
