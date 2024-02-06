import { ChangeEventHandler, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import "./login.scss";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [userName, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const inputHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
        setError(false);
        setName(e.target.value);
    }

    const passwordHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
        setError(false);
        setPassword(e.target.value);
    }

    return (
        <div className="login_container" >
            <div className="login_wrapper">
                <div className="login_bg"></div>
                <div className='login'>
                <div className="login_logo">
                    <img src="/user.png" alt="user logo" />
                </div>
                <h2 className='login_title'>Log in</h2>
                <p className='login_subtitle'>
                    Don't have an account?{" "}
                    <Link to="/signup">Sign up</Link>
                </p>
                <div className='input_wrapper'>
                    <span style={{display: `${error ? 'block': 'none'}`}} className='login_err'>The nickname is unavailable!</span>
                    <input 
                        className={`login_input ${error ? 'input-error' : ''}`} 
                        type="text" 
                        name="userName" 
                        placeholder='Your nickname'
                        value={userName}
                        onChange={inputHandler}
                    />
                </div>
                <div className='input_wrapper'>
                    <span style={{display: `${error ? 'block': 'none'}`}} className='login_err'>The nickname is unavailable!</span>
                    <input 
                        className={`login_input ${error ? 'input-error' : ''}`} 
                        type="password" 
                        name="password" 
                        placeholder='Password'
                        value={password}
                        onChange={passwordHandler}
                    />
                </div>
                <button
                    className="login_btn"
                    disabled={!userName || !password || error}
                    onClick={() => {
                        setName("");
                        setPassword("");
                        login(userName, password);
                    }}
                >
                    Submit
                </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
