// import { useLocation, useNavigate } from "react-router-dom";
// import '../css/SearchedProduct.css';

// function SearchedProduct() {

//     const location = useLocation();
//     var productData = location.state?.product;
//     const navigate = useNavigate();

//     console.log("my data "+productData);
//     console.log("productName : "+productData.productName);

//     const onClickBtn = () =>{
//         navigate("/");
//     };

//     const addToCart = (productId) =>{};

//     return (  
//         <div className="product-container">
//     <div className="product-box">
//         <h2 className="product-header">Product Details</h2>

//         <p className="product-detail">
//             <strong>Name:</strong> {productData.productName}
//         </p>
//         <p className="product-price">
//             <strong>Price:</strong> Rs {productData.productPrice}
//         </p>

//         <div className="buttonsHome">
//             <button className="product-button" onClick={onClickBtn}>
//                 Back to Products
//             </button>
//             <button className="add-cart-button" onClick={() => addToCart(productData.productId)}>
//                 Add to Cart
//             </button>
//         </div>
//     </div>
// </div>

//     );
// }

// export default SearchedProduct;

import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/SearchedProduct.css";

function SearchedProduct() {
    const location = useLocation();
    const navigate = useNavigate();
    const productData = location.state?.product;

    console.log("Product Data: ", productData);

    const onClickBtn = () => {
        navigate("/");
    };

    const insertToCart = async (cart) => {
        const jwtToken = localStorage.getItem("jwtToken")?.trim();
        const userId = localStorage.getItem("userId");

        if (!jwtToken) {
            alert("You are Unauthorized. Please log in first.");
            navigate("/login");
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8080/api/cart/addcartbyuser/${userId}`,
                cart,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );
            console.log("Cart Response:", response.data);
            alert("Product added to cart successfully!");
        } catch (error) {
            console.error("Error adding to cart:", error);
            if (error.response?.status === 401) {
                localStorage.removeItem("jwtToken");
                alert("You are Unauthorized. Please log in first.");
                navigate("/login");
            }
            if (error.response?.status === 403) {
                alert("You don't have permission to access this resource.");
            }
        }
    };

    const addToCart = (productId) => {
        console.log("Clicked Add to Cart for Product ID:", productId);

        if (!productData) {
            console.log("Product data is null. Cannot add to cart.");
            return;
        }

        const cartItem = {
            productId: productData.productId,
            productQuantity: 1,
        };

        insertToCart(cartItem);
    };

    return (
        <div className="product-container">
            <div className="product-box">
                <h2 className="product-header">Product Details</h2>

                <p className="product-detail">
                    <strong>Name:</strong> {productData.productName}
                </p>
                <p className="product-price">
                    <strong>Price:</strong> Rs {productData.productPrice}
                </p>

                <div className="buttonsHome">
                    <button className="product-button" onClick={onClickBtn}>
                        Back to Products
                    </button>
                    <button className="add-cart-button" onClick={() => addToCart(productData.productId)}>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SearchedProduct;
