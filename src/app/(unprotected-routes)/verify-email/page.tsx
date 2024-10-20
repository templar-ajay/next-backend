"use client";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  const verifyEmail = async () => {
    try {
      const response = await axios.post("/api/users/verify-email", { token });
      if (response.data.success) {
        setVerified(true);
      } else {
      }
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    const urlToken = searchParams.get("token") || "";
    setToken(urlToken);
  }, []);

  useEffect(() => {
    if (token.length > 0) {
    }
  }, [token]);
  return (
    <div className="py-2 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl">Verify Email</h1>
      <h2 className="p-2 bg-orange-500 text-black">
        {token ? `${token}` : "no token found"}
      </h2>
      {verified && (
        <div>
          <h2>Verified</h2>
          <Link href="/login">Login</Link>
        </div>
      )}
      {error && (
        <div>
          <h2>Error</h2>
        </div>
      )}
      {token && <button onClick={verifyEmail}>Verify Email</button>}
    </div>
  );
};

export default Page;
