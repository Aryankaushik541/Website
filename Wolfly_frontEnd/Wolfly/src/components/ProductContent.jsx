import Product from './Product'
import Extraproduct from "./Extraproduct"
import Policy from "./Policy"
import Footer from "./Footer"

const ProductContent = () => {
  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-white text-white transition-all duration-300">
        <Extraproduct />
        <Policy />
        <Product/>
        <Footer />
        </div>
    </>
  )
}

export default ProductContent
