import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

function PrivateRoute({element : Component}) {
    const jwtToken = localStorage.getItem('jwtToken');
    return jwtToken ? <Component/> : <Navigate to="/login"/>
}

export default PrivateRoute;