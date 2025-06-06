
import Header from "./components/Header";
import About from "./components/About";
import Home from "./components/Home";
import AddToCart from "./components/AddToCart";
import Contact from "./components/Contact";
import ProductContent from "./components/ProductContent";
import PageNotFound from "./PageNotFound";
import { createContext,useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUpForm";
import Forgetpassword from "./components/Forgetpassword";
import ResetPassword from "./components/ResetPassword";
import { useSelector } from 'react-redux'
import ProductDetails from "./components/ProductDetails";
import Checkout from "./components/Checkout";
import Address from "./components/Address";
import Order from './components/Order';


const Appstate = createContext();
const App = () => {
  const [data, setData] = useState([]);
  const [addCart,setAddCart] = useState({});
  const [addCartLength,setAddCartLength] = useState(0);
  const auth_token= useSelector((state) => state.auth.access_token)
 
  return (
    <>
      <Appstate.Provider value={{data,setData,AddToCart,addCart,setAddCart,addCartLength,setAddCartLength}}>
        <Header auth={auth_token} />
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/about" element={<About />} />
            <Route path="/product" element={<ProductContent />} />
            <Route path="/AddToCart" element={<AddToCart />} />
            <Route path="/Order" element={<Order />} />
           
            {/* <Route path="/Siderbar" element={<Siderbar />} /> */}
            <Route path="/Address" element={<Address />} />
            <Route path="/Checkout" element={<Checkout />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/Signup" element={<SignUp />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/productdetails/:slug/" element={<ProductDetails/>} />
            <Route path="/forgetpassword" element={<Forgetpassword/>} />
            <Route path="/resetPassword/:id/:token" element={<ResetPassword/>} />
            <Route path="*" element={<PageNotFound/>}/>
            
          </Routes>
        </Appstate.Provider>
    </>
  )
}



export default App
export {Appstate}
