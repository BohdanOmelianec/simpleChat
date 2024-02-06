import { Outlet } from 'react-router-dom';
import "./login.scss";

const Auth = () => {
    return (
        <div className="login_container" >
            <div className="login_wrapper">
                <div className="login_bg"></div>
                <div className='login'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Auth;
