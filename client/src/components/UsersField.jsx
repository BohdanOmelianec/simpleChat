import React, {useState} from 'react';

const Usersfield = ({users}) => {
    const [isOpen, setOpen] = useState(true);

    const menuHandler = () => setOpen(state => !state)

    window.addEventListener('resize', () => {
        if(window.innerWidth <= 500) {
            setOpen(false)
        } else {
            setOpen(true)
        }
    })

    return (
        <div className={`users_container ${isOpen ? '': 'hide-users'}`} >
            <div className='users_container_btn' onClick={menuHandler}>
                <i className="material-icons">
                    {isOpen ? 'close' : 'menu'}
                </i>
            </div>
            <p className='users_container_online'>Users online <b>({users ? users.length : 0})</b></p>
            <hr className='users_container_horizontal' />
            {users.map((value) => (
                <div key={value} className='user_info'>
                    <i className="material-icons user_info_logo">
                        person
                    </i>
                    <div className='user_info_name'>{value[1]}</div>
                </div>
            ))}
        </div>
    );
}

export default Usersfield;
