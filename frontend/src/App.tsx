import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import VideoPage from "./pages/VideoPage.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/video" element={<VideoPage />} />
            </Routes>
        </Router>
    );
}

export default App;
