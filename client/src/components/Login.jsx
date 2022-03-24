import React from 'react';

const Login = ({ loginHandler }) => {
    const [userName, setName] = React.useState('');


    return (
        <div className='login_container'>
            <input 
                className="login_container_input" 
                type="text" 
                name="userName" 
                placeholder='Your nickname'
                value={userName}
                onChange={e => setName(e.target.value)}
                 />
            <button className="login_container_btn" disabled={!userName} onClick={() => loginHandler(userName)}>Login</button>
        </div>
    );
}

export default Login;
