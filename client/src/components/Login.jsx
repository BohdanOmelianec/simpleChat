import React from 'react';
import socket from '../socket';
import axios from 'axios';

const Login = () => {
    const [userName, setName] = React.useState('');
    const [error, setError] = React.useState(false);

    const loginHandler = async (userName) => {
        const res = await axios.post('/auth', {userName})
        if(res.data) {
          socket.emit('USER:CONNECT', userName)
        } else {
            setError(true)
        }
    }

    const inputHandler = (e) => {
        setError(false)
        setName(e.target.value)
    }

    return (
        <div className='login_container'>
            <span style={{visibility: `${error ? 'visible': 'hidden'}`}} className='login_container_err'>The nickname is unavailable!</span>
            <input 
                className={`login_container_input ${error ? 'input-error' : ''}`} 
                type="text" 
                name="userName" 
                placeholder='Your nickname'
                value={userName}
                onChange={inputHandler}
                 />
            <button className="login_container_btn" disabled={!userName} onClick={() => loginHandler(userName)}>Login</button>
        </div>
    );
}

export default Login;
