import { NextRequest, NextResponse } from "next/server";
import {GoogleGenerativeAI} from "@google/generative-ai";

export async function POST(request: NextRequest) {
    try {
        const GEMINI_API_KEY = "AIzaSyBJTmn74fpS0AvXndtvUZnNU63ZopuLmK8";

        const body = await request.json();

        const videoUrl = body.videoUrl;
        const question = body.query
        console.log(question)
        console.log("inside visual route")

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `You are an expert in video content understanding and object recognition.

You will be provided with a link to a video and a target object or item that might appear in the video. Your task is to analyze the video content and identify the timestamps where this object or item is clearly visible or referenced.

Target Object or Item: ${question}

Return a list of timestamps (in mm:ss format) where the object appears or is mentioned, along with a brief description of the scene.

Example output format:
[
  { "time": "00:45", "description": "The object appears on a table during the interview." },
  { "time": "03:20", "description": "The object is shown in a close-up shot." }
] 
Only return an array do not add anything else to the answer.

If the object does not appear or there's not enough information, return an empty list.`;

        const result = await model.generateContent([
            prompt,
            {
                fileData: {
                    fileUri: videoUrl,
                    mimeType:"video/mp4"
                },
            },
        ]);

        console.log("hereAnswer");
        const responseText = await result.response.text();
        console.log(responseText)
        return NextResponse.json({ answer: responseText }, { status: 200 });
    } catch (error) {
        console.error("Video analysis error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
