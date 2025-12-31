import React, { useState, useEffect, useCallback } from "react";
import { Package, Truck,  CheckCircle, XCircle, Clock, Download, Filter,Search,RefreshCw,AlertCircle,ShoppingBag,Eye,Calendar,IndianRupee,MapPin,User,Mail,Phone,Home } from "lucide-react";

const Order = () => {
  // State management
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Mock authentication - replace with actual auth
  const access_token = localStorage.getItem('access_token') || "your_jwt_token_here";
  const API_BASE_URL = 'http://127.0.0.1:8000';

  // Status configuration
  const statusConfig = {
    pending: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
    processing: { icon: Package, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
    shipped: { icon: Truck, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
    delivered: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
    cancelled: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" }
  };

  // Toast utility
  const showToast = useCallback((message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  }, []);

  // Fetch orders from Django backend
  const fetchOrders = useCallback(async (showRefreshLoader = false) => {
    if (showRefreshLoader) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/orders/showorder/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          const errorData = await response.json();
          setOrders([]);
          setErrorMessage(errorData.error || "You do not have any orders.");
        } else if (response.status === 401) {
          setErrorMessage("Please log in to view your orders.");
          showToast("Authentication required. Please log in.", "error");
        } else {
          throw new Error(`HTTP ${response.status}: Failed to fetch orders`);
        }
      } else {
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
        setErrorMessage("");
        if (showRefreshLoader) {
          showToast("Orders refreshed successfully!", "success");
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      const errorMsg = error.message || "Network error. Please check your connection.";
      setErrorMessage(errorMsg);
      showToast("Failed to load orders", "error");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [access_token, showToast]);

  // Cancel order
 const handleCancelOrder = async (orderId) => {
  const confirmMessage = "Are you sure you want to cancel this order?\n\nThis action cannot be undone and any payment will be refunded within 5-7 business days.";
  
  if (!window.confirm(confirmMessage)) return;
  
  setCancellingOrderId(orderId);
  
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel-order/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (response.ok) {
      showToast("Order cancelled successfully!", "success");
      fetchOrders(true);
    } else {
      let errorMessage = 'Failed to cancel order';
      
      switch (response.status) {
        case 400:
          errorMessage = data.error || data.message || 'Order cannot be cancelled at this time';
          break;
        case 404:
          errorMessage = 'Order not found';
          break;
        case 401:
          errorMessage = 'You are not authorized to cancel this order';
          break;
        case 403:
          errorMessage = 'Access forbidden. You do not have permission to cancel this order';
          break;
        case 409:
          errorMessage = 'Order cannot be cancelled due to its current status';
          break;
        case 500:
          errorMessage = 'Server error occurred. Please try again later';
          break;
        default:
          errorMessage = data.error || data.message || 'An unexpected error occurred';
      }
      
      showToast(errorMessage, "error");
    }
  } catch (error) {
    console.error('Error cancelling order:', error);
    
    // More specific error handling
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      showToast('Network connection failed. Please check your internet connection.', "error");
    } else if (error.name === 'AbortError') {
      showToast('Request was cancelled. Please try again.', "error");
    } else {
      showToast('Network error occurred. Please check your connection and try again.', "error");
    }
  } finally {
    setCancellingOrderId(null);
  }
};

// Alternative version with timeout and abort controller
const handleCancelOrderWithTimeout = async (orderId) => {
  const confirmMessage = "Are you sure you want to cancel this order?\n\nThis action cannot be undone and any payment will be refunded within 5-7 business days.";
  
  if (!window.confirm(confirmMessage)) return;
  
  setCancellingOrderId(orderId);
  
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
  
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel-order/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const data = await response.json();

    if (response.ok) {
      showToast("Order cancelled successfully!", "success");
      fetchOrders(true);
    } else {
      let errorMessage = 'Failed to cancel order';
      
      switch (response.status) {
        case 400:
          errorMessage = data.error || data.message || 'Order cannot be cancelled at this time';
          break;
        case 404:
          errorMessage = 'Order not found';
          break;
        case 401:
          errorMessage = 'You are not authorized to cancel this order';
          break;
        case 403:
          errorMessage = 'Access forbidden. You do not have permission to cancel this order';
          break;
        case 409:
          errorMessage = 'Order cannot be cancelled due to its current status';
          break;
        case 500:
          errorMessage = 'Server error occurred. Please try again later';
          break;
        default:
          errorMessage = data.error || data.message || 'An unexpected error occurred';
      }
      
      showToast(errorMessage, "error");
    }
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Error cancelling order:', error);
    
    if (error.name === 'AbortError') {
      showToast('Request timed out. Please try again.', "error");
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      showToast('Network connection failed. Please check your internet connection.', "error");
    } else {
      showToast('Network error occurred. Please check your connection and try again.', "error");
    }
  } finally {
    setCancellingOrderId(null);
  }
};

  // Download invoice
  const downloadInvoice = async (orderId) => {
    try {
      const response = await fetch(`${API_BASE}/orders/showorder/generate-invoice/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
        }
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/pdf')) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `invoice-${orderId}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          showToast("Invoice downloaded successfully!", "success");
        } else {
          showToast('Invoice format not supported', "error");
        }
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Failed to download invoice', "error");
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      showToast('Error downloading invoice', "error");
    }
  };

  // Filter and sort orders
  const applyFiltersAndSort = useCallback(() => {
    let filtered = [...orders];

    // Apply status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(order => 
        (order.status || "pending").toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.id?.toString().includes(searchQuery) ||
        order.products?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        case "oldest":
          return new Date(a.created_at || 0) - new Date(b.created_at || 0);
        case "amount_high":
          return (b.final_price * b.quantity) - (a.final_price * a.quantity);
        case "amount_low":
          return (a.final_price * a.quantity) - (b.final_price * b.quantity);
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchQuery, sortBy]);

  // Utility functions
  const getStatusIcon = (status) => {
    const statusKey = (status || 'pending').toLowerCase();
    const config = statusConfig[statusKey] || statusConfig.pending;
    const IconComponent = config.icon;
    return <IconComponent className={`w-5 h-5 ${config.color}`} />;
  };

  const getStatusBadge = (status) => {
    const statusKey = (status || 'pending').toLowerCase();
    const config = statusConfig[statusKey] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color} ${config.border} border`}>
        {getStatusIcon(status)}
        {status || 'Pending'}
      </span>
    );
  };

  const canCancelOrder = (order) => {
    const status = (order.status || 'pending').toLowerCase();
    return !['delivered', 'cancelled', 'shipped'].includes(status);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Effects
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          </div>
          <p className="text-gray-600">Track and manage your order history</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by Order ID or Product Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount_high">Amount: High to Low</option>
                <option value="amount_low">Amount: Low to High</option>
              </select>

              {/* Refresh Button */}
              <button
                onClick={() => fetchOrders(true)}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Placed on {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(order.status)}
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={order.products?.front_imges ? `${API_BASE_URL}${order.products.front_imges}` : '/api/placeholder/80/80'}
                      className="w-20 h-20 rounded-lg object-cover border"
                      alt={order.products?.title || 'Product'}
                      onError={(e) => {
                        e.target.src = '/api/placeholder/80/80';
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {order.products?.title || 'Product Name'}
                      </h4>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                        <span>Quantity: {order.quantity}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="font-semibold text-gray-900">
                          Total: {formatPrice(order.final_price * order.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => downloadInvoice(order.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Invoice
                    </button>

                    {canCancelOrder(order) && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingOrderId === order.id}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {cancellingOrderId === order.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            Cancel Order
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || statusFilter !== "All" 
                ? `No ${statusFilter.toLowerCase()} orders found` 
                : "No orders yet"
              }
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || statusFilter !== "All"
                ? "Try adjusting your search or filter criteria"
                : "Start shopping to see your orders here"
              }
            </p>
            {(!searchQuery && statusFilter === "All") && (
              <button
                onClick={() => window.location.href = "/"}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Shopping
              </button>
            )}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Order Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Order Information</h4>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Order ID</label>
                      <p className="text-gray-900">#{selectedOrder.id}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <div className="mt-1">
                        {getStatusBadge(selectedOrder.status)}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Order Date</label>
                      <div className="flex items-center gap-2 text-gray-900">
                        <Calendar className="w-4 h-4" />
                        {formatDate(selectedOrder.created_at)}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Amount</label>
                      <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
                        <IndianRupee className="w-5 h-5" />
                        {formatPrice(selectedOrder.final_price * selectedOrder.quantity)}
                      </div>
                    </div>
                  </div>

                  {/* Customer & Address Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Delivery Information</h4>
                    
                    {selectedOrder.customer && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Customer</label>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-900">
                            <User className="w-4 h-4" />
                            {selectedOrder.customer.get_full_name || selectedOrder.customer.username}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4" />
                            {selectedOrder.customer.email}
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedOrder.address && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Delivery Address</label>
                        <div className="flex items-start gap-2 text-gray-900">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <div>
                            <p>{selectedOrder.address.address_line_1}</p>
                            {selectedOrder.address.address_line_2 && (
                              <p>{selectedOrder.address.address_line_2}</p>
                            )}
                            <p>{selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.postal_code}</p>
                            <p>{selectedOrder.address.country}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Information */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-gray-900 mb-4">Product Details</h4>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={selectedOrder.products?.front_imges ? `${API_BASE_URL}${selectedOrder.products.front_imges}` : '/api/placeholder/80/80'}
                      className="w-16 h-16 rounded-lg object-cover border"
                      alt={selectedOrder.products?.title || 'Product'}
                      onError={(e) => {
                        e.target.src = '/api/placeholder/80/80';
                      }}
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{selectedOrder.products?.title}</h5>
                      <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                        <div>
                          <span className="text-gray-500">Quantity:</span>
                          <span className="ml-2 font-medium">{selectedOrder.quantity}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Unit Price:</span>
                          <span className="ml-2 font-medium">{formatPrice(selectedOrder.final_price)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => downloadInvoice(selectedOrder.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Invoice
                  </button>

                  {canCancelOrder(selectedOrder) && (
                    <button
                      onClick={() => {
                        setSelectedOrder(null);
                        handleCancelOrder(selectedOrder.id);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel Order
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast.show && (
          <div className="fixed bottom-4 right-4 z-50">
            <div className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 ${
              toast.type === 'success' ? 'border-l-4 border-green-400' :
              toast.type === 'error' ? 'border-l-4 border-red-400' :
              'border-l-4 border-blue-400'
            }`}>
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {toast.type === 'success' && <CheckCircle className="h-6 w-6 text-green-400" />}
                    {toast.type === 'error' && <XCircle className="h-6 w-6 text-red-400" />}
                    {toast.type === 'info' && <AlertCircle className="h-6 w-6 text-blue-400" />}
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">{toast.message}</p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => setToast({ show: false, message: "", type: "" })}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;