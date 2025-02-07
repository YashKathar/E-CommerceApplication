import '../css/Login.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function Login() {
    const [userName, setUserName] = useState("");
    const[password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    
    const handleLogin= async (event)=>{

        event.preventDefault(); 
        
        if (userName.trim() === "" || password.trim() === "") {
            setError("Credentials should not be empty");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/user/login',{userName, password});
            console.log('response data '+ response.data);
                if(response.status === 200){
                    const {data} = response.data;
                    const {token, userName, role, userId} = data;
                    localStorage.setItem('jwtToken', token);
                    localStorage.setItem('userName', userName);
                    localStorage.setItem('role', role);
                    localStorage.setItem('userId', userId);
                    toast.success(`Welcome ${userName}`);
                    navigate("/")
                }
        } catch (error) {
            toast.error("Invalid Credentials");
            setUserName("");
            setPassword("");
            console.error(error);
        }

    };


    
    return ( <div>
          <div className='myDiv'>
            <form onSubmit={handleLogin}>
           
                    <h1 className="classH2">Welcome Back</h1>
                    <p className="subtitle">Please login to continue</p>
                    {error && <p className="error">{error}</p>}
                    <div className="inputDiv">
                    <div className="inputGroup">
                        <input
                        type="text"
                        name="userName"
                        id="userName"
                        placeholder="Username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        />
                    </div>
                    <div className="inputGroup">
                        <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                    </div>
                    </div>
                    <input type="submit" value="Login" id="submitButton" />
                    <p className="footerText">
                        Don't have an account? <a href="/register">Sign up</a>
                    </p>
                    <p className="footerText">
                        Go To <a href="/"> HomePage</a>
                    </p>
            </form>
          </div>
    </div> );
}

export default Login;