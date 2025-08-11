"use client";
import React from "react";

export default function AuthRedirect() {
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("auth");
      const isSigninPage = window.location.pathname === "/signin";
      if (!auth && !isSigninPage) {
        window.location.replace("/signin");
      }
    }
  }, []);
  return null;
}
