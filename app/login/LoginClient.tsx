"use client";

import { useState } from "react";

export default function LoginClient() {
  const [email, setEmail] = useState("");

  return (
    <div className="mx-auto max-w-sm space-y-4">
      <h1 className="text-xl font-semibold">Вход</h1>

      <label className="block text-sm">
        Email
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </label>

      <button className="w-full rounded bg-black px-4 py-2 text-white">
        Продолжить
      </button>
    </div>
  );
}
