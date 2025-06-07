import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import emptyOrders from '../Images/cart.png';
import { getToken } from "../services/LocalStorageToken";
import { ToastContainer, toast } from "react-toastify";
import { Appstate } from "../App";

const Order = () => {
  const useAppState = useContext(Appstate);
  const navigate = useNavigate();
  const { access_token } = getToken();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (statusFilter === "All") setFilteredOrders(orders);
    else setFilteredOrders(orders.filter(order => (order.status || "Pending") === statusFilter));
  }, [statusFilter, orders]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/orders/showorder/', {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) setOrders([]);
        else throw new Error("Failed to fetch orders.");
      } else {
        const data = await response.json();
        setOrders(data);
        useAppState.setAddCartLength(0);
      }
    } catch (error) {
      setErrorMessage(error.message || "Error fetching orders.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/orders/cancel/${orderId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error("Cancel failed");

      toast.success("Order cancelled.");
      fetchOrders();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const openStatusModal = (order) => setSelectedOrder(order);
  const closeModal = () => setSelectedOrder(null);

  const downloadInvoice = (orderId) => {
    const link = document.createElement("a");
    link.href = `http://127.0.0.1:8000/orders/invoice/${orderId}/`;
    link.target = "_blank";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-white text-white transition-all duration-300 p-6 flex justify-center items-center flex-col relative">
      <h2 className="text-3xl font-bold mb-6 text-center">🛍 My Orders</h2>

      {/* Status Filter */}
      <div className="mb-6 flex space-x-4">
        {["All", "Pending", "Delivered", "Cancelled"].map(status => (
          <button
            key={status}
            className={`px-4 py-2 rounded-full border ${
              statusFilter === status ? "bg-white text-black" : "bg-gray-700 text-white"
            }`}
            onClick={() => setStatusFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-center">Loading your orders...</p>
      ) : errorMessage ? (
        <p className="text-red-400 text-center">{errorMessage}</p>
      ) : filteredOrders.length > 0 ? (
        <div className="w-full max-w-5xl bg-white text-black shadow-lg p-6 rounded-xl border">
          {filteredOrders.map((order) => (
            <div key={order.order_id || order.id} className="border-b pb-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-lg">Order ID: {order.order_id}</p>
                <button
                  onClick={() => openStatusModal(order)}
                  className={`text-sm font-bold px-3 py-1 rounded-full
                    ${order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"} hover:underline`}
                >
                  {order.status || "Pending"}
                </button>
              </div>

              <div className="flex items-center">
                <img
                  src={order.products?.front_imges ? `http://127.0.0.1:8000${order.products.front_imges}` : emptyOrders}
                  className="w-20 h-20 rounded-lg object-cover shadow"
                  alt="product"
                />
                <div className="ml-4 flex-1">
                  <h3 className="font-bold text-lg">{order.products?.title}</h3>
                  <p>Quantity: {order.quantity}</p>
                  <p>Total: ₹{(order.final_price * order.quantity).toLocaleString("en-IN")}</p>
                </div>
              </div>

              <div className="flex gap-4 mt-3">
                <button
                  onClick={() => downloadInvoice(order.order_id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Download Invoice
                </button>

                {order.status !== "Cancelled" && order.status !== "Delivered" && (
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => handleCancelOrder(order.order_id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-96">
          <img src={emptyOrders} alt="No Orders" className="w-60 mb-4 opacity-70" />
          <p className="text-lg text-gray-300">No {statusFilter.toLowerCase()} orders found.</p>
          <button
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 px-5 rounded"
            onClick={() => navigate("/")}
          >
            Start Shopping
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white text-black w-96 rounded-xl p-6 relative shadow-lg">
            <button onClick={closeModal} className="absolute top-2 right-3 text-gray-500 text-xl">&times;</button>
            <h3 className="text-xl font-bold mb-4">Order Status</h3>
            <p><strong>Order ID:</strong> {selectedOrder.order_id}</p>
            <p><strong>Status:</strong> {selectedOrder.status || "Pending"}</p>
            <p><strong>Placed On:</strong> {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : "N/A"}</p>
            <hr className="my-3" />
            <p className="text-gray-700 mb-2">📦 Tracking No: <strong>#TRK-{selectedOrder.order_id?.slice(-6)}</strong></p>
            <p className="text-sm text-gray-600">Check delivery status on the courier website.</p>
            <button
              onClick={closeModal}
              className="mt-5 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Order;
