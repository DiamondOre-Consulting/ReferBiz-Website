import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const RequireAuth = ({ allowedRoles }) => {
    const { isLoggedIn } = useSelector((state) => state?.auth)
    const role = useSelector((state) => state?.auth?.data?.role)
    console.log(role)

    return isLoggedIn && allowedRoles?.find((myRole) => myRole == role) ? (
        <Outlet />
    ) : isLoggedIn ? (<Navigate to='/denied' />) : (<Navigate to="/login" />)
}

export default RequireAuth