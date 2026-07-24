import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Notification from "./pages/Notification";
import Call from "./pages/Call";
import Chat from "./pages/Chat";
import Onboarding from "./pages/Onboarding";
import Friends from "./pages/FriendsPage";
import ProfilePage from "./pages/ProfilePage";
import PublicProfilePage from "./pages/PublicProfilePage";
import LandingPage from "./pages/LandingPage";
import MessagesPage from "./pages/MessagesPage";
import InstantConnectPage from "./pages/InstantConnectPage";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPassword";
import PageLoader from "./components/PageLoader";
import useAuthUser from "./hooks/useAuthUser";
import Layout from "./components/Layout.jsx";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen">
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}><Home /></Layout>
            ) : isAuthenticated && !isOnboarded ? (
              <Navigate to="/onboarding" />
            ) : (
              <LandingPage />
            )
          }
        />
        <Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to="/" />} />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />}
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route
          path="/friends"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}><Friends /></Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/instant-connect"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}><InstantConnectPage /></Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/messages"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}><MessagesPage /></Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}><ProfilePage /></Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/profile/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}><PublicProfilePage /></Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}><Notification /></Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/call/:id"
          element={isAuthenticated && isOnboarded ? <Call /> : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />}
        />
        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}><Chat /></Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? <Onboarding /> : <Navigate to="/" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;