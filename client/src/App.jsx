import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import RequireAuth from './Components/RequireAuth'
import Register from './Pages/Auth/Register'
import Login from './Pages/Auth/Login'
import Header from './Components/Header'
import Contact from './Pages/Contact'
import VendorList from './Pages/VendorList'
import VendorDetail from './Pages/VendorDetail'
import Profile from './Pages/Auth/Profile'
import PageNotFound from './Pages/PageNotFound'
import VendorLogin from './Pages/Auth/VendorAuth.jsx/VendorLogin'

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/*' element={<PageNotFound />} />
        <Route element={<RequireAuth allowedRoles={["USER"]} />}>
          <Route path='/vendor-detail' element={<VendorDetail />} />
          <Route path='/profile/:fullName' element={<Profile />} />
        </Route>
        <Route path='/' element={<Home />} />
        <Route path='/vendor-list' element={<VendorList />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/vendor/login' element={<VendorLogin />} />

        <Route element={<RequireAuth allowedRoles={["VENDOR"]} />}>
          <Route path='/vendor-detail' element={<VendorDetail />} />
          <Route path='/profile/:fullName' element={<Profile />} />
        </Route>


      </Routes >
    </>
  )
}

export default App