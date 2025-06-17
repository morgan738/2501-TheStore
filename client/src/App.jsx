import { useState, useEffect } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import Products from './components/Products'
import Login from './components/Login'
import axios from 'axios'

function App() {
  const [products, setProducts] = useState([])
  const [user, setUser] = useState({})
  const [favorites, setFavorites] = useState([])

  const getHeaders = () => {
    return {
      headers:{
            authorization: window.localStorage.getItem('token')
      }
    }
  }

  const attempLoginWithToken = async () => {
    const token = window.localStorage.getItem('token')
    if(token){
      try {
        // express route --> /api/auth/me
        const {data} = await axios.get('/api/auth/me', getHeaders())
        //console.log(data)
        setUser(data)
      } catch (error) {
        console.log(error)
        window.localStorage.removeItem('token')
      }
    }
  }

  const logout = () => {
    window.localStorage.removeItem('token')
    setUser({})
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const {data} = await axios.get('/api/products')
        //console.log(data)
        setProducts(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    attempLoginWithToken()
  }, [])

  useEffect(() => {
    try {
      const fetchFavorites = async () => {
        const {data} = await axios.get('/api/favorites', getHeaders())
        //console.log(data)
        setFavorites(data)
      }
      fetchFavorites()
    } catch (error) {
      console.log(error)
    }
  },[user])

  return (
    <div>
      {
        user.id ? (
          <div>
            <h1>Welcome {user.username}</h1>
            <button onClick={logout}>Logout</button>
            <Products products={products} favorites={favorites} user={user}/>
          </div>
        ) : (
          <div>
            <Login attempLoginWithToken={attempLoginWithToken}/>
            <Products products={products}/>
           </div>
        )
      }
      
      
    </div>
  )
}

export default App
