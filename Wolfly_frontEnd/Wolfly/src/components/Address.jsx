import React, { useState } from "react";
import { useAddAddressMutation, useGetAddressQuery } from "../services/userAuthApi";
import { getToken } from "../services/LocalStorageToken";
import { ToastContainer, toast } from "react-toastify";

const AddressForm = () => {
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");

  const [lastSavedAddress, setLastSavedAddress] = useState(null);
  const [showAddresses, setShowAddresses] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [addAddress, { isLoading }] = useAddAddressMutation();
  const { access_token } = getToken();
  const { data: getAddress = [], error: add_error, refetch: add_refatch } = useGetAddressQuery(access_token);

  const fetchLocationDetails = async (pincode) => {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data[0].Status === "Success") {
        setCity(data[0].PostOffice[0].District);
        setState(data[0].PostOffice[0].State);
        setCountry("India");
      } else {
        toast.error("Invalid Pincode", { position: "top-right", autoClose: 1000, theme: "colored" });
        setZip("");
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const addressData = {
      village_or_town: street,
      city,
      state,
      pincode: Number(zip),
      phone: Number(phone),
      country,
    };

    try {
      const response = await addAddress({ addressData, access_token }).unwrap();
      toast.success(response.msg, { position: "top-right", autoClose: 1000, theme: "colored" });
      setLastSavedAddress(addressData);

      // Clear form
      setStreet("");
      setCity("");
      setState("");
      setZip("");
      setCountry("");
      setPhone("");

    } catch (err) {
      toast.error(err.message || "All fields are required", { position: "top-right", autoClose: 1000, theme: "colored" });
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={1000} hideProgressBar theme="dark" />

      {/* Toggle saved addresses */}
      <div className="mt-10">
        {getAddress.length !== 0 && (
          <button
            onClick={() => setShowAddresses(!showAddresses)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded mb-4"
          >
            {showAddresses ? "Hide Addresses" : "Choose Shipping Address"}
          </button>
        )}

        {showAddresses && (
          <div className="grid md:grid-cols-2 gap-4">
            {getAddress.map((address) => (
              <label
                key={address.id}
                className={`border rounded-lg p-4 cursor-pointer transition duration-300 shadow-sm ${selectedAddressId === address.id
                    ? "border-blue-500 ring-2 ring-blue-300 bg-blue-50"
                    : "hover:shadow-md"
                  }`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="radio"
                    name="selectedAddress"
                    value={address.id}
                    checked={selectedAddressId === address.id}
                    onChange={() => {
                      setSelectedAddressId(address.id);
                    }}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm text-gray-700 font-medium">{address.village_or_town}</p>
                    <p className="text-sm text-gray-600">{address.city}, {address.state} - {address.pincode}</p>
                    <p className="text-sm text-gray-600">{address.country}</p>
                    <p className="text-sm text-gray-600">📞 {address.phone}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Address Form */}
      <div className="p-6">
        <div className="mb-6">
          <label className="block text-black font-semibold mb-4 text-2xl">Shipping Address:</label>

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Street Address"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />

              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                readOnly
              />

              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                readOnly
              />

              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Zip Code"
                value={zip}
                onChange={(e) => {
                  setZip(e.target.value);
                  if (e.target.value.length === 6) {
                    fetchLocationDetails(e.target.value);
                  }
                }}
              />

              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                readOnly
              />

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
              >
                {isLoading ? "Saving..." : "Save Address"}
              </button>
            </div>
          </form>
        </div>

        {/* Display Last Saved Address */}
        {lastSavedAddress && (
          <div className="mt-8 border border-green-500 rounded-lg p-5 bg-green-100 text-black shadow-md">
            <h3 className="text-lg font-bold text-green-900 mb-2">Last Saved Address:</h3>
            <p><strong>Street:</strong> {lastSavedAddress.village_or_town}</p>
            <p><strong>City:</strong> {lastSavedAddress.city}</p>
            <p><strong>State:</strong> {lastSavedAddress.state}</p>
            <p><strong>Pincode:</strong> {lastSavedAddress.pincode}</p>
            <p><strong>Country:</strong> {lastSavedAddress.country}</p>
            <p><strong>Phone:</strong> {lastSavedAddress.phone}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default AddressForm;
