import React from 'react';
import '../styles/stats.css';
import {connect} from 'react-redux';
import {update_userhistory} from '../api';

class SidebarStats extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
	}
	
	componentDidMount() {
        let sendData = {username: this.props.username};
        update_userhistory(sendData, ans => {
            
		});
	}

    render() {
        return (
            <div className="stats-container">
                <span>SidebarGeneral</span>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {username: state.username};
};

export default connect(mapStateToProps)(SidebarStats);