"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Page = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }, [user]);

  const onSignUp = async () => {
    try {
      setLoading(() => true);
      const response = await axios.post("/api/users/signup", user);
      if (response.data.success) {
        console.log("Sign Up Success", response.data);
        toast.success(response.data);
        router.push("/home");
        setUser(() => {
          return { email: "", password: "", username: "" };
        });
      } else {
        console.log(response.data.error);
        toast.error(response.data.error);
      }
      setLoading(false);
    } catch (err: any) {
      console.log("err", err.message);
      toast.error(err.message);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>{loading ? "Processing" : "Sign Up"}</h1>
      <hr />
      <label htmlFor="username">Username</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="username"
        type="text"
        placeholder="username"
        value={user.username}
        onChange={(e) => {
          setUser((x) => {
            return { ...x, username: e.target.value };
          });
        }}
      />
      <label htmlFor="email">Email</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="email"
        type="email"
        placeholder="email"
        value={user.email}
        onChange={(e) => {
          setUser((x) => {
            return { ...x, email: e.target.value };
          });
        }}
      />
      <label htmlFor="password">Password</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="password"
        type="password"
        placeholder="password"
        value={user.password}
        onChange={(e) => {
          setUser((x) => {
            return { ...x, password: e.target.value };
          });
        }}
      />
      <button
        onClick={onSignUp}
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
        disabled={submitDisabled}
      >
        Sign UP
      </button>
      <br />
      <Link className="text-sm" href={"/login"}>
        Visit Login page
      </Link>
    </div>
  );
};

export default Page;
