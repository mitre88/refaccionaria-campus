"use client";

import { useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState("");

  function handleLogin(username: string) {
    setUser(username);
    setIsLoggedIn(true);
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setUser("");
  }

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}
