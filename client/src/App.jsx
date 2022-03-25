import { useState, useEffect, useRef } from 'react';
import Messagefield from './components/MessageField';
import Usersfield from './components/UsersField';
import Login from './components/Login';
import './App.scss';
import socket from './socket';
import axios from 'axios';
import Layout from './components/Layout';




function App() {
  const [isLogged, setLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [usersList, setUsers] = useState([]);

  const notification = useRef();

  const messageHandler = (messageData) => {
    setMessages(messageData)
    console.log('message')
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

    socket.on('MESSAGE:NOTIFICATION', () => {
      setTimeout(() => notification.current.play(), 100);
    });

    socket.on('USER:DISCONNECTED', (users) => {
      console.log('Disconnected!')
      setUsers(users);

    })
  }, [])


  return (
    <div className="wrapper">
      {isLogged ? 
        <Layout>
          <div className="chat_container">
            <Usersfield users={usersList} currentUser={currentUser} />
            <Messagefield messages={messages} currentUser={currentUser} />
            <audio ref={notification}>
              <source src="message.mp3" type="audio/mpeg"/>
            </audio>
          </div>
        </Layout> :
        <Login  />
      }
    </div>
  )

}

export default App;
