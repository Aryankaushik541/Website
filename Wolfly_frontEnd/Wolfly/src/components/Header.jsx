import React from 'react'
import { NavLink } from 'react-router-dom'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useContext,useEffect } from 'react';
import {Appstate} from '../App'
import { getToken,deleteToken } from '../services/LocalStorageToken';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCartItemQuery } from "../services/userAuthApi";
import logo from '../Images/logo1.png';

const Header = (props) => {
  const useAppState = useContext(Appstate);
  const [storeToken,setToken]=useState('')
  const { access_token } = getToken();
  const navigate = useNavigate();

  const { data: cartData, error } = useGetCartItemQuery(access_token);
 
  useEffect(()=>{
    if(cartData){
      useAppState.setAddCartLength(cartData.length);
    }

    setToken(access_token);
    
  },[props.auth,cartData])


 
  
  const handleLogout = () => {
    deleteToken();
    setToken(''); // Clear the state
    navigate("/")
  };
  
  return (
    <>
   
      <header className='flex flex-col min-w-56 md:sticky md:-top-1 z-10 '>
      
        <section className='p-5 flex md:justify-between md:flex-row flex-col bg-black'>
        <div className="flex items-center">
          <img src={logo} alt="Wolfly Logo" className="w-44 h-14 mr-2 rounded-md" />
        </div>
          <nav className='md:my-0 my-2'>
              <ul className='flex gap-x-5 gap-y-5 items-center text-xl justify-between flex-wrap'>
              <li>
                <NavLink
                  to="/"
                  style={({ isActive }) => ({
                    fontWeight: isActive ? 'bold' : '',
                  })}
                  className="group text-white hover:text-gray-200 transition-colors duration-300"
                >
                  Home
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-dark-teal group-hover:bg-gray-200"></span>
                </NavLink>
              </li>

                
              <li>
                <NavLink
                  to="/about"
                  style={({ isActive }) => ({
                    fontWeight: isActive ? 'bold' : '',
                  })}
                  className="group text-white hover:text-gray-200 transition-colors duration-300"
                >
                  About
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-dark-teal group-hover:bg-gray-200"></span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/product"
                  style={({ isActive }) => ({
                    fontWeight: isActive ? 'bold' : '',
                  })}
                  className="group text-white hover:text-gray-200 transition-colors duration-300"
                >
                  Product
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-dark-teal group-hover:bg-gray-200"></span>
                </NavLink>
              </li>

                
              <li>
                <NavLink
                  to="/contact"
                  style={({ isActive }) => ({
                    fontWeight: isActive ? 'bold' : '',
                  })}
                  className="group text-white hover:text-gray-200 transition-colors duration-300"
                >
                  Contact
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-dark-teal group-hover:bg-gray-200"></span>
                </NavLink>
              </li>

               { 
               storeToken?
               <li>
               <button
                 onClick={handleLogout}
                 className="group text-white hover:text-gray-200 transition-colors duration-300"
               >
                 Logout
                 <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-dark-teal group-hover:bg-gray-200"></span>
               </button>
             </li>
             
                :
                <li>
                  <NavLink
                    to="/login"
                    style={({ isActive }) => ({
                      fontWeight: isActive ? 'bold' : '',
                    })}
                    className="group text-white hover:text-gray-200 transition-colors duration-300"
                  >
                    Login
                    <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-dark-teal group-hover:bg-gray-200"></span>
                  </NavLink>
                </li>

                }
                <li>
                  <NavLink
                    to={access_token ? `/Checkout` : `/login`}
                    className="group flex bg-white text-black justify-center px-5 py-1 text-sm rounded-md transition-colors duration-300"
                  >
                    <ShoppingCartIcon />
                    <p className="pl-2 text-lg">{access_token ? useAppState.addCartLength : ''}</p>
                    <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-dark-teal group-hover:bg-gray-200"></span>
                  </NavLink>
                </li>

              </ul>
          </nav>
        </section>
      </header>
    </>
  )
}

export default Header