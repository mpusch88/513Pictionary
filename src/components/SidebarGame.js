import React from 'react';
import '../styles/sidebar.css';

class SidebarGame extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className="sidebar-container">
                <span>SidebarGame</span>
            </div>
        );
    }
}

export default SidebarGame;
