import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Product.css";
import "../../node_modules/bootstrap/dist/css/bootstrap.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function Product() {
  const [productDataArray, setProductDataArray] = useState([]);
  const [globalProductId, setGlobalProductId] = useState("");
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [myProductId,setMyProductId] = useState(0);
  const [productData, setProductData] = useState({
    productName: "",
    productPrice: "",
  });
  const navigate = useNavigate();

  const getProductData = async () => {
    const jwtToken = localStorage.getItem("jwtToken").trim();
    await axios
      .get("http://localhost:8080/api/product/products", {
        headers: { Authorization: `Bearer ${jwtToken}` },
      })
      .then((response) => {
        console.log("API Response: ", response.data);
        setProductDataArray(response.data);
      })
      .catch((error) => console.error("error fetching data: ", error));
  };

  useEffect(() => {
    // getProductData();
  }, []);

  useEffect(() => {
    console.log("component did update");
  }, [productDataArray, productData]);

  const OnTextChange = (args) => {
    var copyOfProduct = { ...productData };
    copyOfProduct[args.target.name] = args.target.value;
    setProductData(copyOfProduct);
  };

  const insertProduct = async () => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      console.log("post product data : " + productData);
      const response = await axios.post(
        "http://localhost:8080/api/product/addproduct",
        productData,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      console.log("response data: ", response.data);
      toast.success("Product Added successfully");
      setProductData({ productName: "", productPrice: "" });
      getProductData();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Error fetching data:", error);
        toast.error("You are unAuthorized please Login First");
        localStorage.removeItem("jwtToken");
        navigate("/login");
      }
      if (error.response && error.response.status === 403) {
        console.log(
          "403 Forbidden: You don't have permission to access this resource."
        );
        toast.error("You don't have permission to access this resource.");
        navigate("/");
      }
    }
  };

  const editProduct = (productIdToBeEdit) => {
    console.log(
      "You need to find record with productId = " +
        productIdToBeEdit +
        " from - "
    );
    console.log(productDataArray);

    productDataArray.map((productToEdit) => {
      if (productToEdit.productId === productIdToBeEdit) {
        setGlobalProductId(productIdToBeEdit);
        var copyOfProductFromArray = { ...productToEdit };
        setProductData(copyOfProductFromArray);
        console.log("copy : " + copyOfProductFromArray);
        return;
      }
    });
  };

  const updateProduct = async () => {
    try {
      const requestData = {
        productName: productData.productName,
        productPrice: productData.productPrice,
      };
      console.log("productId : " + globalProductId);
      var jsonData = JSON.stringify(requestData);
      console.log("data : " + jsonData);
      const jwtToken = localStorage.getItem("jwtToken");
      const response = await axios.put(
        `http://localhost:8080/api/product/updateproduct/${globalProductId}`,
        requestData,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      console.log("updated data: " + response.data);
      console.log("productId :" + globalProductId);
      toast.success(
        "Product with an Id : " + globalProductId + " updated successfully"
      );
      setProductData({ productName: "", productPrice: "" });
      getProductData();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Error fetching data:", error);
        toast.error("You are unAuthorized please Login First");
        localStorage.removeItem("jwtToken");
        navigate("/login");
      }
      if (error.response && error.response.status === 403) {
        console.log(
          "403 Forbidden: You don't have permission to access this resource."
        );
        toast.error("You don't have permission to access this resource.");
        navigate("/");
      }
    }
  };

  const handleIndividualDelete = (productId) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>
            <strong>Are you sure you want to delete?</strong>
          </p>
          <div className="flex justify-end mt-2 space-x-2">
            <button
              className="btn-yes"
              onClick={() => {
                deleteProduct(productId);
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

  const deleteProduct = async (productId) => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      var response = await axios.delete(
        `http://localhost:8080/api/product/deleteproduct/${productId}`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      console.log("data with id : " + productId + " is deleted");
      console.log("Data : " + response.data);
      toast.warning(
        "Product with an Id : " + globalProductId + " deleted successfully"
      );
      getProductData();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Error fetching data:", error);
        localStorage.removeItem("jwtToken");
        toast.error("You are unAuthorized please Login First");
        navigate("/login");
      }
      if (error.response && error.response.status === 403) {
        console.log(
          "403 Forbidden: You don't have permission to access this resource."
        );
        toast.error("You don't have permission to access this resource.");
        navigate("/");
      }
    }
  };

  const handleAllChange = () => {
    setIsChecked(!isChecked);
  };

  const handleChange = (productId) => {
    setMyProductId(productId);
    setSelectedProducts((prev) => {
      return prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
    });
    console.log("in the habdleChange : "+selectedProducts);
    if(selectedProducts.includes(productId)){
        console.log("in the equal");
        setIsChecked(false);
    }
    else if(!selectedProducts.includes(productId)){
        setIsChecked(true);
    }
  };

  useEffect(() => {
    console.log(isChecked);
    handleSelectAll();
  }, [isChecked]);

  const handleSelectAll = () => {
    console.log("isChecked : "+isChecked);
   
    if (selectedProducts.length === productDataArray.length && isChecked !== true) {
      setSelectedProducts([]);
    }
    else if (isChecked !== false) {
        console.log("in the true");
        setSelectedProducts(productDataArray.map((item) => item.productId));  
    }
   
  };

  useEffect(() => {
    console.log("selectedProducts : " + selectedProducts);
  }, [selectedProducts]);

  const handleDelete = () => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>
            <strong>Are you sure you want to delete?</strong>
          </p>
          <div className="flex justify-end mt-2 space-x-2">
            <button
              className="btn-yes"
              onClick={() => {
                deleteAll();
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

  const deleteAll = () => {
    console.log("in deleteAll");
    selectedProducts.map((item) => {
      deleteProduct(item);
    });
    setSelectedProducts([]);
  };

  const openPopup = () => setPopupOpen(true);

  useEffect(() => {
    console.log("pop-up open : " + isPopupOpen);
  }, [isPopupOpen]);

  const closePopup = () => {
    setPopupOpen(false);
    setProductData({
      productName: "",
      productPrice: "",
    });
  };

  const handleSubmit = async () => {
    console.log("in Handle submit");
    if (!productData.productName || !productData.productPrice) {
      toast.warning("Please fill in all fields.");
      return;
    }
    insertProduct();
  };

  return (
    <>
      {productDataArray.length > 0 ? (
        <div className="myContainer">
          <div className="myRow">
            <div className="sideDiv col-md-2">
              <div className="productsInfoDiv">
                <h4 style={{ marginLeft: "30px", textDecoration: "underline" }}>
                  <strong>Products</strong>
                </h4>
                <button className="productsInfoButton" onClick={getProductData}>
                  Product List
                </button>
                <button className="productsInfoButton" onClick={openPopup}>
                  Add Record
                </button>
              </div>
              <hr />
            </div>

            {isPopupOpen && (
              <div className={`popup ${isActive ? "active" : ""}`} id="popup">
                <div className="overlay" onClick={closePopup}></div>
                <div className="popup-content">
                  <h2>Add Product</h2>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      name="productName"
                      placeholder="Enter Product Name"
                      value={productData.productName}
                      onChange={OnTextChange}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="number"
                      className="form-control"
                      name="productPrice"
                      placeholder="Enter Product Price"
                      value={productData.productPrice}
                      onChange={OnTextChange}
                    />
                  </div>
                  <div className="controls">
                    <button className="close-btn" onClick={closePopup}>
                      Close
                    </button>
                    <button className="submit-btn" onClick={handleSubmit}>
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mainDiv1 col-md-10">
              <div className="myTable">
                <br />

                <div className="buttonDiv">
                  <button
                    className="btn btn-primary"
                    style={{ marginRight: 15 }}
                    onClick={openPopup}
                  >
                    Add Record
                  </button>
                  <button
                    className="btn btn-success"
                    style={{ margin: 10 }}
                    onClick={updateProduct}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleDelete}
                    style={{ margin: 10 }}
                    disabled={selectedProducts.length === 0}
                  >
                    Delete All
                  </button>
                </div>
              </div>

              {/* Product Table */}
              <div className="tableClass">
                <table className="table table-bordered myTable">
                  <thead style={{ textAlign: "center" }}>
                    <tr>
                      <th>
                        <strong>
                          <u> Select</u> &nbsp;
                          <input
                            type="checkbox"
                            checked={isChecked}
                            id="allCheckBox"
                            onChange={handleAllChange}
                          />
                        </strong>
                      </th>
                      <th>
                        <strong>
                          <u> Product ID</u>
                        </strong>
                      </th>
                      <th>
                        <strong>
                          <u> Product Name</u>
                        </strong>
                      </th>
                      <th>
                        <strong>
                          <u> Product Price</u>
                        </strong>
                      </th>
                      <th>
                        <strong>
                          <u> Delete Product</u>
                        </strong>
                      </th>
                      <th>
                        <strong>
                          <u> Update Product</u>
                        </strong>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productDataArray.map((item) => (
                      <tr style={{ textAlign: "center" }} key={item.productId}>
                        <td style={{ paddingTop: 25 }}>
                          <input
                            type="checkbox"
                            id={item.productId}
                            checked={selectedProducts.includes(item.productId)}
                            onChange={() => handleChange(item.productId)}
                          />
                        </td>
                        <td style={{ paddingTop: 25 }}>{item.productId}</td>
                        <td style={{ paddingTop: 25 }}>{item.productName}</td>
                        <td style={{ paddingTop: 25 }}>{item.productPrice}</td>
                        <td>
                          <button
                            className="btn btn-danger"
                            style={{ margin: 10 }}
                            onClick={() => {
                              handleIndividualDelete(item.productId);
                            }}
                          >
                            Delete Record
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-warning"
                            style={{ margin: 10 }}
                            onClick={() => {
                              editProduct(item.productId);
                            }}
                          >
                            Update Record
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="myContainer">
          <div className="myRow">
            <div className="sideDiv col-md-2">
              <div className="productsInfoDiv">
                <h4 style={{ marginLeft: "30px", textDecoration: "underline" }}>
                  <strong onClick={getProductData}>Products</strong>
                </h4>
              </div>
            </div>

            <div1 className="mainDiv1 col-md-10">
              <div className="productDiv">
                <h1 id="homePage">Home</h1>
              </div>
            </div1>
          </div>
        </div>
      )}
    </>
  );
}

export default Product;
