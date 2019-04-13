import React from 'react';
import '../styles/avatar.css';
import avatar1 from '../resources/avatars/1.jpg';
class Avatar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className="avatar-container">
                <span>Avatar</span>
                <img src={avatar1} className='avatar'></img>
            </div>
        );
    }
}

export default Avatar;
