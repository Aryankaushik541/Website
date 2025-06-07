import { ThreeCircles } from "react-loader-spinner";
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Appstate } from "../App"; // Assuming you have an Appstate context
import { useAddToCartMutation } from '../services/userAuthApi'
import { getToken } from "../services/LocalStorageToken";

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { access_token } = getToken();
  const useAppState = useContext(Appstate); // Access Appstate context
  const [addtocart, { isLoading }] = useAddToCartMutation(access_token);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/products/product/${slug}/`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data);
        setSelectedImage(`http://127.0.0.1:8000/${data.front_imges}`);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [slug]);

  const handleBuyNow = () => {
    navigate("/Checkout");
  };

  const [productInfo, setProductInfo] = useState({
    product: slug,
    quantity: 1,
  });

  const handleAddToCart = async () => {
    const response = await addtocart({ productInfo, access_token });
    console.log(response);
    if (response.error) {
      toast.error(response.error.data.error, { position: "top-right", autoClose: 1000, theme: "colored" });
    } else {
      useAppState.setAddCartLength(useAppState.addCartLength);
      toast.success("Product added to cart!", { position: "top-right", autoClose: 1000, theme: "colored" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeCircles visible={true} height="100" width="100" color="#000" ariaLabel="three-circles-loading" />
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  // product increment
  const increment = () => {
    if (productInfo.quantity >= product.stock) {
      toast.error(`only ${product.stock} products are available`, { position: "top-right", autoClose: 1000, theme: "colored" });
    } else {
      setProductInfo({ ...productInfo, quantity: productInfo.quantity + 1 });
    }
  };

  // product decrement
  const decrement = () => {
    if (productInfo.quantity <= 1) {
      toast.error(`You can't add 0 product`, { position: "top-right", autoClose: 1000, theme: "colored" });
    } else {
      setProductInfo({ ...productInfo, quantity: productInfo.quantity - 1 });
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={1000} hideProgressBar theme="dark" />
      <div className="flex flex-col items-center p-6 min-h-screen bg-gradient-to-br from-black via-gray-900 to-white text-gray-900 transition-all duration-300">
        <div className="max-w-6xl w-full bg-white shadow-lg rounded-lg p-8 grid md:grid-cols-3 gap-10">
          {/* Product Images */}
          <div className="flex flex-col items-center">
            <img src={selectedImage} alt="Product" className="w-96 h-99 object-cover border rounded-lg shadow-md" />
            <div className="flex gap-3 mt-4">
              <img
                src={`http://127.0.0.1:8000/${product.front_imges}`}
                alt="Front"
                className="w-20 h-20 object-cover border rounded-md cursor-pointer hover:opacity-80"
                onClick={() => setSelectedImage(`http://127.0.0.1:8000/${product.front_imges}`)}
              />
              <img
                src={`http://127.0.0.1:8000/${product.back_imges}`}
                alt="Back"
                className="w-20 h-20 object-cover border rounded-md cursor-pointer hover:opacity-80"
                onClick={() => setSelectedImage(`http://127.0.0.1:8000/${product.back_imges}`)}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold text-gray-800">{product.title}</h2>
            <h4 className="text-xl font-bold text-gray-800">Brand: {product.brand.name}</h4>
            <p className="text-gray-600 mt-3">{product.decription}</p>
            <div className="text-2xl font-semibold text-gray-800 mt-3">
              Actual Price: <span className="line-through">₹{product.actual_price}</span>
            </div>
            <div className="text-2xl font-semibold text-gray-800 mt-3">
              Discount Price: <span>₹{product.discount_price}</span>
            </div>
            <p className="text-green-600 mt-1">Available Stock: {product.stock}</p>
            <p className="text-gray-500 mt-2">🚚 Free Delivery in 2-5 days</p>

            {product.stock ? (
              <div className="flex items-center border border-gray-400 rounded-md w-20 h-8">
                <button
                  className="w-6 h-full text-sm font-semibold border-r border-gray-400 flex items-center justify-center"
                  onClick={decrement}
                >
                  -
                </button>
                <p className="w-8 text-center">{productInfo.quantity}</p>
                <button
                  className="w-6 h-full text-sm font-semibold border-l border-gray-400 flex items-center justify-center"
                  onClick={increment}
                >
                  +
                </button>
              </div>
            ) : null}
          </div>

          {/* Order Section */}
          <div className="border p-5 rounded-lg shadow-md bg-gray-50">
            <p className="text-xl font-semibold text-gray-800">Order Now</p>
            <p className="text-green-600 mt-1">✅ Eligible for free shipping</p>
            {product.stock ? (
              <div className="flex flex-col gap-3 mt-5">
                <button
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 px-4 rounded-lg font-semibold text-lg"
                  onClick={handleAddToCart}
                >
                  🛒 Add to Cart
                </button>
                <button
                  className="w-full bg-orange-600 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold text-lg"
                  onClick={handleBuyNow}
                >
                  ⚡ Buy Now
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 mt-5">
                <button className="w-full bg-yellow-300 text-white py-3 px-4 rounded-lg font-semibold text-lg" disabled>
                  🛒 Add to Cart
                </button>
                <button className="w-full bg-orange-400 text-white py-3 px-4 rounded-lg font-semibold text-lg" disabled>
                  ⚡ Buy Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
