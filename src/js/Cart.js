
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import deleteIcon from '../resources/delete-icon.png';
import minusIcon from '../resources/minus-icon.png';
import plusIcon from '../resources/plus-icon.png';
import '../css/Cart.css';



function Cart() {
    const location = useLocation();
    const [cartDto2List, setCartDto2List] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [productQuantity, setProductQuantity] = useState(0);
    const [checkCart, setCheckCart] = useState(false);

    const navigate = useNavigate();

    const showData = async() => {
        try {
            const userId = localStorage.getItem('userId');
            const jwtToken = localStorage.getItem('jwtToken');
            const response = await axios.get(`http://localhost:8080/api/cart/showallcartbyuser/${userId}`,{
                                                                                                headers : { Authorization: `Bearer ${jwtToken}`}
                                                                                            });
            const cartItems = response.data?.data || [];
            if (Array.isArray(cartItems)) {
                console.log("Fetched Cart Data : "+cartItems);
                setCartDto2List(cartItems);
            } else {
                console.error("Unexpected data format:", cartItems);
                setCartDto2List([]); 
            }
            
           
        } catch (error) {
            if(error.response.status === 404){
              setCheckCart(true);
            }
            if(error.response && error.response.status === 401){
                console.error("Error fetching data:", error);
                toast.error('You are unAuthorized please Login First');
                localStorage.removeItem('jwtToken');
                navigate('/login');
            }
            if (error.response && error.response.status === 403) {
                console.log("403 Forbidden: You don't have permission to access this resource.");
                toast.error("You don't have permission to access this resource.");
            }
            
        }
    };

    
    useEffect(() => {
        const calculateTotal = () => {
            const total = cartDto2List.reduce((sum, item) => {
                const price = parseFloat(item.productPrice) || 0;
                const quantity = parseInt(item.productQuantity) || 0;
                return sum + price * quantity;
            }, 0);
            setTotalPrice(total); 
            console.log("Total Price Updated:", total);
        };

        calculateTotal();
    }, [cartDto2List]); 

    useEffect(() => {
        showData(); 
    }, []);

    if (cartDto2List.length === 0) {
        return <div className="mainDiv">Your cart is empty!</div>;
    }

    const handleDelete = (cartId) => {
        toast(
          ({ closeToast }) => (
            <div>
              <p><strong>Are you sure you want to delete?</strong></p>
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  className="btn-yes"
                  onClick={() => {
                    deleteCartItem(cartId);
                    closeToast(); 
                  }}
                >
                  Yes
                </button>
                <button className="btn-no" onClick={closeToast}>
                  No
                </button>
              </div>
            </div>
          ),
          { autoClose: false } 
        );
      };
      
    const deleteCartItem = async (cartId) => {
        console.log("cartDto : "+JSON.stringify(cartDto2List));
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            console.log("cartId : "+cartId);
            const response = await axios.delete(`http://localhost:8080/api/cart/deletecart/${cartId}`, {
                                                                                                            headers:  {Authorization: `Bearer ${jwtToken}`}          
                                                                                                        });
            console.log(response.data);  
            console.log("Cart item deleted with id:", cartId);
            toast.warning(`Product remove from the cart`);
            showData(); 
        } catch (error) {
            if(error.response && error.response.status === 401){
                console.error("Error fetching data:", error);
                localStorage.removeItem('jwtToken');
                toast.error('You are unAuthorized please Login First');
                navigate('/login');
            }
            if (error.response && error.response.status === 403) {
                console.log("403 Forbidden: You don't have permission to access this resource.");
                toast.error("You don't have permission to access this resource.");
                navigate('/');
            }
        }
    };
    const reduceTheQuantity = (cartId)=>{ 
        var newProductQuantity;
        const updateCartDto2List = cartDto2List.map((item)=>{
           if(item.cartId === cartId){
            console.log(JSON.stringify(item));
             newProductQuantity = item.productQuantity -1;
             return {...item, productQuantity : newProductQuantity};
           }
           return item;
        })
        setCartDto2List(updateCartDto2List);
        console.log(JSON.stringify(cartDto2List));
        updateProduct(cartId, newProductQuantity); 
    };

    const increaseProductQuantity = (cartId) =>{
        var newProductQuantity;

        const updatedCartDto = cartDto2List.map((item)=>{
            if(item.cartId === cartId){
                newProductQuantity = item.productQuantity + 1;
                return {...item, productQuantity : newProductQuantity};
            }
            return item;
        });
        setCartDto2List(updatedCartDto);
        updateProduct(cartId, newProductQuantity);
    };

    const updateProduct = (cartId, newQuantity) => {
        const jwtToken = localStorage.getItem('jwtToken');
        axios.put(`http://localhost:8080/api/cart/updatecartquantity/${cartId}/${newQuantity}`,{},{
                                                                                                    headers : {Authorization: `Bearer ${jwtToken}`}
                                                                                                })
            .then((response) => {
                console.log("Cart updated successfully:", response.data);
                toast.info(`product quantity is updated`);
            })
            .catch((error) => {
                if(error.response && error.response.status === 401){
                    console.error("Error fetching data:", error);
                    localStorage.removeItem('jwtToken');
                    toast.error('You are unAuthorized please Login First');
                    navigate('/login');
                }
                if (error.response && error.response.status === 403) {
                    console.log("403 Forbidden: You don't have permission to access this resource.");
                    toast.error("You don't have permission to access this resource.");
                    navigate('/');
                }
            });
    };

    return (
       <>   
            {checkCart ? <div className="mainDiv">Your cart is empty!</div> :
            <div className="mainDiv">
            <div>
                <table className="table table-bordered myTable">
                    <thead style={{ textAlign: "center" }}>
                        <tr>
                            <th><strong><u>Product ID</u></strong></th>
                            <th><strong><u>Product Name</u></strong></th>
                            <th><strong><u>Product Price</u></strong></th>
                            <th><strong><u>Quantity</u></strong></th>
                            <th><strong><u>Remove</u></strong></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartDto2List.map((item) => (
                            <tr key={item.productId} style={{textAlign : 'center'}}>
                                <td>{item.productId}</td>
                                <td>{item.productName}</td>
                                <td>{item.productPrice}</td>
                                <td>
                                    {(item.productQuantity == 1) ? 
                                       ( <button style={{marginRight : '10px'}}  onClick={()=>handleDelete(item.cartId)}> 
                                            <img className="icon" src={deleteIcon} alt="delete-icon" />
                                         </button>
                                        )
                                        :
                                        (<button  style={{marginRight : '10px'}} onClick={()=>reduceTheQuantity(item.cartId)}>   
                                           <img className="icon" src={minusIcon} alt="minus-icon" />
                                        </button>
                                    )}
                                        <strong> {item.productQuantity || 1}</strong>
                                        <button  style={{marginLeft : '10px'}} onClick={()=>increaseProductQuantity(item.cartId)}>   
                                            <img className="icon" src={plusIcon} alt="plus-icon" />
                                        </button>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(item.cartId)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td><strong>Total Price:</strong></td>
                            <td colSpan={4}><strong>{totalPrice}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            </div>}
       </> 
    );
}

export default Cart;
