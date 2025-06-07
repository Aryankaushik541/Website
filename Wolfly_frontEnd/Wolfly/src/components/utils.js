// src/components/utils.js

export const formatCurrency = (amount) => {
  if (!amount) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return "-";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-IN", options);
};

export const getStatusDetails = (status) => {
  const lower = status?.toLowerCase() || "";
  switch (lower) {
    case "delivered":
      return {
        color: "text-green-800",
        bgColor: "bg-green-100",
        icon: "✅",
      };
    case "pending":
      return {
        color: "text-yellow-800",
        bgColor: "bg-yellow-100",
        icon: "🕒",
      };
    case "cancelled":
      return {
        color: "text-red-800",
        bgColor: "bg-red-100",
        icon: "❌",
      };
    case "shipped":
      return {
        color: "text-blue-800",
        bgColor: "bg-blue-100",
        icon: "🚚",
      };
    default:
      return {
        color: "text-gray-800",
        bgColor: "bg-gray-100",
        icon: "📦",
      };
  }
};
