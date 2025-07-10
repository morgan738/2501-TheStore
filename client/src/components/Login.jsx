import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

const Login = ({attempLoginWithToken}) => {
    const navigate = useNavigate()
    const [error, setError] = useState('')

    const login = async (formData) => {
        //express route--> /api/auth/login
        const username = formData.get('username')
        const password = formData.get('password')
        //console.log(username, password)
        const user = {
            username,
            password
        }
        try {
            setError('')
            const {data} = await axios.post('/api/auth/login', user)
            //console.log(data)
            const {token} = data
            window.localStorage.setItem('token', token)
            attempLoginWithToken()
            navigate('/')
        } catch (error) {
            console.error(error)
            if(error.status === 401){
                setError('incorrect credentials')
            }else{
                setError(error.message)
            }
            
            
        }
        
        
    }

    return(
        <div>
            <h1>Login</h1>
            <form action={login}>
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
            <br/>
            <a href={`https://github.com/login/oauth/authorize?client_id=${window.GITHUB_CLIENT_ID}`}>Login through Github</a>
            <hr/>
            {
                error ? (
                    <h2>{error}</h2>
                ) : (
                    null
                )
            }
        </div>
        
    )
}

export default Login