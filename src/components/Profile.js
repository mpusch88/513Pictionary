import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {authenticate} from '../actions/userAction.js';
import {withRouter} from 'react-router-dom';
import {update_userinfo} from '../api';
import Header from './Header';
import SidebarGeneral from './SidebarGeneral';
import Avatar from './Avatar';
import '../styles/profile.css';
import '../styles/sidebar.css';
import '../styles/avatar.css';

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            status: '',
            new_password: '',
            conf_password: ''
        };

        this.handleClick = this
            .handleClick
            .bind(this);
        this.handleChange = this
            .handleChange
            .bind(this);
    }

    handleClick() {
        update_userinfo({
            username: this.props.username,
            nusername: this.state.new_username,
            email: this.props.email,
            psw: this.state.password,
            npsw: this.state.new_password,
            cpsw: this.state.conf_password
        }, updateInfo => {

            if (updateInfo.type === 'success') {
                console.log('User info updated successfully!');
                let {history} = this.props;
                alert('Updated successfully!');
                history.push({pathname: '/Dashboard'});
            } else if (updateInfo.type === 'fail') {
                console.log('Log in failed!');
                alert('Update failed!');
                let {history} = this.props;
                history.push({pathname: '/'});
            }
        });
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        return (
            <div>
                <Header title='User Profile'/>

                <div className='row full'>

                    <div className='col-lg-2'>
                        <SidebarGeneral/>
                    </div>

                    <div className='col-lg-8'>
                        <div className='profile-outer'>
                            <div className='profile-container'>

                                <span className='desc'>Modify your account password below!</span>
                                <div className='status'>{this.state.status}</div>

                                <div className='input-group'>
                                    <span className='input-text-label'>User Name</span>
                                    <span className='input-text-label'>{this.props.username}</span>
                                </div>

                                <div className='input-group'>
                                    <span className='input-text-label'>Email</span>
                                    <span className='input-text-label'>{this.props.email}</span>
                                </div>

                                <div className='input-group'>
                                    <span className='input-text-label'>Current Password</span>
                                    <input
                                        className='input-field'
                                        type='password'
                                        name='password'
                                        onChange={this.handleChange}
                                        value={this.state.password}/>
                                </div>

                                <div className='input-group'>
                                    <span className='input-text-label'>New Password</span>
                                    <input
                                        className='input-field'
                                        type='password'
                                        name='new_password'
                                        onChange={this.handleChange}
                                        value={this.state.new_password}/>
                                </div>

                                <div className='input-group'>
                                    <span className='input-text-label'>Confirm Password</span>
                                    <input
                                        className='input-field'
                                        type='password'
                                        name='conf_password'
                                        onChange={this.handleChange}
                                        value={this.state.conf_password}/>
                                </div>

                                <div>
                                    <button className='update-button' onClick={this.handleClick}>
                                        Update
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='col-lg-2'>
                        <Avatar />
                    </div>

                </div>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {userType: state.userType, username: state.username, email: state.email};
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
        authenticate: authenticate
    }, dispatch);
};

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Profile));
