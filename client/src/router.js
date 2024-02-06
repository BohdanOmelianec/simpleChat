import { createBrowserRouter } from "react-router-dom";
import Root from "./root";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ChatContainer from "./components/ChatContainer";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: "/signup",
                element: <Signup />,
            },
        
            {
                path: "/chat",
                element: <ChatContainer />,
            },
        ]
    },
]);

export default router;