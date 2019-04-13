import React from 'react';
import '../styles/sidebar.css';

class SidebarGeneral extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className="sidebar-container">
                <span>SidebarGeneral</span>
            </div>
        );
    }
}

export default SidebarGeneral;
