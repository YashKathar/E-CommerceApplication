import React, { useState, useEffect } from "react";
import axios from 'axios';
import '../css/Home.css';
import cartIcon from '../resources/add-to-cart-icon.png'
import { useLocation, useNavigate  } from "react-router-dom";
import { toast } from "react-toastify";
import Product from './Product';
import SearchedProduct from './SearchedProduct';


function Home() {
     const [productDataArray, setProductDataArray] = useState([]);
     const location = useLocation();
     const navigate = useNavigate();
     const [currentPage, setCurrentPage] = useState(1);
     const [totalPages, setTotalPages] = useState(1);
    //  const { searchedProductName } = location.state || "";
     const [searchedProduct, setSearchedProduct] = useState("");
     

     
     useEffect(()=>{
         setSearchedProduct("");
         console.log("on the mount the searchedProductName is : "+searchedProduct);
         showProducts(); 
        },[]);
        
        useEffect(() => {
           if (location.state && location.state.searchedProductName) {
            console.log("when location change : "+location.state.searchedProductName);
               setSearchedProduct(location.state.searchedProductName);
           }
         }, [location.state]);


     useEffect(()=>{   
        console.log(" SearchedProduct : "+ searchedProduct);

        if (searchedProduct !== "") {
            console.log("in the handle search");
            handleSearch(searchedProduct); 
           
        } else {
            console.log("in the show products");
            showProducts(); 
            
        }
     },[searchedProduct]);


    const showProducts = async() =>{
        await axios.get(`http://localhost:8080/api/product/getallproducts?pagenumber=${currentPage-1}&pagenumber=${currentPage-1}`)
             .then(response => {
                                setProductDataArray(response.data.products);
                                setTotalPages(response.data.totalPages);
                                console.log("ALL total page : "+totalPages);
                               })
             .catch(error => console.error('error fetching data: ',error));
    };

    const fetchSearchedProduct = async (productName) =>{
        console.log("productName : "+productName+" and currentPage : "+currentPage);
        await axios.get(`http://localhost:8080/api/product/search-product?productname=${productName}&pagenumber=${currentPage -1}`)
        .then((response) =>{
                                // console.log("response : "+JSON.stringify(response));
                                setProductDataArray(response.data.data.products);
                                setTotalPages(response.data.data.totalPages);
                                // console.log("productData : ::: "+JSON.stringify(response.data.data.products));
                                console.log("in the totalPages : "+totalPages);
                            })
                            .catch((error) => {console.log("Error occurred "+error)}); 
    };

    useEffect(()=>{
        console.log("updated total page : "+totalPages);
    },[totalPages]);

    useEffect(()=>{
        console.log("searchedProduct : "+searchedProduct);
        if(searchedProduct === ""){
            console.log("in the currentPage useEffect showProducts");
            showProducts();
        }
        else{
            console.log("in the currentPage useEffect fetchSearchedProduct : "+searchedProduct);
            fetchSearchedProduct(searchedProduct);
        }
    }, [currentPage]);

   
    
    const handleSearch = async(productName) =>{
        
        setCurrentPage(1);
        if(productName === ""){
            console.log("in the handle search : null");
            showProducts();
        }
        else{
            console.log("setSearchedProduct : "+searchedProduct);
            fetchSearchedProduct(productName);  
        }                                             
    };

    const insertToCart = async (cart) => {
                const jwtToken = localStorage.getItem('jwtToken').trim();
                const userId = localStorage.getItem('userId');
                console.log("In the insertToCart");
                try {
                    console.log("typeof : "+typeof cart)
                  
                    const response = await axios.post(`http://localhost:8080/api/cart/addcartbyuser/${userId}`,cart,
                                                                        {
                                                                            headers:  {Authorization: `Bearer ${jwtToken}`}          
                                                                        });
                        console.log("response after adding to the cart in db : "+response.data);
                } catch (error) { 
                        if(error.response && error.response.status === 401){
                            console.log(error);
                            localStorage.removeItem('jwtToken');
                            toast.error("You are Unauthorized login first");
                            navigate('/login');
                        }
                        if (error.response && error.response.status === 403) {
                            console.log("403 Forbidden: You don't have permission to access this resource.");
                            
                            toast.error("You don't have permission to access this resource.");
                        }
                }
                
    }

    const addToCart = (productId)=>{
        const token  = localStorage.getItem('jwtToken');
        if(token == null){
            toast.warning("Please Login");
            navigate('/login');
            
        }else{
            console.log("on Click addCart");
            const product = productDataArray.find((findProduct) => findProduct.productId === productId)
            if(product != null){
                const cartItem = {
                    productId: product.productId,
                    productQuantity: 1, 
                };
                insertToCart(cartItem);
                toast.success("Product is added to the Cart");
            }else{
                console.log("Product data is null its not available in productDataArray");
            }
        }
    };

    const displayCart = () =>{
        if(!localStorage.getItem('jwtToken')){
            toast.error("Please Login");
        }
        navigate('/mycart');
    };
    
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            console.log("currentPage : "+currentPage); 
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return ( 
        <div className="mainDiv">
            <div className="row">
                <div className="myCartDiv" style={{marginTop : '15px'}}>
                    <button className="btn btn-primary myCartBtn" style={{ color : 'whitesmoke', fontSize : 'larger'}} onClick={displayCart}><strong>My Cart </strong><img  style={{height : '30px'}} src={cartIcon} alt="cart Icon" /></button>
                </div>

               
                    {productDataArray.map(item => (
                        <div className="col-md-3 colDiv" key={item.productId}>
                            <p><strong>Product Id: {item.productId}</strong></p>
                            <p><strong>Product name: {item.productName}</strong></p>
                            <p><strong>Product price: {item.productPrice}</strong></p>
                            <div className="buttonsHome">
                                <button className="btn btn-success">Buy</button>
                                <button className="btn btn-warning" onClick={() => addToCart(item.productId)}>Add to Cart</button>
                            </div>
                        </div>
                    ))
                }

            </div>
            <div className="paginationDiv">
                <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-end">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`} onClick={handlePreviousPage}>
                        <a className="page-link" tabIndex="-1">Previous</a>
                    </li>

                    {Array.from({ length: Math.min(3, totalPages) }, (_, index) => {
                        let startPage = Math.max(1, Math.min(currentPage - 1, totalPages - 2)); 
                        let pageNumber = startPage + index;

                        return (
                            <li 
                                key={pageNumber} 
                                className={`page-item ${currentPage === pageNumber ? "active" : ""}`} 
                                onClick={() => handlePageChange(pageNumber)}
                            >
                                <a className="page-link">{pageNumber}</a>
                            </li>
                        );
                    })}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`} onClick={handleNextPage}>
                    <a className="page-link">Next</a>
                    </li>
                </ul>
                </nav>
            </div>
        </div>
     );
}

export default Home;