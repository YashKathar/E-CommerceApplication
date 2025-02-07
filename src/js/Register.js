import axios from 'axios';
import '../css/Register.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';



function Register() {
    const [formData, setFormData] = useState({  
                                                userName : "",
                                                firstName : "",
                                                lastName : "",
                                                email : "",
                                                password : "",
                                                role : "ROLE_CUSTOMER"
                                            });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit=(event) =>{
        event.preventDefault();
        
        if(confirmPassword === formData.password){
                if(error){
                    alert("Error occurred in you form please check again");
                    return;
                }else{
                    setError("");
                    insertData();
                    console.log("Form Submitted Successfully:", formData);
                    alert("Registration Successful!");
                    navigate('/login');
                }
                    
            }
        else{
                    setError("password and confirm password does not match");
                    setFormData({
                                                userName : "",
                                                firstName : "",
                                                lastName : "",
                                                email : "",
                                                password : "",
                                                role: formData.role
                    });
                    setConfirmPassword("");
                    setTimeout(()=>{setError("")},3000);
            }
    };  

    const handleChange = (e) => {
        const {name, value} = e.target;
        console.log("name : "+name+" and value : "+value);

        setFormData({
            ...formData, [name] : value,
                    });
    };

    const handleConfirmPasswordChange =(e)=>{
        setConfirmPassword(e.target.value);
        console.log("confirmPassword : "+confirmPassword);
    };

   
    const insertData = async()=>{
        try {
                const response = await axios.post('http://localhost:8080/api/user/register',formData);
                console.log('response : '+JSON.stringify(response.data));
        } catch (error) {
            console.error("Error occurred : "+error);
            throw error;
        } 
   };
    return ( <div>
                <div className="register-container">
                    <form className="register-form" onSubmit={handleSubmit}>
                        <h2>Register</h2>
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input 
                                type="text" 
                                name="firstName" 
                                id="firstName"
                                placeholder='Enter the First Name'
                                value={formData.firstName} 
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName"> Last Name </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                placeholder="Enter your last name"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="userName">Username</label>
                            <input
                                type="text"
                                id="registerUserName"
                                name="userName"
                                placeholder="Enter a username"
                                value={formData.userName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                        </div>
                        <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="registerPassword"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                required
                            />
                        </div>
                        {error && <p className='error'>{error}</p>}
                        <button type="submit" className='submit-btn'>Register</button>
                        <br /><br />
                    <p>
                    &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        already sign-up <a href="/login">login</a>
                    </p>
                    </form>
                </div>


             </div> );
}

export default Register;