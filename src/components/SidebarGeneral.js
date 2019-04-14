import React from 'react';
import Avatar from './Avatar';
import {connect} from 'react-redux';
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

const mapStateToProps = (state) => {
    return {username: state.username};
};

export default connect(mapStateToProps)(SidebarGeneral);
