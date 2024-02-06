import {
  useState, useEffect, useRef, useContext,
  FormEventHandler, KeyboardEventHandler, ChangeEventHandler,
} from "react";
import { v4 } from "uuid";
import socket from "../../socket/socket";
import { socketEvents } from "../../socket/socketEvents";
import { ChatContext } from "../../context/ChatProvider";
import { AuthContext } from "../../context/AuthProvider";
import "./messages.scss";

const MessageBar = () => {
  const { messages } = useContext(ChatContext);
  const { logout, currentUser } = useContext(AuthContext);
  const [inpValue, setInputValue] = useState("");
  const [typingStatus, setTypingStatus] = useState("");
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const notification = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if(lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const typingHandler = (text: string) => {
      setTypingStatus(text);
    };

    const notificationHandler = () => {
      setTimeout(() => notification.current!.play(), 100);
    }

    socket.on(socketEvents.message.typingResponse, typingHandler);
    socket.on("MESSAGE:NOTIFICATION", notificationHandler);

    return () => {
      socket.off(socketEvents.message.typingResponse, typingHandler);
      socket.off("MESSAGE:NOTIFICATION", notificationHandler);
    };
  }, []);

  const inputHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.target.value);

    let typingText = `${currentUser!.userName} is typing...`;
    if (!e.target.value.trim()) {
      typingText = "";
    }
    socket.emit(socketEvents.message.typing, typingText);
  };

  const handleTyping: KeyboardEventHandler<HTMLInputElement> = (e) => {
    let typingText = `${currentUser!.userName} is typing...`;
    if (!(e.target as HTMLInputElement).value.trim()) {
      typingText = "";
    }
    socket.emit(socketEvents.message.typing, typingText);
  };

  const sendHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const time = `${new Date().getHours()}:${new Date().getMinutes()}`;
    if (inpValue.trim()) {
      const newMessage = {
        userName: currentUser!.userName,
        message: inpValue.trim(),
        time,
        id: v4(),
      };
      socket.emit(socketEvents.message.sending, newMessage);
      socket.emit(socketEvents.message.typing, "");
    }
    setInputValue("");
  };

  return (
    <div className="msg_container">
      <div className="msg_header">
        <h2>Common room</h2>
        <button onClick={logout}>Leave chat</button>
      </div>
      <div className="msg_section">
        {messages.map((message) => {
          const isYou = message.userName === currentUser!.userName;

          return (
            <div key={message.id} ref={lastMessageRef} className="msg_item">
              <div className={`msg_data ${isYou ? "sender" : "recipient"}`}>
                <div className="msg_send_info">
                  <span className="msg_name">{message.userName}</span>
                  <span className="msg_time">{message.time}</span>
                </div>
                <p>{message.message}</p>
              </div>
            </div>
          );
        })}

        <div className="msg_status">
          <p>{typingStatus}</p>
        </div>
      </div>
      <form onSubmit={sendHandler} className="send_section">
        <input
          placeholder="Type a message..."
          className="msg_input"
          value={inpValue}
          onChange={inputHandler}
          onKeyUp={handleTyping}
        />
        <button
          className="msg_button"
          type="submit"
          disabled={!inpValue.trim()}
        >
          <i className="material-icons msg_button_icon">send</i>
        </button>
      </form>
      <audio ref={notification}>
        <source src="message.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default MessageBar;
