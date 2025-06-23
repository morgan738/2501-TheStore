import { useState, useEffect } from 'react'
import { Link, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import Products from './components/Products'
import Login from './components/Login'
import AboutMe from './components/AboutMe'
import Register from './components/Register'
import Homepage from './components/Homepage'
import axios from 'axios'

function App() {
  const [products, setProducts] = useState([])
  const [user, setUser] = useState({})
  const [favorites, setFavorites] = useState([])

  const navigate = useNavigate()
  const location = useLocation()


  const getHeaders = () => {
    return {
      headers:{
            authorization: window.localStorage.getItem('token')
      }
    }
  }

  const checkNavSelected = (path) => {
    return location.pathname === path
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
    navigate('/')
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
    const fetchFavorites = async () => {
      try {
        const {data} = await axios.get('/api/favorites', getHeaders())
        //console.log(data)
        setFavorites(data)
      } catch (error) {
        console.log(error)
      } 
    }
    if(user.id){
      fetchFavorites()
    }else{
      setFavorites([])
    }
  },[user])

  return (
    <div>
      {
        user.id ? (
          <div>
            <nav>
              <Link to='/' className={checkNavSelected('/') ? 'selected' : ''}>Home</Link>
              <Link to={`/user/${user.id}`} className={checkNavSelected(`/user/${user.id}`) ? 'selected' : ''}>About Me</Link>
              <Link to='/products' className={checkNavSelected('/products') ? 'selected' : ''}>Products ({products.length})</Link>
              <span>Welcome {user.username}</span>
              <button onClick={logout}>Logout</button>
            </nav>
              <Routes>
                <Route index element={<Homepage/>}/>
                <Route path='/products' element={
                  <Products 
                    products={products} 
                    favorites={favorites} 
                    user={user} 
                    getHeaders={getHeaders} 
                    setFavorites={setFavorites}/>
                  }/>
                <Route path='/user/:id' element={
                  <AboutMe 
                    user={user} 
                    favorites={favorites} 
                    products={products} 
                    getHeaders={getHeaders} 
                    setFavorites={setFavorites}/>
                  }/>
              </Routes>
            <div>
              
            </div>
          </div>
        ) : (
          <div>
            <nav>
              <Link to='/' className={checkNavSelected('/') ? 'selected' : ''}>Home</Link>
              <Link to='/products' className={checkNavSelected('/products') ? 'selected' : ''}>Products ({products.length})</Link>
              <Link to='/login' className={checkNavSelected('/login') ? 'selected' : ''}>Login</Link>
              <Link to='/register' className={checkNavSelected('/register') ? 'selected' : ''}>Register</Link>
            </nav>
              <Routes>
                <Route index element={<Homepage/>}/>
                <Route path='/products' element={<Products products={products}/>}/>
                <Route path='/login' element={<Login attempLoginWithToken={attempLoginWithToken}/>}/>
                <Route path='/register' element={<Register/>}/>
              </Routes>
           </div>
        )
      }

      
    </div>
  )
}

export default App
