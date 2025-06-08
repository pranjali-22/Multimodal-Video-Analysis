"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

type TranscriptLine = {
  time: string;
  text: string;
};

type TimeStamp = {
  time: string;
  topic: string;
};

export default function Page() {
  const searchParams = useSearchParams();
  const videoUrl = searchParams.get("url");

  const [videoId, setVideoId] = useState<string | null>(null);
  const [summary, setSummary] = useState("");
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [timestamps, setTimestamps] = useState<TimeStamp[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const [showSummary, setShowSummary] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showTimestamps, setShowTimestamps] = useState(false);

  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState<{ question: string; answer: string[] }[]>([]);
  const [showChat, setShowChat] = useState(false);

  const [showVisual, setShowVisual] = useState(false);
  const [isLoadingVisual, setLoadingVisual] = useState(false);
  const [visualConversation, setVisualConversation] = useState<{
    question: string;
    answer: { time: string; description: string }[]
  }[]>([]);
  const [visualQuery, setVisualQuery] = useState("");
  const [visualResults, setVisualResults] = useState<{ time: string; description: string }[]>([]);

  const handleVisualSearch = async () => {
    setLoadingVisual(true)
    if (!visualQuery.trim()) return;

    try {
      const res = await fetch("/api/visual", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          query: visualQuery,
          videoUrl: videoUrl,
        }),
      });

      const data = await res.json();

      let rawTimestamps = data.answer;
      rawTimestamps = cleanJsonString(rawTimestamps);
      setVisualResults(JSON.parse(rawTimestamps) || []);
      const newEntry = {
        question: visualQuery,
        answer: rawTimestamps,
      }
      console.log("reqf")
      console.log(rawTimestamps)
      setVisualConversation([...visualConversation, newEntry]);
      setLoadingVisual(false)

    } catch (error) {
      console.error("Error in visual search:", error);
      setVisualResults([]);
      setLoadingVisual(false)
    }

  };


  const handleAsk = async () => {
    if (!question.trim()) return;

    try {
      const res = await fetch("/api/question", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          transcript: transcript,
          question: question
        }),
      });


      const data = await res.json();
      const newEntry = {question, answer: data.answer || ["Sorry, I don’t know."]};
      setConversation([...conversation, newEntry]);
      setQuestion("");
    } catch (error) {
      console.error("Error during chat:", error);
      setConversation([...conversation, {question, answer: ["Something went wrong."]}]);
      setQuestion("");
    }
  };

  function cleanJsonString(str: string) {
    return str
        .replace(/```json\s*/, "")
        .replace(/```/, "")
        .trim();
  }

  const timeToSeconds = (time: string) => {
    const parts = time.split(":").map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return Number(parts[0]);
  };
  useEffect(() => {
    const processVideo = async () => {
      if (!videoUrl) return;

      setIsLoading(true);
      try {
        const url = new URL(videoUrl);
        const v = url.searchParams.get("v");
        setVideoId(v);

        const responseTranscript = await fetch("/api/transcript", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({videoUrl}),
        });
        const dataTranscript = await responseTranscript.json();
        setTranscript(dataTranscript.transcript || []);

        const responseSummary = await fetch("/api/summary", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({transcript: dataTranscript.transcript}),
        });
        const dataSummary = await responseSummary.json();
        setSummary(dataSummary.summary || "");

        const responseTimestamp = await fetch("/api/timestamps", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({transcript: dataTranscript.transcript}),
        });
        const dataTimestamp = await responseTimestamp.json();

        let rawTimestamps = dataTimestamp.timestamps;
        if (typeof rawTimestamps === "string") {
          rawTimestamps = cleanJsonString(rawTimestamps);
          setTimestamps(JSON.parse(rawTimestamps) || []);
        } else {
          setTimestamps(rawTimestamps || []);
        }
      } catch (error) {
        console.error("Error processing video:", error);
      } finally {
        setIsLoading(false);
      }
    };

    processVideo();
  }, [videoUrl]);

  if (!videoUrl) return <p className="p-6 text-red-400">No video URL provided.</p>;
  return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">

          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-teal-300 tracking-tight">
              Video Analysis
            </h1>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,_1fr)_2fr] gap-10">

            {/* Sticky Video Player */}
            <div className="sticky top-12 self-start h-fit">
              <div className="overflow-hidden rounded-2xl bg-white/[0.05] ring-1 ring-white/[0.1] shadow-xl">
                <div className="aspect-video lg:aspect-[3/2]">
                  <iframe
                      key={startTime ?? undefined}
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${videoId}${startTime !== null ? `?start=${startTime}&autoplay=1` : ""}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allowFullScreen
                  />
                </div>
              </div>
            </div>

            {/* Right Panel (Scrollable Content) */}
            <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">

              {isLoading && (
                  <p className="text-center text-yellow-300 text-lg">⏳ Loading AI insights...</p>
              )}

              {/* Summary / Transcript / Timestamps */}
              {[{
                title: "Summary",
                isOpen: showSummary,
                toggle: () => setShowSummary(!showSummary),
                content: (
                    <div className="whitespace-pre-wrap text-zinc-300 max-h-60 overflow-y-auto pr-2">
                      {summary || "No summary available."}
                    </div>
                )
              }, {
                title: "Transcript",
                isOpen: showTranscript,
                toggle: () => setShowTranscript(!showTranscript),
                content: (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 text-zinc-300">
                      {transcript.map((line, index) => (
                          <div key={index} className="flex gap-2 items-start border-b border-white/[0.05] pb-2">
                            <button onClick={() => setStartTime(timeToSeconds(line.time))}
                                    className="text-purple-400 hover:underline">
                              [{line.time}]
                            </button>
                            <p>{line.text}</p>
                          </div>
                      ))}
                    </div>
                )
              }, {
                title: "TimeStamps",
                isOpen: showTimestamps,
                toggle: () => setShowTimestamps(!showTimestamps),
                content: timestamps.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 text-zinc-300">
                      {timestamps.map((stamp, idx) => (
                          <div key={idx} className="flex gap-2 items-start border-b border-white/[0.05] pb-2">
                            <button onClick={() => setStartTime(timeToSeconds(stamp.time))}
                                    className="text-purple-400 hover:underline">
                              [{stamp.time}]
                            </button>
                            <p>{stamp.topic}</p>
                          </div>
                      ))}
                    </div>
                ) : (
                    <p className="text-zinc-500">No visual timestamps available.</p>
                )
              }].map(({ title, isOpen, toggle, content }, i) => (
                  <div key={i} className="rounded-2xl bg-white/[0.05] ring-1 ring-white/[0.1] shadow-lg">
                    <button
                        onClick={toggle}
                        className="w-full px-6 py-4 flex justify-between items-center text-left font-semibold text-lg text-teal-300 hover:text-teal-200"
                    >
                      {title} <span>{isOpen ? "▲" : "▼"}</span>
                    </button>
                    {isOpen && <div className="px-6 pb-6">{content}</div>}
                  </div>
              ))}

              {/* Chat Section */}
              <div className="rounded-2xl bg-white/[0.05] ring-1 ring-white/[0.1] shadow-lg">
                <button
                    onClick={() => setShowChat(!showChat)}
                    className="w-full px-6 py-4 flex justify-between items-center text-lg font-semibold text-teal-300 hover:text-teal-200"
                >
                  Chat with Video <span>{showChat ? "▲" : "▼"}</span>
                </button>
                {showChat && (
                    <div className="px-6 pb-6 space-y-4">
                      <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                        {conversation.map((entry, idx) => (
                            <div key={idx} className="space-y-2">
                              <div
                                  className="bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3 w-fit max-w-md ml-auto shadow-md">
                                <p className="text-sm font-semibold text-zinc-400 mb-1">You</p>
                                <p>{entry.question}</p>
                              </div>
                              {entry.answer.map((resp, i) => (
                                  <div key={i}
                                       className="bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3 w-fit max-w-md shadow-md">
                                    <p className="text-sm font-semibold text-zinc-400 mb-1">Bot</p>
                                    <p>{resp}</p>
                                  </div>
                              ))}
                            </div>
                        ))}
                      </div>

                      {/* Chat Input */}
                      <div className="flex gap-2">
                        <input
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                            placeholder="Ask something..."
                            className="flex-1 px-4 py-2 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:ring-2 focus:ring-teal-500 shadow-inner"
                        />
                        <button
                            onClick={handleAsk}
                            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-500 rounded-xl shadow"
                        >
                          Ask
                        </button>
                      </div>
                    </div>
                )}
              </div>

              {/* Visual Search Section */}
              <div className="rounded-2xl bg-white/[0.05] ring-1 ring-white/[0.1] shadow-lg">
                <button
                    onClick={() => setShowVisual(!showVisual)}
                    className="w-full px-6 py-4 flex justify-between items-center text-lg font-semibold text-teal-300 hover:text-teal-200"
                >
                  Visual Search <span>{showVisual ? "▲" : "▼"}</span>
                </button>
                {showVisual && (
                    <div className="px-6 pb-6 space-y-4">
                      <div className="flex gap-2">
                        <input
                            value={visualQuery}
                            onChange={(e) => setVisualQuery(e.target.value)}
                            placeholder="e.g. park, tree, person..."
                            className="flex-1 px-4 py-2 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:ring-2 focus:ring-teal-500 shadow-inner"
                        />
                        <button
                            onClick={handleVisualSearch}
                            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-500 rounded-xl shadow"
                        >
                          Search
                        </button>
                      </div>

                      {/* Show a loading spinner if isLoadingVisual is true */}
                      {isLoadingVisual ? (
                          <div className="flex justify-center items-center py-4">
                            <div className="w-8 h-8 border-t-4 border-teal-500 border-solid rounded-full animate-spin"></div>
                          </div>
                      ) : visualResults.length > 0 ? (
                          <div className="space-y-3 max-h-60 overflow-y-auto text-zinc-300 pr-2">
                            {visualResults.map((result, idx) => (
                                <div key={idx} className="flex gap-2 items-start border-b border-white/[0.05] pb-2">
                                  <button
                                      onClick={() => setStartTime(timeToSeconds(result.time))}
                                      className="text-purple-400 hover:underline"
                                  >
                                    [{result.time}]
                                  </button>
                                  <p>{result.description}</p>
                                </div>
                            ))}
                          </div>
                      ) : (
                          <p className="text-zinc-500 italic"></p>
                      )}
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}