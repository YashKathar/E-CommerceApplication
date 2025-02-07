
import veracitySymbol from '../resources/veracity.jpg'
import { useNavigate } from 'react-router-dom';
import '../css/NavBar.css'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";


function Navbar() {
    const navigate = useNavigate();
    const [productName , setProductName] = useState("");
    const [productData, setProductData] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchedProductName, setSearchedProductName] = useState("");
    

    const logOut = () =>{
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('role');
        setIsLoggedIn(false);
        setIsAdmin(false);
        toast.info("logout successfully");
        navigate('/login');
    }
    
    useEffect(()=>{
        const token = localStorage.getItem('jwtToken');
        const admin = localStorage.getItem('role')
        if(admin === "ROLE_ADMIN"){
            setIsAdmin(true);
        }
        setIsLoggedIn(!!token);
        setSearchedProductName("");
    },[])

    const onTextChange=(args)=>{
        var searchTerm = args.target.value;  

        if (searchTerm !== undefined || searchTerm !== null) {  
            setSearchedProductName(searchTerm);
        }
        
    }
    useEffect(()=>{
       if(searchedProductName !== ""){
            console.log("searchTerm: "+searchedProductName);
            navigate('/',{ state :{searchedProductName : searchedProductName}});
       }
    },[searchedProductName]);




    // const handleSearch = async(productName) =>{
    //     // productName.preventDefault();
    //     if(!productName.trim()){
    //         await axios.get(`http://localhost:8080/api/product/search-product?pagenumber=${currentPage-1}`)
    //                                 .then((response) =>{
    //                                     console.log("response : "+JSON.stringify(response));
    //                                     setProductData(response.data);
    //                                     console.log("productData : ::: "+JSON.stringify(response.data));
    //                                     setProductName("");
    //                                     navigate("/", {state : {product : response.data}});
                                        
    //                                 })
    //                                 .catch((error) => {console.log("Error occurred "+error)}); 
    //     }

    //     await axios.get(`http://localhost:8080/api/product/search-product?productname=${productName}&pagenumber=${currentPage-1}`)
    //                                 .then((response) =>{
    //                                     console.log("response : "+JSON.stringify(response));
    //                                     setProductData(response.data);
    //                                     console.log("productData : ::: "+JSON.stringify(response.data));
    //                                     console.log("in the totalPages : "+response.data.data.totalPages);
    //                                     // setProductName("");
    //                                     navigate("/", {state : {product : response.data, totalPages : response.data.data.totalPages}});
                                        
    //                                 })
    //                                 .catch((error) => {console.log("Error occurred "+error)});     

                                                                   
    // };


    return ( <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <label className="navbar-brand" style={{marginLeft : '15px'}}><h4><u><strong>PRODUCTS</strong></u></h4></label>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                        <li className="nav-item active">
                            <a className="nav-link" href="http://localhost:3000/">Home</a>
                        </li>
                        {isAdmin && (<li className="nav-item">
                            <a className="nav-link" href="http://localhost:3000/product">Edit</a>
                        </li>)}
                        </ul>
                    </div>
                    <div className='searchClass'>
                        <form className="d-flex" onChange={(e)=>onTextChange(e)}>
                        <input className="form-control mr-sm-2" 
                               type="search" 
                               placeholder="Search Product" 
                               aria-label="Search"
                               value={productName}
                               onChange={(e) => setProductName(e.target.value)}/> 
                               
                        &nbsp; &nbsp; &nbsp;
                        <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">Search</button>
                        </form>
                    </div>
                    {isLoggedIn ? (
                        <div className='logOutDiv'>
                            <button className="btn btn-danger" id="logoutButton" onClick={logOut}>Sign out</button>
                        </div> 
                            )
                        :
                        (<div className='logOutDiv'>
                            <button className="btn btn-primary" id="loginButton" onClick={()=> navigate('/login')}>Sign In</button>
                        </div> )    
                    }
                    <div>
                        <img src={veracitySymbol} alt="veracity" style={{height : 65, marginRight : 10}} />
                    </div>
                    </nav>
             </div> );
}

export default Navbar;