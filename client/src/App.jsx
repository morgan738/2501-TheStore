import { useState, useEffect } from 'react'
import { Link, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import Products from './components/Products'
import Login from './components/Login'
import AboutMe from './components/AboutMe'
import Register from './components/Register'
import Homepage from './components/Homepage'
import Admin from './components/Admin'
import Cart from './components/Cart'
import Orders from './components/Orders'
import axios from 'axios'

function App() {
  const [products, setProducts] = useState([])
  const [user, setUser] = useState({})
  const [favorites, setFavorites] = useState([])
  const [orders, setOrders] = useState([])
  const [lineItems, setLineItems] = useState([])

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
    if(user.id){
      const fetchOrders = async () => {
        const {data} = await axios.get('/api/orders', getHeaders())
        console.log(data)
        setOrders(data)
      }
      fetchOrders()
    }
  }, [user])

  useEffect(() => {
    if(user.id){
      const fetchLineItems = async () => {
        const {data} = await axios.get('/api/lineitems', getHeaders())
        //console.log("this is line items" , data)
        setLineItems(data)
      }
      fetchLineItems()
    }
  }, [user])

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

  const cart = orders.find((order) => order.is_cart) || {}
  const cartItems = lineItems.filter((lineItem) =>lineItem.order_id === cart.id)
  console.log(cartItems)

  const updateOrder = async (order) => {
    await axios.put(`/api/orders/${order.id}`, order, getHeaders())
    const {data} = await axios.get('/api/orders', getHeaders())
    setOrders(data)
  }

  const createLineItem = async (product) => {
    const {data} = await axios.post('/api/lineItems', {
      order_id: cart.id,
      product_id: product.id
    },getHeaders())
    setLineItems([...lineItems, data])
  }

  const updateLineItem = async (lineItem) => {
    const response = await axios.put(`/api/lineitems/${lineItem.id}`,{
      quantity: lineItem.quantity + 1,
      order_id: cart.id
    }, getHeaders())
    setLineItems(lineItems.map(lineItem => lineItem.id == response.data.id ? response.data : lineItem))
  }

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
              {
                user.is_admin ? <Link to='/admin' className={checkNavSelected('/admin') ? 'selected' : ''}>Admin</Link> : null
              }
              <Link to='/cart' className={checkNavSelected('/cart') ? 'selected' : ''} >Cart</Link>
              <Link to='/orders' className={checkNavSelected('/orders') ? 'selected' : ''} >Orders</Link>
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
                    setFavorites={setFavorites}
                    createLineItem={createLineItem}
                    cartItems = {cartItems}
                    lineItems={lineItems}
                    updateLineItem = {updateLineItem}
                    />
                  }/>
                <Route path='/user/:id' element={
                  <AboutMe 
                    user={user} 
                    favorites={favorites} 
                    products={products} 
                    getHeaders={getHeaders} 
                    setFavorites={setFavorites}/>
                  }/>
                  <Route path='/admin' element={
                    <Admin 
                      products={products} 
                      setProducts={setProducts} 
                      getHeaders={getHeaders}/>
                    }/>
                    <Route path='/cart' element={<Cart cart={cart} lineItems={lineItems} products={products} updateOrder={updateOrder}/>}/>
                    <Route path='/orders' element={<Orders orders={orders} products={products} lineItems={lineItems}/>}/>
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
