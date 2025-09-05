"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const storedUser = localStorage.getItem(`talentix_user_${username}`);
    if (!storedUser) {
      setError("User not found.");
      return;
    }
    const user = JSON.parse(storedUser);
    user.password = newPassword;
    localStorage.setItem(`talentix_user_${username}`, JSON.stringify(user));
    setSuccess(true);
    setTimeout(() => router.push("/auth/signin"), 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-yellow-100">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center">
        <Image
          src="/Black Bold Typographic Retro Night Club Restaurant Bar Logo  (1).png"
          alt="Talentix Logo"
          width={180}
          height={60}
          className="mb-6"
        />
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Reset Password</h1>
        <p className="text-gray-500 mb-6">Enter your username and new password.</p>
        <form className="w-full" onSubmit={handleReset}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Username</label>
            <input
              type="text"
              className="input-field w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              className="input-field w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              className="input-field w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          {success && <div className="text-green-600 text-sm mb-2">Password reset! Redirecting...</div>}
          <button
            type="submit"
            className="btn-primary w-full text-lg mt-2 mb-4"
          >
            Reset Password
          </button>
        </form>
        <div className="w-full text-sm text-right">
          <Link href="/auth/signin" className="text-yellow-600 hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
      <p className="mt-8 text-gray-400 text-xs">© 2024 Talentix. All rights reserved.</p>
    </div>
  );
} 