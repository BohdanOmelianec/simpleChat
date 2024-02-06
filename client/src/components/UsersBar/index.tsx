import { useState, useContext, ChangeEvent } from 'react';
import { ChatContext } from '../../context/ChatProvider';
import { AuthContext } from '../../context/AuthProvider';
import './users.scss';

const UsersBar = () => {
    const { users, createRoom } = useContext(ChatContext);
    const { currentUser } = useContext(AuthContext);
    const [search, setSearch] = useState("");

    const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
      };

    return (
        <div className="users_container" >
            <div className="users_header">
                <h1>Simple chat</h1>
                <div className="settings_button">
                    <i className="material-icons">
                        settings
                    </i>
                </div>
            </div>
            <div className="users_section">
                <input
                    type="search"
                    name="search"
                    placeholder="Search..."
                    className="users_search"
                    value={search}
                    onChange={inputHandler}
                />
                <div className='users_status'>
                    <span></span>
                    <b>Online ({users.length})</b>
                </div>
                {users.map((user) => (
                    <div
                        key={user.id}
                        onClick={() => createRoom(user.id)}
                        className={`user_info ${user.userName === currentUser?.userName ? 'active-user' : ''}`}
                    >
                        <i className="material-icons user_info_logo">
                            person
                        </i>
                        <div className={`user_info_name`}>{user.userName}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UsersBar;
