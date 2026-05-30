import {Navigate} from "react-router-dom";
import useAuth from "../hooks/useAuth";

const protectedRoute=({children})=>{
    const {currentUser}=useAuth();

    if(!currentUser){
        return <Navigate to="/login" />;
    }
    return children;
};

export default protectedRoute;