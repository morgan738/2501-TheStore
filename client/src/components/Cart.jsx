const Cart = ({cart, lineItems, products, updateOrder}) => {
    return(
        <div>
            <h2>Cart</h2>
            <ul>
                {
                    lineItems.filter((lineItem) => lineItem.order_id === cart.id).map((lineItem) => {
                        const product = products.find((product) => product.id === lineItem.product_id) || {}
                        return(
                            <li>
                                {product.name} 
                                ({lineItem.quantity})
                            </li>
                        )
                    })
                }
            </ul>
            {
                lineItems.filter((lineItem) => lineItem.order_id === cart.id).length ? (
                    <button onClick={() => {updateOrder({...cart, is_cart:false})}}>Place Order</button>
                ): (
                    null
                )
            }
            
        </div>
    )
}

export default Cart