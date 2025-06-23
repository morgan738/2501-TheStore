import axios from "axios"

const AboutMe = ({user, favorites, products, getHeaders, setFavorites}) => {

    const removeFav = async (favId) => {
        try {
            await axios.delete(`/api/favorites/${favId}/user/${user.id}`, getHeaders())
            setFavorites(favorites.filter((fav) => fav.id !== favId))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <h3>User Info</h3>
            <hr/>
            <h4>User ID: <span>{user.id}</span> </h4>
            <h4>Username: <span>{user.username}</span> </h4>
            <h4>List of favorite products:</h4>
            {
                favorites.map((fav) => {
                    const favProd = products.find((prod) => fav.product_id === prod.id)
                    return(
                        <li key={fav.id}>
                            {favProd.name}
                            <div>
                                <button onClick={() => removeFav(fav.id)}>Remove Favorite</button>
                            </div>
                            
                        </li>
                    )
                })
            }
        </div>
    )
}

export default AboutMe