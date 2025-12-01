import { Routes, Route } from "react-router-dom";

import NavBar from "../components/NavBar";

import Home from "../src/pages/Home";
import Dashboard from "../src/pages/Dashboard";

import LoginPage from "./features/auth/LoginPage";
import SignupPage from "./features/auth/SignupPage";

import ProtectedRoute from "./features/auth/ProtectedRoute";


export default function App() {
  return (
      <>
		<NavBar />

		{/* Padding on every page for dashbar */}
		<div style ={{ paddingTop: "80px" }}>
		  <Routes>
			<Route path="/" element={<Home />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/signup" element={<SignupPage />} />
			<Route
			  path="/dashboard"
			  element={
				<ProtectedRoute>
				  <Dashboard />
				</ProtectedRoute>
			  }
			/>
		  </Routes>
		</div>
	  </>
	  
  );
}
