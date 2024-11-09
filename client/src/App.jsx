import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import RequireAuth from './Components/RequireAuth'
import Register from './Pages/Auth/Register'
import Login from './Pages/Auth/Login'
import Header from './Components/Header'
import Contact from './Pages/Contact'

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route element={<RequireAuth />}>
        </Route>
        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<Contact />} />

        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
      </Routes >
    </>
  )
}

export default App