import { NavLink, useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { ThreeCircles } from 'react-loader-spinner';
import Alert from '@mui/material/Alert';
import { useLoginUserMutation } from '../services/userAuthApi';
import { getToken, storeToken } from '../services/LocalStorageToken';
import { useDispatch } from 'react-redux'
import { setUserToken } from '../features/user/userSlice';
import { motion } from "framer-motion";


const Login = () => {

    // navigate
    const navigate = useNavigate();

    const [loginUser,{isLoading}]=useLoginUserMutation()
  
    // store form info
    const [form, setForm] = useState({
        email: "",
        password: "",

    });
    // show message
    const [showMsg, setMsg] = useState({
        status: false,
        severity: '',
        msg: ''

    })

    const dispatch = useDispatch()
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (form.email && form.password) {
            if (!/\S+\.\S+/.test(form.email)) {
                setMsg({ status: true, severity: 'warning', msg: 'Email is invalid' })
            } else if (form.password.length < 8) {
                setMsg({ status: true, severity: 'warning', msg: 'Password must be 8 character' })
            } else {
                const response = await loginUser(form);
                console.log(response);
                if (response.error) {
                    const error_msg = response.error.data.errors.non_field_errors[0];
                    setMsg({ status: true, severity: 'error', msg: error_msg });
                } else {
                    const success_msg = response.data.msg;
                    setMsg({ status: true, severity: 'success', msg: success_msg });
                    
                    setTimeout(() => {
                        storeToken(response.data.token);
                        const { access_token } = getToken();
                        dispatch(setUserToken({ access_token: access_token }));
    
                        // ✅ Redirect based on user type
                        const isAdmin = response.data.is_admin;  
                        navigate(isAdmin ? '/Admin' : '/');
                    }, 2000);
                }
            }
        } else {
            setMsg({ status: true, severity: 'warning', msg: 'All Fields Required' });
        }
    };
    
    const {access_token}=getToken()
    useEffect(()=>{
        dispatch(setUserToken({access_token:access_token}))
    },[access_token,dispatch])
    return (
        <>
            <div className='flex items-center justify-center mt-32 w-full bg-[url("Wolfly_frontEnd\Wolfly\src\Images\logo.png")] bg-cover bg-center'>
            <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="backdrop-blur-xl bg-opacity-10 bg-white p-10 rounded-lg shadow-2xl max-w-lg w-full border border-gray-600"
                    >
                        <h2 className="text-4xl font-bold text-center text-white mb-8">LOG IN </h2>
                <form className='flex flex-col gap-6 w-full' onSubmit={handleSubmit} id='LoginForm'>
                    <div className="relative w-full min-w-[200px] h-10">
                        <input
                            className="peer  w-full h-full bg-transparent  font-sans font-normal outline outline-0 focus:outline-0 transition-all placeholder-shown:border-blue-gray-200 border-2 focus:border-1 border-t-transparent focus:border-t-transparent text-lg px-3 py-2.5 rounded border-blue-gray-200 focus:border-black shadow-lg"
                            placeholder=" " type='text'
                            value={form.email}
                            onChange={(event) => {
                                setForm({ ...form, email: event.target.value })
                                setMsg({ status: false })
                            }}
                           
                            name='email'
                        /><label
                            className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.79] text-blue-gray-400 peer-focus:text-black before:border-blue-gray-200 peer-focus:before:!border-black after:border-sky-gray-200 peer-focus:after:!border-black">Email Address*

                        </label>
                    </div>


                    <div className="relative w-full min-w-[200px] h-10">
                        <input
                            className="peer  w-full h-full bg-transparent  font-sans font-normal outline outline-0 focus:outline-0 transition-all placeholder-shown:border-blue-gray-200 border-2 focus:border-1 border-t-transparent focus:border-t-transparent text-lg px-3 py-2.5 rounded border-blue-gray-200 focus:border-black shadow-lg"
                            placeholder=" " type='password'
                            value={form.password}
                            onChange={(event) => {
                                setForm({ ...form, password: event.target.value })
                                setMsg({ status: false })
                            }}
                            
                            name='password'
                        /><label
                            className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.79] text-blue-gray-400 peer-focus:text-black before:border-blue-gray-200 peer-focus:before:!border-black after:border-sky-gray-200 peer-focus:after:!border-black">Password*

                        </label>
                    </div>
                    <p>

                        <button type='submit' className="text-white w-full  bg-black   py-2 mb-5 px-6 focus:outline-none  hover:bg-gray-500 rounded text-lg">{isLoading ? <div className='flex justify-center'> <ThreeCircles
                            visible={true}
                            height="26"
                            width="25"
                            color="#fff"
                            ariaLabel="three-circles-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        /></div> : 'Login'}</button>
                        <NavLink to='/Forgetpassword' className='text-black'>
                            Forget Password?
                        </NavLink>
                    </p>
                    {
                        showMsg.status ?
                            <div className='flex justify-center'>
                                <Alert severity={showMsg.severity}>{showMsg.msg}</Alert>
                            </div>
                            :
                            <></>
                    }
                    <p>Create a New Account ? <NavLink to="/Signup" className="text-black ">Sign Up</NavLink></p>
                </form>
                </motion.div>
                
            </div>




        </>

    )
}
export default Login;  