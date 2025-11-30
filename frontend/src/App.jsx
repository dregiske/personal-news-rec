import { Routes, Route } from "react-router-dom";

import NavBar from "../components/NavBar";
import Home from "../pages/Home";

import LoginPage from "./features/auth/LoginPage";
import SignupPage from "./features/auth/SignupPage";

import ProtectedRoute from "./features/auth/ProtectedRoute";
import { useAuth } from "./features/auth/AuthContext";


export default function App() {
  return (
      <>
		<NavBar />
		<Routes>
		  <Route path="/" element={<Home />} />
		  <Route path="/login" element={<LoginPage />} />
		  <Route path="/signup" element={<SignupPage />} />


		  {/* Example of a protected route */}
		  {/* < DELETE HERE
		  <Route
			path="/dashboard"
			element={
			  <ProtectedRoute>
				<Dashboard />
			  </ProtectedRoute>
			}
		  />
		  DELETE HERE > */}

		</Routes>
	  </>
	  
  );
}
