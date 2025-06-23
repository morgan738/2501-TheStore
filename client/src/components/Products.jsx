import axios from "axios"

const Products = ({products, favorites, user, getHeaders, setFavorites}) => {

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
                    return(
                        <ul key={product.id}>
                            <li className= { findFav(product)? "favorite":"" }>
                                {product.name}
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
                                
                            </li>
                        </ul>
                    )
                })
            }
        </div>
    )
}

export default Products