import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {


  try {
    const body = await request.json();

    const transcript = body.transcript;
    console.log("inside timestamp")
    console.log(transcript)

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `\n' +
      'You are given a video transcript in the form of an array of JSON objects: \n' +
      '[{time: "00:00", text: "..."}, ...].\n' +
      '\n' +
      'Your task is to extract and return the key topics or sections in the video, along with the starting time for each. \n' +
      'Respond only with a clean array in the format:\n' +
      '[\n' +
      '  { time: "00:00", topic: "Introduction to XYZ" },\n' +
      '  ...\n' +
      ']\n' +
      '\n' +
      'Here is the transcript:\n' +
      '${JSON.stringify(transcript)}\n' +
      '    `;

    const result = await model.generateContent([prompt]);
    console.log("hereTimes");


    const responseText = await result.response.text();
    console.log(responseText)


    return NextResponse.json({ timestamps: responseText }, { status: 200 });
  } catch (error) {
    console.error("Video analysis error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
