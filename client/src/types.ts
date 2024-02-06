export interface User {
    userName: string;
    id: string;
    socketID: string | undefined;
};
  
export interface Message {
    userName: string;
    message: string;
    time: string;
    id: string;
};