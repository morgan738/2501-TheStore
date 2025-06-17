const Products = ({products, favorites, user}) => {

    console.log(favorites)

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

    return (
        <div>
            <h2>Products</h2>
            {
                products.map((product) => {
                    return(
                        <ul key={product.id}>
                            <li className= { findFav(product)? "favorite":"" }>{product.name}</li>
                        </ul>
                    )
                })
            }
        </div>
    )
}

export default Products