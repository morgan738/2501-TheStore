const Orders = ({orders, products, lineItems}) => {
    return (
        <div>
            <h2>Orders</h2>
            <div>
                {
                    orders.filter((order) => !order.is_cart).map((order) => {
                        const orderLineItems = lineItems.filter((lineItem) => lineItem.order_id === order.id)
                        return (
                            <ul>
                                {
                                    orderLineItems.map((lineItem) => {
                                        const product = products.find((product) => product.id === lineItem.product_id)
                                        return(
                                            <li>
                                                {product ? product.name : ''}
                                                ({lineItem.quantity})
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Orders