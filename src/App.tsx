/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { CategoryPage } from "./pages/CategoryPage";
import { JobDetails } from "./pages/JobDetails";
import { Admin } from "./pages/Admin";
import { Chatbot } from "./components/Chatbot";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/category/:id" element={<CategoryPage />} />
              <Route path="/job/:id" element={<JobDetails />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </Router>
  );
}
