import axios from "axios"

const Login = ({attempLoginWithToken}) => {

    const login = async (formData) => {
        //express route--> /api/auth/login
        const username = formData.get('username')
        const password = formData.get('password')
        //console.log(username, password)
        const user = {
            username,
            password
        }
        const {data} = await axios.post('/api/auth/login', user)
        //console.log(data)
        const {token} = data
        window.localStorage.setItem('token', token)
        attempLoginWithToken()
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
            <hr/>
        </div>
        
    )
}

export default Login