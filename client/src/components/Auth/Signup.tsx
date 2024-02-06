import { ChangeEventHandler, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import "./login.scss";

const Signup = () => {
    const { register, error, setError } = useContext(AuthContext);
    const [userName, setName] = useState('');
    const [password, setPassword] = useState('');

    const inputHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
        setError("");
        setName(e.target.value);
    }

    const passwordHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
        setError("");
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
                    <h2 className='login_title'>Sign up</h2>
                    <p className='login_subtitle'>
                        Already have an account?{" "}
                        <Link to="/login">Log in</Link>
                    </p>
                    <div className='input_wrapper'>
                        
                        <input 
                            className={`login_input ${error ? 'input-error' : ''}`} 
                            type="text" 
                            name="userName"
                            maxLength={16} 
                            placeholder='Your nickname'
                            value={userName}
                            onChange={inputHandler}
                        />
                    </div>
                    <div className='input_wrapper'>
                        {/* <span style={{display: `${error ? 'block': 'none'}`}} className='login_err'>{error}</span> */}
                        <input 
                            className={`login_input ${error ? 'input-error' : ''}`} 
                            type="password" 
                            name="password" 
                            placeholder='Password'
                            value={password}
                            onChange={passwordHandler}
                        />
                        <span style={{display: `${error ? 'block': 'none'}`}} className='login_err'>{error}</span>
                    </div>
                    <button
                        className="login_btn"
                        disabled={!userName || !password || !!error}
                        onClick={() => {
                            setName("");
                            setPassword("");
                            register(userName, password);
                        }}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Signup;
