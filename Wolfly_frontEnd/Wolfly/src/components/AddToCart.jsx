import React, { useEffect, useState, useContext } from 'react';
import { Appstate } from '../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import emptyCart from '../Images/cart.png';
import { getToken } from "../services/LocalStorageToken";
import { useNavigate } from "react-router-dom";

const AddToCart = () => {
    const useAppState = useContext(Appstate);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const { access_token } = getToken();
    const navigate = useNavigate();

    useEffect(() => {
        if (access_token) {
            const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
            setCartItems(storedCart);
        } else {
            navigate("/login");
        }
    }, [access_token, navigate]);

    useEffect(() => {
        calculateTotalPrice();
    }, [cartItems]);

    const calculateTotalPrice = () => {
        const total = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);
        setTotalPrice(total);
    };

    const handleQuantityChange = (itemId, newQuantity) => {
        const updatedCart = cartItems
            .map((item) => {
                if (item.id === itemId) {
                    if (newQuantity <= 0) return null;
                    if (newQuantity > item.stock) {
                        toast.error("Cannot exceed available stock", { position: "top-right", autoClose: 1000, theme: "colored" });
                        return item;
                    }
                    const updatedItem = { ...item, quantity: newQuantity, price: (item.discount_price || 0) * newQuantity };
                    return updatedItem;
                }
                return item;
            })
            .filter(Boolean);

        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        useAppState.setAddCart(updatedCart.length);
    };

    const handleRemoveItem = (itemId) => {
        const updatedCart = cartItems.filter((item) => item.id !== itemId);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        useAppState.setAddCart(updatedCart.length);
    };

    const handleCheckout = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/orders/placeorder/", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ items: cartItems })
            });

            if (response.ok) {
                toast.success("Order placed successfully!");
                localStorage.removeItem('cart');
                useAppState.setAddCart(0);
                navigate("/orders");
            } else {
                toast.error("Order failed. Try again.");
            }
        } catch (err) {
            toast.error("Something went wrong!");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <ToastContainer position="top-right" autoClose={2000} theme="colored" />
            <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
            {cartItems.length > 0 ? (
                <div>
                    <ul className="space-y-4">
                        {cartItems.map((item) => (
                            <li key={item.id} className="flex items-center border p-4 rounded-lg">
                                <img src={`http://127.0.0.1:8000/${item.front_imges}`} alt={item.title} className="w-20 h-20 object-cover mr-4" />
                                <div className="flex-grow">
                                    <h2 className="text-lg font-semibold">{item.title}</h2>
                                    <p className="text-gray-600">
                                        Price: ₹{(item.price || 0).toLocaleString('en-IN')}
                                    </p>
                                    <div className="flex items-center mt-2">
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                            className="px-2 py-1 bg-gray-200 rounded-l-md"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                            className="w-16 text-center border p-1"
                                        />
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            className="px-2 py-1 bg-gray-200 rounded-r-md"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-6 border-t pt-4">
                        <p className="text-xl font-semibold">Total: ₹{totalPrice.toLocaleString('en-IN')}</p>
                        <button
                            onClick={handleCheckout}
                            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center h-96">
                    <img src={emptyCart} alt="Empty Cart" className="w-64 opacity-50" />
                </div>
            )}
        </div>
    );
};

export default AddToCart;
