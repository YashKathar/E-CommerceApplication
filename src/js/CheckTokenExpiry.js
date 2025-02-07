import { useNavigate } from "react-router-dom";
import {jwtDecode} from 'jwt-decode';

function CheckTokenExpiry() {
    const token  = localStorage.getItem('jwtToken');
    const navigate = useNavigate();

    if(isTokenExpired(token)){
        alert('Your Session time-out please login again');
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('role');
        navigate('/login');
    }
}


function isTokenExpired(token) {
    if(!token) return true;
    const decoded = jwtDecode(token);
    const currentTime = Date.now()/1000
    return decoded.exp < currentTime;
}
export default CheckTokenExpiry;