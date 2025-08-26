import { BrowserRouter, Routes, Route, } from "react-router-dom"
import React from "react";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Chat from "./pages/Chat";


const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login/>} />
                <Route path="/chat" element={<Chat />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;
