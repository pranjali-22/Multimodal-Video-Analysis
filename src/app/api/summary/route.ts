import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const transcript = body.transcript;
    const transcriptPrompt = transcript
      .map((chunk: { text: string }) => chunk.text || " ")
      .join(" ");
    console.log("transcriptPrompt");
    console.log(transcriptPrompt);

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are an expert video content analyst. The following is the full transcript of a YouTube video. 
    Treat this transcript as the complete spoken content of the video. Based on it, generate a concise, human-readable summary of what the video is about. Capture the key points, structure, and main takeaways.
    Return the summary in **3-4 clear and coherent sentences**. Avoid bullet points. Write naturally as if explaining to someone who hasn’t seen the video.
    Transcript:${transcriptPrompt}`;

    const result = await model.generateContent([prompt]);

    const responseText = await result.response.text();

    return NextResponse.json({ summary: responseText }, { status: 200 });
  } catch (error) {
    console.error("Video analysis error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
