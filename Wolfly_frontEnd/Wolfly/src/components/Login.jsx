import React from "react";
import LoginForm from "./LoginForm";
import Footer from "./Footer"

// Importing the image correctly
import LoginBackground from '../Images/Login.png'; // Ensure this path is correct

const Login = () => {
  return (
    <>
      <div
        className="flex items-full justify-full w-full h-full bg-center"
        style={{
          backgroundImage: `url(${LoginBackground})`, // Using the imported image for background
          height: '80vh' // Limit height to 80% of the viewport height
        }}
      >
        <LoginForm />
      </div>
      <Footer />
    </>
  );
};

export default Login;
