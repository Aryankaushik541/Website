import React from "react";
import LoginForm from "./LoginForm";
import Footer from "./Footer";

const Login = () => {
  return (
    <>
      <div
        className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-black via-gray-900 to-white text-white transition-all duration-300"
      >
        <LoginForm />
      </div>
      <Footer />
    </>
  );
};

export default Login;
