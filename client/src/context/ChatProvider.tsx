import React, { useState, useEffect, createContext } from "react";
import socket from "../socket/socket";
import { socketEvents } from "../socket/socketEvents";
import { Message, User } from "../types";


interface DefaultValues {
  users: User[];
  messages: Message[];
  createRoom: (userId: string) => void;
}

const defaultValues: DefaultValues = {
    users: [],
    messages: [],
    createRoom: (userId: string) => {}
}
export const ChatContext = createContext(defaultValues);

const ChatProvider = ({ children }: React.PropsWithChildren) => {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const createRoom = (userId: string) => {
    socket.emit(socketEvents.room.joining, userId);
  }

  useEffect(() => {
    const updateUsers = (newUsers: User[]) => {
      setUsers(newUsers);
    };

    const disconectUser = (newUsers: User[]) => {
      setUsers(newUsers);
    }

    const updateMessages = (newMessages: Message[]) => {
      setMessages(newMessages);
    }

    socket.on(socketEvents.user.connected, updateUsers);
    socket.on(socketEvents.user.disconnected, disconectUser);
    socket.on(socketEvents.message.sent, updateMessages);

    socket.on(socketEvents.room.joined, (data) => {
      console.log(data)
    })

    return () => {
      socket.off(socketEvents.user.connected, updateUsers);
      socket.off(socketEvents.user.disconnected, updateUsers);
      socket.off(socketEvents.message.sent, updateMessages);
    };
  }, [])

  const value = {
      users,
      messages,
      createRoom,
  }

  return (
      <ChatContext.Provider value={value}>
          {children}
      </ChatContext.Provider>
  )
}

export default ChatProvider;