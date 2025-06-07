import React from "react";
import Banner from "./Banner";
import Extraproduct from "./Extraproduct";
import Policy from "./Policy";
import Footer from "./Footer";
import Product from './Product';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-white text-white transition-all duration-300">
      <Banner />
      <Extraproduct />
      <Policy />
      <Product />
      <Footer />
    </div>
  );
};

export default Home;
