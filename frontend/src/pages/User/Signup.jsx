import React, { useState } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { SetLoader } from "../../redux/LoadingSlice";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.loaders);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(SetLoader(true));
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/auth/register`,
        formData,
      );
      if (data.success) {
        toast.success(data.message);
        sendMail(data.data);
        setTimeout(() => {
          dispatch(SetLoader(false));
          navigate("/login");
        }, 4000);
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong ❌");
    } finally {
      dispatch(SetLoader(false));
    }
  };

  const sendMail = async (user) => {
    const verifyUrl = `https://apna-meds.vercel.app/verifyemail?token=${user.verificationToken}`;
    const htmlContent = `<div style="width: 600px; margin: 0 auto;">

        <div
          style="
            background: linear-gradient(135deg, #0a7cff, #0047b3);
            color: #ffffff;
            padding: 30px;
            text-align: center;
          "
        >
          <h1 style="margin: 0; font-size: 28px; font-weight: 600">
            Verify Your Email
          </h1>
          <p style="margin: 6px 0 0; font-size: 16px; opacity: 0.9">
            One last step to activate your account
          </p>
        </div>
        <!-- Body -->
        <div style="padding: 25px 30px">
          <h2
            style="
              color: #0a7cff;
              font-size: 22px;
              font-weight: 600;
              margin-top: 0;
            "
          >
            Hello ${user.name},
          </h2>
          <p style="font-size: 16px">
            Thank you for signing up with <b>Apna Meds</b>. To complete your
            registration and keep your account secure, please verify your email
            address.
          </p>
          <!-- Verify Button -->
          <div style="text-align: center; margin: 30px 0">
            <a
              href="${verifyUrl}"
              target="_blank"
              style="
                background: #0a7cff;
                color: #ffffff;
                text-decoration: none;
                padding: 14px 34px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                display: inline-block;
              "
            >
              Verify Email Address
            </a>
          </div>
          <p style="font-size: 14px; color: #666666">
            If the button above doesn’t work, copy and paste the link below into
            your browser:
          </p>
          <p style="font-size: 13px; color: #0a7cff; word-break: break-all">
            ${verifyUrl}
          </p>
          <hr
            style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0"
          />
          <p style="font-size: 14px; color: #777777">
            ⏰ This verification link is valid for <b>24 hours</b>.
          </p>
          <p style="font-size: 13px; color: #888888">
            If you did not create an account with Apna Meds, you can safely ignore
            this email. No further action is required.
          </p>
        </div>
        <!-- Footer -->
        <div
          style="
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 13px;
            color: #888888;
            border-top: 1px solid #eeeeee;
          "
        >
          <p style="margin: 0">Need help? Contact our support team anytime.</p>
          <p style="margin: 0">
            &copy; ${new Date().getFullYear()} Apna Meds. All rights reserved.
          </p>
          <p style="margin: 10px 0 0">Thank you for choosing <b>Apna Meds</b> ❤️</p>
        </div>
      </div>
    `;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASEURL}/api/mail/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: user.email,
            subject: "Verify Email From - Apna-Meds",
            html: htmlContent,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send email");
      }
      alert("Email sent successfully 🚀");
    } catch (error) {
      console.error("Send mail error:", error);
      alert(error.message || "Something went wrong");
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        pauseOnHover
        theme="colored"
      />

      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-image">
            <img
              src="https://res.cloudinary.com/dejqyvuqj/image/upload/v1767762892/Banner-apna-med/premium_photo-1661757221486-183030ef8670_g7ukt4.jpg"
              alt="Signup"
            />
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            <h2>Create Account</h2>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit">{loading ? "Loading..." : "Sign Up"}</button>

            <p className="login-link">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
