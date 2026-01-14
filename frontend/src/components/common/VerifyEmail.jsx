// src/pages/VerifyEmail.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "../css/VerifyEmail.css";

const VerifyEmail=()=>{
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyUserEmail = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASEURL}/api/auth/verify-email?token=${token}`
        );
        setStatus("success");
        setMessage(res.data.message);
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message || "Email verification failed. Try again."
        );
      }
    };

    if (token) verifyUserEmail();
    
    else {
      setStatus("error");
      setMessage("Invalid verification link.");
    }
  }, [token]);

  return (
    <div className="verify-email-container">
      {status === "loading" && <p className="loading">Verifying your email...</p>}

      {status === "success" && (
        <div className="success-box">
          <h2>✅ Email Verified!</h2>
          <p>{message}</p>
          <a href="/login" className="login-link">Go to Login</a>
        </div>
      )}

      {status === "error" && (
        <div className="error-box">
          <h2>❌ Verification Failed</h2>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
