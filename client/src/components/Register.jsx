import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

const Register = () => {
    const navigate = useNavigate()
    const [error, setError] = useState('')

    const register = async (formData) => {
        //express route--> /api/users/register
        const username = formData.get('username')
        const password = formData.get('password')
        //console.log(username, password)
        const user = {
            username,
            password
        }
        try {
            const {data} = await axios.post('/api/users/register', user)
            //console.log(data)
            alert('registration successful! thank you')
            navigate('/')
            
        } catch (error) {
            console.error(error)
            if(error.status === 500){
                setError('invalid username or password')
            }else{
                setError(error.message)
            }
            
        }
    }

    return (
        <div>
            <h1>Register</h1>
            <form action={register}>
                <label>
                    Username:
                    <input type="text" name="username"/>
                </label>
                <label>
                    Password: 
                    <input type="password" name="password"/>
                </label>
                <button>Login</button>
            </form>
            <hr/>
            {
                error ? (
                    <h2>{error}</h2>
                ): (
                    null
                )
            }
        </div>
    )
}

export default Register