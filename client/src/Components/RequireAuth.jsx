// RequireAuth.js
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const RequireAuth = ({ allowedRoles }) => {
    const role = useSelector((state) => state?.auth?.role)

    // Redirect logic based on role
    if (role && !allowedRoles.includes(role)) {
        return role === "VENDOR" ? <Navigate to="/vendor/dashboard" replace /> : <Navigate to="/" replace />
    }

    return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/login" replace />
}

export default RequireAuth
