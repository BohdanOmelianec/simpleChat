import UsersBar from '../UsersBar';
import MessagesBar from '../MessagesBar';
import './chat.scss';

const ChatContainer = () => {
  return (
    <div className="chat_container">
        <UsersBar />
        <MessagesBar />
    </div>
  )
}

export default ChatContainer;
