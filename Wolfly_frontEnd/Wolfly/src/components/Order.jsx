import React, { useEffect, useState } from "react";
import { Star, StarHalf, ShoppingBag, Truck, CheckCircle, X } from "lucide-react";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  // For demo purposes; replace with your auth token logic
  const access_token = "mock_token_replace_with_real_auth";

  // API base URL - configurable through environment variable
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

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
      // Replace with your routing logic
      console.log("Redirect to login");
      return;
    }
    fetchOrders();
  }, [access_token]);

  const getStatusDetails = (status) => {
    const map = {
      pending: { icon: <ShoppingBag size={16} />, color: "text-yellow-700", bgColor: "bg-yellow-100" },
      processing: { icon: <Truck size={16} />, color: "text-blue-700", bgColor: "bg-blue-100" },
      shipped: { icon: <Truck size={16} />, color: "text-indigo-700", bgColor: "bg-indigo-100" },
      delivered: { icon: <CheckCircle size={16} />, color: "text-green-700", bgColor: "bg-green-100" },
      cancelled: { icon: <X size={16} />, color: "text-red-700", bgColor: "bg-red-100" },
    };
    return map[status?.toLowerCase()] || {
      icon: <ShoppingBag size={16} />,
      color: "text-gray-500",
      bgColor: "bg-gray-100",
    };
  };

  const handleOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const cancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order? This action cannot be undone."
    );
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

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatCurrency = (amount) => `₹${Number(amount).toLocaleString("en-IN")}`;

  if (loading)
    return (
      <main className="flex justify-center items-center min-h-screen bg-white">
        <div className="text-center" role="status" aria-live="polite">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Loading your orders...</p>
        </div>
      </main>
    );

  if (error)
    return (
      <main className="flex justify-center items-center min-h-screen bg-white p-4">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </main>
    );

  return (
    <>
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
                className="inline-block px-10 py-3 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-700"
              >
                Start Shopping
              </button>
            </section>
          ) : (
            <section className="space-y-10" aria-label="List of your orders">
              {orders.map((order) => {
                const statusDetails = getStatusDetails(order.status);
                return (
                  <article
                    key={order.id}
                    className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow duration-300"
                    tabIndex={0}
                    aria-describedby={`order-desc-${order.id}`}
                  >
                    <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                      <div className="flex items-center mb-3 lg:mb-0">
                        <h3 className="text-2xl font-bold text-gray-900 mr-5">
                          Order #{order.order_number || order.id}
                        </h3>
                        <span
                          className={`flex items-center gap-2 rounded-full px-4 py-1 text-sm font-semibold ${statusDetails.color} ${statusDetails.bgColor}`}
                          aria-label={`Order status: ${order.status}`}
                        >
                          {statusDetails.icon}
                          <span className="capitalize">{order.status}</span>
                        </span>
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleOrderDetails(order)}
                          className="px-6 py-2 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-700"
                        >
                          View Details
                        </button>
                        {order.status?.toLowerCase() === "pending" && (
                          <button
                            onClick={() => cancelOrder(order.id)}
                            disabled={cancellingOrderId === order.id}
                            className="px-6 py-2 bg-red-600 text-white rounded-2xl font-semibold hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            {cancellingOrderId === order.id
                              ? "Cancelling..."
                              : "Cancel Order"}
                          </button>
                        )}
                      </div>
                    </header>

                    <section
                      id={`order-desc-${order.id}`}
                      className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-600"
                    >
                      <div>
                        <span className="font-semibold text-gray-700 block mb-1">
                          Order Date
                        </span>
                        <time>{formatDate(order.created_at)}</time>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700 block mb-1">
                          Total Amount
                        </span>
                        <p className="text-green-700 font-extrabold text-lg">{formatCurrency(order.total_amount)}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700 block mb-1">
                          Items
                        </span>
                        <p>{order.items?.length || 0} item(s)</p>
                      </div>
                    </section>

                    <section className="mt-8 flex flex-wrap gap-4" aria-label="Order products preview">
                      {order.items?.slice(0, 3).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center bg-gray-50 rounded-xl p-3 shadow-sm"
                          title={item.product?.title || ""}
                        >
                          {item.product?.front_imges && (
                            <img
                              src={`${API_BASE_URL}/${item.product.front_imges}`}
                              alt={item.product.title}
                              className="w-14 h-14 object-cover rounded-lg mr-4"
                              loading="lazy"
                            />
                          )}
                          <div className="text-gray-800 font-semibold text-sm max-w-[180px] truncate">
                            {item.product?.title}
                          </div>
                          <div className="ml-auto text-sm text-gray-600">
                            Qty: {item.quantity}
                          </div>
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <div className="flex items-center justify-center bg-gray-100 rounded-xl p-3 w-14 h-14 text-gray-600 font-semibold select-none">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </section>
                  </article>
                );
              })}
            </section>
          )}
        </section>
      </main>

      {/* Modal */}
      {showModal && selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black bg-opacity-30"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          tabIndex={-1}
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl p-8">
            <header className="sticky top-0 bg-white border-b border-gray-200 pb-4 mb-6 flex justify-between items-center rounded-t-3xl">
              <h2
                className="text-3xl font-bold text-gray-900"
                id="modal-title"
              >
                Order Details #{selectedOrder.order_number || selectedOrder.id}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
                className="text-gray-500 hover:text-gray-700 text-3xl leading-none focus:outline-none"
              >
                <X size={32} />
              </button>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-10 text-gray-700 mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  Order Information
                </h3>
                <p className="mb-2">
                  <span className="font-semibold text-gray-800">Order Date:</span>{" "}
                  {formatDate(selectedOrder.created_at)}
                </p>
                <p className="mb-2 flex items-center gap-2">
                  <span className="font-semibold text-gray-800">Status:</span>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusDetails(selectedOrder.status).color} ${getStatusDetails(selectedOrder.status).bgColor}`}
                  >
                    {selectedOrder.status}
                  </span>
                </p>
                <p className="mb-2">
                  <span className="font-semibold text-gray-800">Total Amount:</span>{" "}
                  <span className="text-green-700 font-extrabold text-lg">
                    {formatCurrency(selectedOrder.total_amount)}
                  </span>
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  Shipping Address
                </h3>
                {selectedOrder.shipping_address ? (
                  <address className="not-italic space-y-1 text-gray-600 text-sm">
                    <p className="font-semibold">{selectedOrder.shipping_address.full_name}</p>
                    <p>{selectedOrder.shipping_address.address_line_1}</p>
                    {selectedOrder.shipping_address.address_line_2 && (
                      <p>{selectedOrder.shipping_address.address_line_2}</p>
                    )}
                    <p>
                      {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state}{" "}
                      {selectedOrder.shipping_address.postal_code}
                    </p>
                    <p>{selectedOrder.shipping_address.country}</p>
                  </address>
                ) : (
                  <p className="text-gray-500">No shipping address available</p>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-6 text-gray-900">Order Items</h3>
              <ul className="space-y-6">
                {selectedOrder.items?.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center border-b border-gray-100 pb-5 last:border-b-0"
                  >
                    {item.product?.front_imges && (
                      <img
                        src={`${API_BASE_URL}/${item.product.front_imges}`}
                        alt={item.product.title}
                        className="w-24 h-24 object-cover rounded-xl mr-6 border border-gray-200"
                        loading="lazy"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{item.product?.title}</h4>
                      <p className="text-gray-600 text-sm line-clamp-2 max-w-lg">
                        {item.product?.description || "No description available"}
                      </p>
                      <div className="flex items-center mt-2 text-yellow-400">
                        {[...Array(4)].map((_, i) => (
                          <Star key={i} size={20} fill="currentColor" />
                        ))}
                        <StarHalf size={20} fill="currentColor" />
                        <span className="ml-2 text-gray-500 text-sm">(4.5/5)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">Qty: {item.quantity}</p>
                      <p className="text-lg font-extrabold text-gray-900">{formatCurrency(item.price)}</p>
                      <p className="text-sm text-gray-500">
                        Total: {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}
    </>
  );
};

export default Order;

