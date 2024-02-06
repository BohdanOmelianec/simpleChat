import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import socket from "../socket/socket";
import { socketEvents } from "../socket/socketEvents";
import { useNavigate } from "react-router-dom";
import { User } from "../types";


interface DefaultValues {
    isConnected: boolean,
    currentUser: null | User,
    login: (userName: string, password: string) => void,
    autoLogin: () => void,
    register: (userName: string, pass: string) => void,
    logout: () => void,
    error: string,
    setError: (err: string) => void,
  }
const defaultValues: DefaultValues = {
    isConnected: false,
    currentUser: null,
    login: () => {},
    autoLogin: () => {},
    register: () => {},
    logout: () => {},
    error: "",
    setError: () => {}
}
export const AuthContext = createContext(defaultValues);

const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState<null | User>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    autoLogin();
  }, [])

  useEffect(() => {
    isConnected ? navigate("/chat") : navigate("/login");
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected])

  const login = async (userName: string, password: string) => {
    try {
        const result = await axios.post<User>("/login", { userName, password });

        if(result.status === 200) {
            socket.connect();
            socket.emit(socketEvents.user.connecting, result.data);
            setIsConnected(true);
            setCurrentUser({
                ...result.data,
                socketID: socket.id,
            });
        };
    } catch (err: any) {
        if (err.response.status === 401) {
            setError("No user found");
        } else {
            setError("Something went wrong!");
        }
    } finally {
        setIsLoading(false);

    }
}

const autoLogin = async () => {
    try {
        const result = await axios.get<User>("/autologin");
        if(result.status === 200) {
            socket.connect();
            socket.emit(socketEvents.user.connecting, result.data);
            setIsConnected(true);
            setCurrentUser({
                ...result.data,
                socketID: socket.id,
            });
        };
    } catch (err: any) {
        if (err.response.status === 403) {
            setError("No user found");
        } else {
            setError("Something went wrong!");
        }
    } finally {
        setIsLoading(false);
    }
}

const register = async (name: string, pass: string) => {
    setIsLoading(true);
    try {
        const response = await axios.post("/signup", { userName: name, password: pass });

        if(response.status === 201) {
          const { userName, password } = response.data;
            setTimeout(() => login(userName, password), 1000);
        }
    } catch (err: any) {
        console.log(err.response)
        if (err.response.status === 409) {
            setError("This name is unavailable.");
        } else {
            setError("Something went wrong!");
        }
    }
}

const logout = async () => {
    try {
        await axios.get("/logout");
        setIsConnected(false);
        socket.disconnect();
    } catch (err: any) {
        if (err.response) {
            return err.response;
        } else {
            return "Something went wrong!";
        }
    }
}

  const value = {
      isConnected,
      currentUser,
      login,
      autoLogin,
      register,
      logout,
      error,
      setError,
  }

  if(isLoading) return null;

  return (
      <AuthContext.Provider value={value}>
          {children}
      </AuthContext.Provider>
  )
}

export default AuthProvider;