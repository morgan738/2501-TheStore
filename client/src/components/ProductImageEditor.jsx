import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"

const ProductImageEditor = ({products, setProducts, getHeaders}) => {
    const [data, setData] = useState('')
    const params = useParams()
    const product = products.find((prod) => prod.id === params.id)

    const el = useRef()
    
    //console.log(el.current)

    useEffect(() => {
        if(product) {
            el.current.addEventListener("change", (event) => {
                //console.log(event)
                const file = event.target.files[0]
                console.log(file)
                setData(file)
            })

        }
    })

    const updateProduct= async(formData) => {
        const reader = new FileReader()
        reader.readAsDataURL(data)
        const name = formData.get('name')
        reader.addEventListener('load', async() => {
            const updatedProduct = {
                id: product.id,
                name: name,
                image: reader.result
            }
            const {data} = await axios.put(`/api/products/${params.id}`, updatedProduct, getHeaders())
            setProducts(products.map((product) => product.id === updatedProduct.id ? updatedProduct : product))
        })

    }
    if(!product){
        return null
    }

    return (
       <form action={updateProduct}>
        <label>
            Name:
            <input type="text" name="name" defaultValue={product.name}/>
        </label>
        {
            product ? <input type="file" ref={el} /> : null
        }
        
        <button>Submit</button>
       </form>
    )

}

export default ProductImageEditor