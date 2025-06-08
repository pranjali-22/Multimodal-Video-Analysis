import { NextRequest, NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const videoUrl = body.videoUrl;

    if (!videoUrl) {
      return NextResponse.json({ error: "Video URL is required" }, { status: 400 });
    }

    let transcript;
    try {
      transcript = await YoutubeTranscript.fetchTranscript(videoUrl);
    } catch (err) {
      return NextResponse.json({ error: "Failed to fetch transcript" }, { status: 500 });
    }

    const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    let currentTime = 0;
    const formattedTranscript = transcript.map((seg) => {
      const line = {
        time: formatTime(currentTime),
        text: seg.text,
      };
      currentTime += seg.duration || 0;
      return line;
    });

    return NextResponse.json({ transcript: formattedTranscript }, { status: 200 });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
