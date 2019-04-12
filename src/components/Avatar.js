import React from 'react';
import '../styles/avatar.css';

class Avatar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className="avatar-container">
                <span>Avatar</span>
            </div>
        );
    }
}

export default Avatar;
