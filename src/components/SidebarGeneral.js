import React from 'react';
import '../styles/sidebar.css';
import SidebarStats from './SidebarStats.js';

class SidebarGeneral extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className="sidebar-container">
                <span>SidebarGeneral</span>
                <SidebarStats/>
            </div>
        );
    }
}

export default SidebarGeneral;
