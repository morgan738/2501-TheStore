import axios from "axios"

const Products = ({products, favorites, user, getHeaders, setFavorites, createLineItem, cartItems, lineItems, updateLineItem}) => {

    const findFav = (product) => {
        if(user === undefined){
            return false
        }else{
            const found = favorites.find(fav => fav.product_id === product.id)
            if(found){
                return true
            }
        }

    }

    const addToFav = async (prodId) => {
        try {
            const {data} = await axios.post('/api/favorites', {product_id: prodId, user_id: user.id}, getHeaders())
            setFavorites([...favorites, data])
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <h2>Products</h2>
            {
                products.map((product) => {
                    let cartItem
                    if(user){
                        cartItem = cartItems.find(lineItem => lineItem.product_id === product.id)
                    }else{
                        cartItem = null
                    }
                    
                    return(
                        <ul key={product.id}>
                            <li className= { findFav(product)? "favorite product":"product" } >
                                {product.name}
                                {product.image ? <img src={product.image} /> : null}
                                {
                                    user ? (
                                        <div>
                                            {   
                                                findFav(product)? (
                                                    null
                                                ): (
                                                    <div>
                                                        <button onClick={() => addToFav(product.id)}>Add To Favorites</button>
                                                    </div>
                                                )
                                            }
                                        </div>

                                    ):(
                                        null
                                    )
                                }
                                {
                                    user ? (
                                        
                                        cartItem ? (
                                            <button onClick={() => updateLineItem(cartItem)}>Add another</button>
                                        ) : (
                                            <button onClick={() => createLineItem(product)}>Add to Cart</button>
                                        )

                                    ) : (
                                        null
                                    )
                                }
                                
                                
                                
                            </li>
                        </ul>
                    )
                })
            }
        </div>
    )
}

export default Products