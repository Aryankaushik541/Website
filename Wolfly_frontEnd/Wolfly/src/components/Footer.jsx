import React from 'react';
import card from '../Images/cards.png';
import { NavLink } from 'react-router-dom';
import facebook_logo from '../Images/facebook_logo.png';
import instagram_logo from '../Images/instagram_logo.png';
import linked_logo from '../Images/linked_logo.png';
import github_logo from '../Images/github_logo.png';
import youtube_logo from '../Images/youtube_logo.png';
import logo from '../Images/logo1.png';

const Footer = () => {
    return (
        <>
            <footer className='bg-black text-teal-100'>
                <div className='mt-0 pt-10 pb-5 px-5'>
                    <div className='flex flex-col md:flex-row justify-between flex-wrap gap-10'>

                        {/* Logo and Description */}
                        <div className='flex flex-col max-w-sm'>
                            <span className="font-mono p-2 w-50">
                                <span className="flex items-center">
                                    <img src={logo} alt="Neverend Lifestyle Logo" className="w-40 h-16 mr-4 rounded-md" />
                                </span>
                            </span>
                            <p className='text-white mb-5 font-medium'>
                                Welcome to Neverend Lifestyle, your ultimate destination for cutting-edge gadgets!
                            </p>
                            <img src={card} alt="Payment Methods" className='w-48 my-5' />
                        </div>

                        {/* Quick Links */}
                        <div className='flex flex-col'>
                            <h4 className='text-white mb-5 font-medium'>QUICK LINKS</h4>
                            <ul className='space-y-2 text-gray-400'>
                                <li><NavLink to="/about">About Us</NavLink></li>
                                <li><NavLink to="/products">Products</NavLink></li>
                                <li><NavLink to="/contact">Contact</NavLink></li>
                                <li><NavLink to="/faq">FAQ</NavLink></li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className='flex flex-col'>
                            <h4 className='text-white mb-5 font-medium'>CONTACT</h4>
                            <p className='text-gray-400'>Email: support@neverendlifestyle.com</p>
                            <p className='text-gray-400'>Phone: +1 (800) 123-4567</p>
                            <p className='text-gray-400'>Location: NEW DELHI, INDIA</p>
                        </div>

                        {/* Social Media */}
                        <div className='flex flex-col'>
                            <h4 className='text-white mb-5 font-medium'>JOIN US</h4>
                            <div className='flex space-x-4'>
                                <NavLink to="https://www.facebook.com/" target='_blank'><img src={facebook_logo} alt="Facebook" className='w-7' /></NavLink>
                                <NavLink to="https://www.instagram.com/" target='_blank'><img src={instagram_logo} alt="Instagram" className='w-7' /></NavLink>
                                <NavLink to="https://in.linkedin.com/" target='_blank'><img src={linked_logo} alt="LinkedIn" className='w-7' /></NavLink>
                                <NavLink to="https://github.com/" target='_blank'><img src={github_logo} alt="GitHub" className='w-7' /></NavLink>
                                <NavLink to="https://www.youtube.com/" target='_blank'><img src={youtube_logo} alt="YouTube" className='w-7' /></NavLink>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className='border-t-2 border-gray-700'>
                    <div className='text-white py-2 text-center text-xl font-thin text-gray-500'>
                        <p>© 2025 Neverend Lifestyle, All Rights Reserved</p>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
