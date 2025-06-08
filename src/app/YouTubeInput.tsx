"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function YouTubeInput() {
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    if (!videoUrl.trim()) return;

    setIsLoading(true);

    const encodedUrl = encodeURIComponent(videoUrl);
    router.push(`/video?url=${encodedUrl}`);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="youtube-url"
            className="block text-sm font-medium text-zinc-300 mb-2"
          >
            YouTube Video URL
          </label>
          <input
            id="youtube-url"
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
        </div>

        <button
          type="button"
          disabled={!videoUrl.trim() || isLoading}
          className="w-full px-6 py-3 bg-teal-500 hover:bg-teal-400 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
          onClick={handleSubmit}
        >
          {isLoading ? "Analyzing..." : "Analyze Video"}
        </button>
      </div>
    </div>
  );
}
