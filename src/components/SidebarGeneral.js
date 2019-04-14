import React from 'react';
import Avatar from './Avatar';
import {connect} from 'react-redux';
import '../styles/sidebar.css';

class SidebarGeneral extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className="sidebar-container text-center">
                <div className='profile_title'>{this.props.username}</div>
                <div className='avatar_area'><Avatar/></div>
                <div className='stats_area'>Stats</div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {username: state.username};
};

export default connect(mapStateToProps)(SidebarGeneral);
