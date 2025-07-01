import axios from "axios"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"


const Admin = ({getHeaders, products, setProducts}) => {
    const [showCreateProd, setShowCreateProd] = useState(false)
    const [showAllUsers, setShowAllUsers] = useState(false)
    const [showUpdateProd, setShowUpdateProd] = useState(false)
    const [usersList, setUsersList] = useState([])


    useEffect(() => {
        const fetchUsers = async() => {
            const {data} = await axios.get('/api/users', getHeaders())
            setUsersList(data)
        }
        fetchUsers()
    }, [])

    const toggleCreateProd = () => {
        setShowCreateProd(!showCreateProd)
    }
    const toggleUsers = () => {
        setShowAllUsers(!showAllUsers)
    }
    const toggleShowUpdateProd = () => {
        setShowUpdateProd(!showUpdateProd)
    }

    const createProd = async (formData) => {
        const name = formData.get('product_name')
        
        const product = {
            name
        }
        
        try {
            const {data} = await axios.post('/api/products', product, getHeaders())
            console.log(data)
            setProducts([...products, data])
            alert('product created')
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div>
            <h2>Admin Dashboard</h2>
            <hr/>
            <h3 onClick={toggleCreateProd}>Click to Create Product</h3>
            {
                showCreateProd ? (
                    <form action={createProd}>
                        <h4>New Product:</h4>
                        <label>
                            Product Name:
                            <input type="text" name="product_name"/>
                        </label>
                        <button onClick={createProd}>Create</button>
                    </form>
                ) : (
                    null
                )
            }
            <h3 onClick={toggleShowUpdateProd}>Click to Update Product</h3>
            {
                showUpdateProd ? (
                    <div>
                        <h4>Update Product</h4>
                        {
                            products.map((product) => {
                                return (
                                    <div>
                                        <Link to={`/admin/products/edit/${product.id}`}>{product.name}</Link>
                                    </div>
                                )
                            })
                        }
                        
                    </div>
                ): (
                    null
                )
            }
            <h3 onClick={toggleUsers}>Click to show all users</h3>
            {
                showAllUsers ? (
                    <div>
                        <h4>All users:</h4>
                        {
                            usersList.map((u) => {
                                return(
                                    <div className="userlistDiv" key={u.id}>
                                        <div>
                                            User id: {u.id}
                                        </div>
                                        <div>
                                            Username: {u.username}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                ) : (
                    null
                )
            }

        </div>
    )

}

export default Admin