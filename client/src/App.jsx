import { useState, useEffect } from 'react';
import Messagefield from './components/MessageField';
import Usersfield from './components/UsersField';
import Login from './components/Login';
import './App.scss';
import socket from './socket';
import axios from 'axios';




function App() {
  const [isLogged, setLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [usersList, setUsers] = useState([]);

  const loginHandler = async (userName) => {
    socket.emit('USER:CONNECT', userName)
}

  const messageHandler = (messageData) => {
    setMessages(messageData)
    console.log('messages')
  }

  const sendMessage = (message, file) => {

    const time = `${new Date().getHours()}:${new Date().getMinutes()}`
    socket.emit('USER:MESSAGE', {
      ...currentUser,
      message,
      file,
      time
    })
  }

  useEffect(() => {
    socket.on('USER:CONNECT', userData => {
      setCurrentUser(userData);
      async function getMessages() {
        const data = await axios.get('/messages')
        setMessages(data.data)
      }
      getMessages()
      setLogin(true)
    })

    socket.on('USER:CONNECTED', (users) => {
      console.log('Connected!')
      setUsers(users)
    })
  
    socket.on('USER:MESSAGE', messageHandler);

    socket.on('USER:DISCONNECTED', (users) => {
      console.log('Disconnected!')
      setUsers(users);

    })
  }, [])


  return (
    <div className="wrapper">
      {isLogged ? 
        <div className="chat_container">
          <Usersfield users={usersList} />
          <Messagefield messages={messages} sendMessage={sendMessage} currentUser={currentUser} />
        </div> :
        <Login loginHandler={loginHandler} />
      }
    </div>
  )

}

export default App;
