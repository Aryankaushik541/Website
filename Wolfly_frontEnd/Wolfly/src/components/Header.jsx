import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Appstate } from '../App';
import { getToken, deleteToken } from '../services/LocalStorageToken';
import { useGetCartItemQuery } from "../services/userAuthApi";
import logo from '../Images/logo1.png';

const Header = (props) => {
  const useAppState = useContext(Appstate);
  const [storeToken, setToken] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const { access_token } = getToken();
  const navigate = useNavigate();

  const { data: cartData, error } = useGetCartItemQuery(access_token);

  useEffect(() => {
    if (cartData) {
      useAppState.setAddCartLength(cartData.length);
    }
    setToken(access_token);
    
    // Check if user is admin - you can modify this logic based on your authentication system
    checkAdminStatus();
  }, [props.auth, cartData, access_token]);

  const checkAdminStatus = () => {
    if (access_token) {
      try {
        // Decode JWT token to check user role
        const tokenPayload = JSON.parse(atob(access_token.split('.')[1]));
        setIsAdmin(tokenPayload.role === 'admin' || tokenPayload.is_admin === true);
      } catch (error) {
        console.error('Error decoding token:', error);
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  };

  const handleLogout = () => {
    deleteToken();
    setToken('');
    setIsAdmin(false);
    navigate("/");
  };

  return (
    <>
      <header className='flex flex-col min-w-56 md:sticky md:-top-1 z-10'>
        <section className='p-5 flex md:justify-between md:flex-row flex-col bg-black'>
          <div className="flex items-center">
            <img src={logo} alt="Wolfly Logo" className="w-44 h-14 mr-2 rounded-md" />
          </div>
          <nav className='md:my-0 my-2'>
            <ul className='flex gap-x-5 gap-y-5 items-center text-xl justify-between flex-wrap'>
              <li>
                <NavLink to="/" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : '' })}
                  className="group text-white hover:text-gray-200 transition-colors duration-300">
                  Home
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-gray-200"></span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/about" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : '' })}
                  className="group text-white hover:text-gray-200 transition-colors duration-300">
                  About
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-gray-200"></span>
                </NavLink>
              </li>

              {/* Dropdown Menu for Product */}
              <li className="relative group">
                <button className="text-white hover:text-gray-200 transition-colors duration-300">
                  Product
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-gray-200"></span>
                </button>
                <ul className="absolute left-0 mt-2 w-44 bg-white text-black shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform -translate-y-2 transition-all duration-300 z-20 rounded-md overflow-hidden">
                  {storeToken && (
                    <li>
                      <NavLink
                        to="/order"
                        className="block px-4 py-2 bg-black text-white hover:bg-white hover:text-black transition-all duration-300"
                      >
                        Order
                      </NavLink>
                    </li>
                  )}
                </ul>
              </li>

              <li>
                <NavLink to="/contact" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : '' })}
                  className="group text-white hover:text-gray-200 transition-colors duration-300">
                  Contact
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-gray-200"></span>
                </NavLink>
              </li>

              {/* Admin Panel - Only visible for admin users */}
              {isAdmin && (
                <li>
                  <NavLink to="/admin" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : '' })}
                    className="group flex items-center text-yellow-400 hover:text-yellow-300 transition-colors duration-300">
                    <AdminPanelSettingsIcon className="mr-1" fontSize="small" />
                    Admin
                    <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-yellow-400"></span>
                  </NavLink>
                </li>
              )}
                
              {storeToken ? (
                <li>
                  <button onClick={handleLogout}
                    className="group text-white hover:text-gray-200 transition-colors duration-300">
                    Logout
                    <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-gray-200"></span>
                  </button>
                </li>
              ) : (
                <li>
                  <NavLink to="/login" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : '' })}
                    className="group text-white hover:text-gray-200 transition-colors duration-300">
                    Login
                    <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-gray-200"></span>
                  </NavLink>
                </li>
              )}

              <li>
                <NavLink to={access_token ? `/Checkout` : `/login`}
                  className="group flex bg-white text-black justify-center px-5 py-1 text-sm rounded-md transition-colors duration-300">
                  <ShoppingCartIcon />
                  <p className="pl-2 text-lg">{access_token ? useAppState.addCartLength : ''}</p>
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-gray-200"></span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </section>
      </header>
    </>
  );
};

export default Header;