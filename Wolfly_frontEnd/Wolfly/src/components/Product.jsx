import React, { useEffect, useContext, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import { Appstate } from "../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useGetProductsQuery } from '../services/userAuthApi';
import { getToken } from "../services/LocalStorageToken";
import { NavLink } from "react-router-dom";

const Product = () => {
   
    const [hoveredId, setHoveredId] = useState(null);
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("userToken");
    const { data: products, isLoading, error } = useGetProductsQuery()
    const { access_token } = getToken();

    const handleBuyNow = (product) => {
        if (!access_token) {
            navigate("/login");
        } else {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.push({ ...product, quantity: 1 });
            localStorage.setItem("cart", JSON.stringify(cart));

            toast.success(`🛒 ${product.title} added to cart!`, {
                position: "top-right",
                autoClose: 1000,
                theme: "dark",
            });

            setTimeout(() => {
                navigate("/cart");
            }, 1000);
        }
    };

    return (
        <>
            <ToastContainer />
            
            <section>
            
                <div className="my-0 mx-auto py-28 px-11">
                    <h2 className="font-bold text-3xl">Why Choose Neverend Lifestyle</h2>
                    <p className="text-2xl font-light">
                        Choose Neverend Lifestyle for a holistic, enriching learning experience that empowers you to achieve your goals.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 px-10">
                
                    {
                        products && products.length > 0 ? (

                            products.map((element) => (
                                <div
                                    
                                    className="flex flex-wrap items-start gap-7 w-80 p-6 my-7 mx-auto shadow-lg"
                                    key={element.slug}
                                    onMouseEnter={() => setHoveredId(element.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                >
                                    <article className="flex flex-col items-start gap-4">
                                        <span className="text-dark-teal bg-teal-100 py-1 px-4 rounded-full">
                                            {element.category.name}
                                        </span>
                                        
                                        
                            
                                        <div className="relative text-center w-72 h-72 mb-10 group">
                                            <img
                                                src={`http://127.0.0.1:8000/${element.front_imges}`}
                                                alt={element.title}
                                                className="absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out group-hover:opacity-0"
                                            />
                                            {element.back_imges && (
                                                <img
                                                    src={`http://127.0.0.1:8000/${element.back_imges}`}
                                                    alt={element.title}
                                                    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
                                                />
                                            )}
                                        </div>
                                        
                                        <h2 className="text-3xl font-bold pt-2">{element.title}</h2>
                                        <div className="text-yellow-400">
                                            <StarIcon />
                                            <StarIcon />
                                            <StarIcon />
                                            <StarIcon />
                                            <StarHalfIcon />
                                        </div>
                                        <p className="text-sm">{element.decription}</p>
                                        <div className="flex gap-6 text-lg">
                                            <span>{`₹${element.discount_price.toLocaleString("en-IN")}`}</span>
                                            <span className="line-through">{`₹${element.actual_price.toLocaleString("en-IN")}`}</span>
                                        </div>
                                        <div className="flex gap-6 text-lg">
                                            <p>Total Stocks Available:</p>
                                            <p>{element.stock}</p>
                                          
                                        </div>
                                        {
                                            access_token ?
                             
                                                <NavLink
                                                    to={`/productdetails/${element.slug}/`}
                                                    className="relative px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-xl 
                                    hover:from-indigo-600 hover:to-blue-500 hover:scale-105 transform transition-all duration-300 ease-out
                                    after:content-[''] after:absolute after:inset-0 after:border-2 after:border-white after:rounded-full 
                                    after:opacity-0 hover:after:opacity-100 hover:after:scale-110 
                                    before:absolute before:inset-0 before:bg-white before:blur-lg before:opacity-10 hover:before:opacity-20"
                                                >
                                                    Buy Now
                                                </NavLink>
                                                :
                                                <></>
                                        }
                                    </article>
                                </div>
                            )

                            )) :
                            <></>
                    }

                </div>
            </section>
        </>
    );
};

export default Product;
