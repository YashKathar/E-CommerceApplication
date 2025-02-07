import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Cart from "./Cart";
import Login from "./Login";
import Product from "./Product";
import Register from "./Register";
import Footer from "./Footer";
import PrivateRoute from "./privateRoute";
import SearchedProduct from './SearchedProduct'
import '../css/App.css';


function App() {
    
    return ( <div>
        
         <Router>
            <AppContent/>
           
     </Router>
    </div> );
}

function AppContent(){
    const location = useLocation();
    const paths = ['/login', '/register'];
    return(
        <div>
            {!paths.includes(location.pathname)&& <Navbar />}
      
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/product" element={<PrivateRoute element={Product}/>}/>
                <Route path="/mycart" element={<PrivateRoute element={Cart}/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/product-detail" element={<SearchedProduct/>}/>
                <Route path="/login" element={<Login/>}/>
            </Routes>
            <Footer/>
        </div>
    );
}

export default App;