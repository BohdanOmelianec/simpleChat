import { Outlet } from 'react-router-dom';
import ChatProvider from './context/ChatProvider';
import AuthProvider from './context/AuthProvider';
import './App.scss';

const Root = () => {
  return (
    <div className="main_container">
      <ChatProvider>
        <AuthProvider>
            <Outlet />
        </AuthProvider>
      </ChatProvider>
    </div>
  )
}

export default Root;