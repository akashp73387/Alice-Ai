import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./Pages/MainPage";
import SignIn from "./Pages/SignIn";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
    <Toaster position="top-right" />
    <div className="min-h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </Router>
    </div>
    </>
  );
};

export default App;
