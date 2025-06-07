import React, { useEffect, useState } from "react";
import { Star, StarHalf, ShoppingBag, Truck, CheckCircle, X } from "lucide-react";
import { formatCurrency, formatDate, getStatusDetails } from "./utils";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  const access_token = "mock_token_replace_with_real_auth";
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/orders/showorder/";

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/orders/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!access_token) {
      console.log("Redirect to login");
      return;
    }
    fetchOrders();
  }, [access_token]);

  const handleOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const cancelOrder = async (orderId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this order? This action cannot be undone.");
    if (!confirmCancel) return;

    setCancellingOrderId(orderId);
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/cancel/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to cancel order");
      }
      alert("Order cancelled successfully");
      fetchOrders();
    } catch (error) {
      alert(error.message || "Network error. Please try again.");
    } finally {
      setCancellingOrderId(null);
    }
  };

  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Loading your orders...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-white p-4">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white py-16 px-6">
      <section className="max-w-[1200px] mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-2">My Orders</h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Track and manage your orders with ease and confidence.
          </p>
        </header>

        {orders.length === 0 ? (
          <section className="text-center py-20 text-gray-500">
            <ShoppingBag size={72} className="mx-auto mb-5 stroke-current" />
            <h2 className="text-3xl font-semibold mb-2">No Orders Found</h2>
            <p className="mb-6 text-lg max-w-md mx-auto">
              You haven&apos;t placed any orders yet.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="inline-block px-10 py-3 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-colors duration-200"
            >
              Start Shopping
            </button>
          </section>
        ) : (
          <section className="space-y-10">
            {orders.map((order) => {
              const statusDetails = getStatusDetails(order.status);
              return (
                <article
                  key={order.id}
                  className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow duration-300"
                >
                  <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div className="flex items-center mb-3 lg:mb-0">
                      <h3 className="text-2xl font-bold text-gray-900 mr-5">
                        Order #{order.order_number || order.id}
                      </h3>
                      <span className={`flex items-center gap-2 rounded-full px-4 py-1 text-sm font-semibold ${statusDetails.color} ${statusDetails.bgColor}`}>
                        {statusDetails.icon}
                        <span className="capitalize">{order.status}</span>
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleOrderDetails(order)}
                        className="px-6 py-2 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800"
                      >
                        View Details
                      </button>
                      {order.status?.toLowerCase() === "pending" && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          disabled={cancellingOrderId === order.id}
                          className="px-6 py-2 bg-red-600 text-white rounded-2xl font-semibold hover:bg-red-700 disabled:opacity-50"
                        >
                          {cancellingOrderId === order.id ? "Cancelling..." : "Cancel Order"}
                        </button>
                      )}
                    </div>
                  </header>

                  <section className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-600">
                    <div>
                      <span className="font-semibold text-gray-700 block mb-1">Order Date</span>
                      <time>{formatDate(order.created_at)}</time>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 block mb-1">Total Amount</span>
                      <p className="text-green-700 font-extrabold text-lg">{formatCurrency(order.total_amount)}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 block mb-1">Items</span>
                      <p>{order.items?.length || 0} item(s)</p>
                    </div>
                  </section>
                </article>
              );
            })}
          </section>
        )}
      </section>
    </main>
  );
};

export default Order;
