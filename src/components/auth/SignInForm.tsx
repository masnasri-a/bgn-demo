"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";

export default function SignInForm() {
  const formRef = React.useRef<HTMLFormElement>(null);
  const handleButtonClick = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = 'https://bgn-be.anakanjeng.site/auth/login'
    const data = { username, password };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok');
      })
      .then(data => {
        localStorage.setItem("auth", JSON.stringify({ username }));
        localStorage.setItem("location_id", JSON.stringify(data.location_id));
        if (data.location_id !== null) {
          fetch(`https://bgn-be.anakanjeng.site/locations/select?kd_propinsi=${data.location_id}`)
            .then(response => {
              if (response.ok) {
                return response.json();
              }
              throw new Error('Network response was not ok');
            })
            .then(data => {
              localStorage.setItem("kd_propinsi", JSON.stringify(data.kd_propinsi));
              localStorage.setItem("nm_propinsi", JSON.stringify(data.nm_propinsi));
              window.location.replace("/");
            })
            .catch(error => {
              setError("Failed to fetch location data");
            });
        } else {
          window.location.replace("/");
        }

      })
      .catch(error => {
        setError("Invalid username or password");
      });
  };

  React.useEffect(() => {
    // If already logged in, redirect to /
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("auth");
      if (auth) {
        window.location.replace("/");
      }
    }
  }, []);

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your username and password to sign in!
            </p>
          </div>
          <div>
            <form ref={formRef} onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Username <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="admin"
                    type="text"
                    defaultValue={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="secret"
                      defaultValue={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm" onClick={handleButtonClick}>
                    Sign in
                  </Button>
                </div>
                {error && (
                  <div className="text-error-500 text-sm mt-2">{error}</div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
