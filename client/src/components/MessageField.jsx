import { useState, useEffect, useRef } from "react";
import socket from "../socket";

const Messagefield = ({ messages, currentUser }) => {
  const [inpValue, setInputValue] = useState("");
  const fieldRef = useRef();
  
  useEffect(() => {
    fieldRef.current.scrollTo({
      top: fieldRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages])

  const inputHandler = (e) => {
    setInputValue(e.target.value);
  };

  const sendHandler = (e) => {
    e.preventDefault();

    const time = `${new Date().getHours()}:${new Date().getMinutes()}`
    socket.emit('USER:MESSAGE', {
      ...currentUser,
      message: inpValue.trim(),
      time
    })

    setInputValue("");
  };


  return (
    <div className="msg_container">
      <section className="msg_section" ref={fieldRef}>
        {messages.map((message, index) => {
          const isYou = message.userName === currentUser.userName;

          return (
            <div key={message.id + index} className={`msg_item ${isYou ? 'flex-end' : '' }`} >
              {!isYou && <div className="msg_icon">
                <i className="material-icons user_info_logo">
                  person
                </i>
              </div>}
              <div className="msg_data" >
                <div className={`msg_data_header ${isYou ? 'flex-end' : '' }`}>
                  <span className="msg_data_name">
                    {message.userName}
                  </span>
                  <span className="msg_data_time">
                    {message.time}
                  </span>
                </div>
                <p className={`msg_data_text ${isYou ? 'flex-end-color' : '' }`}>
                  {message.message}
                </p>
              </div>
            </div>
          )
        })}
      </section>
      <form onSubmit={sendHandler} className="send_section">
        <input
          placeholder="Type a message..."
          className="msg_input"
          value={inpValue}
          onChange={inputHandler}
        />
        <button className={`msg_button ${inpValue.trim() ? 'msg_button_show' : ''}`} type="submit" disabled={!inpValue.trim()} >
          <i className="material-icons msg_button_icon">
            send
          </i>
        </button>
      </form>
    </div>
  );
};

export default Messagefield;
