import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const transcript = body.transcript;
    const question = body.question;
    const transcriptPrompt = transcript
      .map((chunk: { text: string }) => chunk.text || " ")
      .join(" ");

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
You are an expert video content analyst. The following is the full transcript of a YouTube video.
Based on it, provide a clear, concise, friendly, human-readable answer to the given question. Assume the user hasn't watched the video. Make it human readable. Do not bold anything.

Transcript:
${transcriptPrompt}

Question:
${question}
`;

    const result = await model.generateContent([prompt]);

    const responseText = await result.response.text();
    console.log(responseText);
    return NextResponse.json({ answer: [responseText] }, { status: 200 });
  } catch (error) {
    console.error("Video analysis error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
