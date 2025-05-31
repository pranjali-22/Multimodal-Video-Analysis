import React, { useState } from "react";
import { FileVideo, Link as LinkIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const [inputType, setInputType] = useState<"upload" | "link" | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoLink, setVideoLink] = useState("");
    const navigate = useNavigate();

    const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setVideoFile(event.target.files[0]);
        }
    };

    const handleSubmit = () => {
        if (inputType === "upload" && videoFile) {
            const videoURL = URL.createObjectURL(videoFile);
            navigate("/video", { state: { type: "upload", url: videoURL } });
        } else if (inputType === "link" && videoLink) {
            navigate("/video", { state: { type: "link", url: videoLink } });
        } else {
            alert("Please select a video before uploading.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-3xl">
                <h1 className="text-5xl font-extrabold text-gray-800 mb-8 text-center">
                    Welcome to <span className="text-indigo-600">Multimodel Video Analysis</span>
                </h1>

                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                        How would you like to input your video?
                    </h2>
                    <div className="flex justify-center gap-6">
                        <button
                            className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                            onClick={() => setInputType("upload")}
                        >
                            <FileVideo className="w-5 h-5" /> Upload Video
                        </button>
                        <button
                            className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                            onClick={() => setInputType("link")}
                        >
                            <LinkIcon className="w-5 h-5" /> Provide Link
                        </button>
                    </div>
                </div>

                {inputType === "upload" && (
                    <div className="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <label className="block mb-2 font-medium text-gray-700">
                            Upload your video file:
                        </label>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoUpload}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                        />
                        {videoFile && (
                            <p className="mt-3 text-gray-600 italic">Selected file: {videoFile.name}</p>
                        )}
                        <div className="mt-8 text-center">
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                )}

                {inputType === "link" && (
                    <div className="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <label className="block mb-2 font-medium text-gray-700">
                            Paste the video URL:
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            value={videoLink}
                            onChange={(e) => setVideoLink(e.target.value)}
                            placeholder="https://example.com/video.mp4 or YouTube URL"
                        />
                        {videoLink && (
                            <p className="mt-3 text-gray-600 italic">Entered URL: {videoLink}</p>
                        )}
                        <div className="mt-8 text-center">
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
