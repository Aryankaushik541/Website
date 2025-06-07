import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Search, Package, ShoppingCart, Users, DollarSign, RefreshCw } from 'lucide-react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeCircles } from "react-loader-spinner";

const Admin = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get token from localStorage (adjust based on your token storage method)
  const getAuthToken = () => {
    return localStorage.getItem('access_token') || '';
  };

  const [productForm, setProductForm] = useState({
    title: '',
    brand: '',
    category: '',
    actual_price: '',
    discount_price: '',
    stock: '',
    description: '',
    front_image: null,
    back_image: null,
    status: 'active'
  });

  // API Base URL
  const API_BASE = 'http://127.0.0.1:8000/';

  // Fetch Products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/products/`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/orders/showorder`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Brands
 const fetchBrands = async () => {
    try {
      const { access_token } = getToken(); // Make sure this returns the token object
      const response = await fetch(`${API_BASE}/api/products/brands/`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBrands(data);
      } else {
        console.error("Failed to fetch brands. Status:", response.status);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };


  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/products/category/`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchBrands();
    fetchCategories();
  }, []);

  // Stats calculation
  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
    activeProducts: products.filter(p => p.stock > 0).length
  };

  const handleAddProduct = () => {
    setModalType('add-product');
    setProductForm({
      title: '',
      brand: '',
      category: '',
      actual_price: '',
      discount_price: '',
      stock: '',
      description: '',
      front_image: null,
      back_image: null,
      status: 'active'
    });
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setModalType('edit-product');
    setSelectedItem(product);
    setProductForm({
      title: product.title || '',
      brand: product.brand?.id || '',
      category: product.category?.id || '',
      actual_price: product.actual_price?.toString() || '',
      discount_price: product.discount_price?.toString() || '',
      stock: product.stock?.toString() || '',
      description: product.description || '',
      front_image: null,
      back_image: null,
      status: product.status || 'active'
    });
    setShowModal(true);
  };

  const handleViewOrder = (order) => {
    setModalType('showorder');
    setSelectedItem(order);
    setShowModal(true);
  };

  const handleSubmitProduct = async () => {
    try {
      const formData = new FormData();
      formData.append('title', productForm.title);
      formData.append('brand', productForm.brand);
      formData.append('category', productForm.category);
      formData.append('actual_price', productForm.actual_price);
      formData.append('discount_price', productForm.discount_price);
      formData.append('stock', productForm.stock);
      formData.append('description', productForm.description);
      
      if (productForm.front_image) {
        formData.append('front_images', productForm.front_image);
      }
      if (productForm.back_image) {
        formData.append('back_images', productForm.back_image);
      }

      const url = modalType === 'add-product' 
        ? `${API_BASE}/products/create/`
        : `${API_BASE}/products/${selectedItem.id}/update/`;
      
      const method = modalType === 'add-product' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: formData
      });

      if (response.ok) {
        toast.success(`Product ${modalType === 'add-product' ? 'added' : 'updated'} successfully!`);
        setShowModal(false);
        fetchProducts(); // Refresh products list
      } else {
        const errorData = await response.json();
        toast.error(`Failed to ${modalType === 'add-product' ? 'add' : 'update'} product: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error(`Error ${modalType === 'add-product' ? 'adding' : 'updating'} product`);
      console.error('Error saving product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`${API_BASE}/products/${productId}/delete/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          toast.success('Product deleted successfully!');
          fetchProducts(); // Refresh products list
        } else {
          toast.error('Failed to delete product');
        }
      } catch (error) {
        toast.error('Error deleting product');
        console.error('Error deleting product:', error);
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(order =>
    order.id?.toString().includes(searchTerm) ||
    order.user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && (products.length === 0 || orders.length === 0)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeCircles visible={true} height="100" width="100" color="#000" ariaLabel="three-circles-loading" />
        <span className="ml-4">Loading Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="colored" />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your products and orders</p>
          </div>
          <button
            onClick={() => {
              fetchProducts();
              fetchOrders();
            }}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Stock Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeProducts}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'products'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Products Management
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'orders'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Orders Management
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Search and Actions */}
            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {activeTab === 'products' && (
                <button
                  onClick={handleAddProduct}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              )}
            </div>

            {/* Products Table */}
            {activeTab === 'products' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Image</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Product</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Brand</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Price</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Stock</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <img
                            src={`${API_BASE}${product.front_imges}`}
                            alt={product.title}
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                              e.target.src = '/api/placeholder/48/48';
                            }}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium">{product.title}</div>
                          <div className="text-sm text-gray-500">{product.slug}</div>
                        </td>
                        <td className="py-3 px-4">{product.brand?.name || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <span className="line-through text-gray-500">₹{product.actual_price}</span>
                            <br />
                            <span className="font-medium">₹{product.discount_price}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            product.stock > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.stock} units
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit Product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredProducts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No products found
                  </div>
                )}
              </div>
            )}

            {/* Orders Table */}
            {activeTab === 'orders' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Order ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Items</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">#{order.id}</td>
                        <td className="py-3 px-4">
                          <div className="font-medium">{order.user?.username || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{order.user?.email || 'N/A'}</div>
                        </td>
                        <td className="py-3 px-4">{order.items?.length || 0} items</td>
                        <td className="py-3 px-4">₹{order.total?.toLocaleString('en-IN') || '0'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status || 'pending'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Order Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredOrders.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No orders found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {modalType === 'add-product' ? 'Add New Product' :
                 modalType === 'edit-product' ? 'Edit Product' :
                 'Order Details'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            {(modalType === 'add-product' || modalType === 'edit-product') && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Product Title"
                    value={productForm.title}
                    onChange={(e) => setProductForm({...productForm, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={productForm.brand}
                    onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Brand</option>
                    {brands.map(brand => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="number"
                    placeholder="Actual Price"
                    value={productForm.actual_price}
                    onChange={(e) => setProductForm({...productForm, actual_price: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Discount Price"
                    value={productForm.discount_price}
                    onChange={(e) => setProductForm({...productForm, discount_price: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Stock Quantity"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <textarea
                  placeholder="Product Description"
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Front Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProductForm({...productForm, front_image: e.target.files[0]})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Back Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProductForm({...productForm, back_image: e.target.files[0]})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSubmitProduct}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : (modalType === 'add-product' ? 'Add Product' : 'Update Product')}
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {modalType === 'view-order' && selectedItem && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Order Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <p><strong>Order ID:</strong> #{selectedItem.id}</p>
                    <p><strong>Status:</strong> {selectedItem.status || 'pending'}</p>
                    <p><strong>Date:</strong> {selectedItem.created_at ? new Date(selectedItem.created_at).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Total:</strong> ₹{selectedItem.total?.toLocaleString('en-IN') || '0'}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Customer Information</h4>
                  <p><strong>Name:</strong> {selectedItem.user?.username || 'N/A'}</p>
                  <p><strong>Email:</strong> {selectedItem.user?.email || 'N/A'}</p>
                </div>

                {selectedItem.items && selectedItem.items.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Order Items</h4>
                    {selectedItem.items.map((item, index) => (
                      <div key={index} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                        <div>
                          <span className="font-medium">{item.product?.title || 'N/A'}</span>
                          <span className="text-gray-500 ml-2">(x{item.quantity || 1})</span>
                        </div>
                        <span>₹{((item.product?.discount_price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;