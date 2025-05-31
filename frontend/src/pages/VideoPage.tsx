import React, { useState } from "react";
import { useLocation } from "react-router-dom";

type LocationState = {
    type: "upload" | "link";
    url: string;
};

export default function VideoPage() {
    const location = useLocation();
    const state = location.state as LocationState | undefined;

    const dummyTimestamps = [
        { time: "00:00", label: "Introduction" },
        { time: "01:15", label: "Scene 1" },
        { time: "02:45", label: "Scene 2" },
        { time: "04:00", label: "Conclusion" },
    ];

    const dummySummary =
        "This is a dummy video summary that is quite long and should demonstrate the read more/read less functionality. It provides an overview of the key points and insights extracted from the video content. Users can expand or collapse this text to read the full summary or keep it brief.";

    const [readMore, setReadMore] = useState(false);
    const summaryToShow = readMore
        ? dummySummary
        : dummySummary.slice(0, 120) + (dummySummary.length > 120 ? "..." : "");

    if (!state) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <p className="text-red-600 text-xl">No video provided. Please go back and upload or provide a link.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 bg-gray-50 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">Timestamps</h1>

            {/* Video Player */}
            <div className="mb-8">
                {state.type === "link"
                && state.url.includes("youtube.com")
                    ? (
                    // Embed YouTube video iframe
                    <div className="aspect-w-16 aspect-h-9">
                        <iframe
                            className="rounded-lg shadow-lg w-full h-64 sm:h-96"
                            src={state.url.replace("watch?v=", "embed/")}
                            title="YouTube Video Player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                ) : (
                    // Video tag for uploaded or non-YouTube links
                    <video
                        className="rounded-lg shadow-lg w-full h-auto max-h-[480px]"
                        controls
                        src={state.url}
                    />
                )}
            </div>

            {/* Timestamps list */}
            <ul className="mb-8 space-y-2">
                {dummyTimestamps.map(({ time, label }) => (
                    <li key={time} className="flex justify-between border-b border-gray-200 py-2">
                        <span className="font-semibold text-indigo-600">{time}</span>
                        <span className="text-gray-700">{label}</span>
                    </li>
                ))}
            </ul>

            {/* Summary with read more */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-3 text-gray-800">Brief Summary</h2>
                <p className="text-gray-700 mb-2">{summaryToShow}</p>
                {dummySummary.length > 120 && (
                    <button
                        onClick={() => setReadMore(!readMore)}
                        className="text-indigo-600 hover:underline font-semibold"
                    >
                        {readMore ? "Read less" : "Read more"}
                    </button>
                )}
            </div>

            <div className="text-center">
                <button
                    className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                    onClick={() => alert("Ask questions feature coming soon!")}
                >
                    Ask questions about the video
                </button>
            </div>
        </div>
    );
}
