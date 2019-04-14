import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {authenticate} from '../actions/userAction.js';
import {withRouter} from 'react-router-dom';
import {update_userinfo, socket} from '../api';
import Header from './Header';
import SidebarGeneral from './SidebarGeneral';
import '../styles/profile.css';
import '../styles/base.css';

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            status: '',
            new_password: '',
            conf_password: '',
            message: ''
        };

        this.handleClick = this
            .handleClick
            .bind(this);
        this.handleChange = this
            .handleChange
            .bind(this);
    }

    componentDidMount() {
        socket.on('update_flag', updateInfo => {
            if (updateInfo.type === 'success') {
                console.log('User info updated successfully!');
                this.setState({message: 'User info updated successfully!'});
            } else if (updateInfo.type === 'fail') {
                console.log('Update failed!');
                this.setState({message: 'Update failed!'});
            }
        });
    }

    handleClick() {
        update_userinfo({
            username: this.props.username,
            nusername: this.state.new_username,
            email: this.props.email,
            psw: this.state.password,
            npsw: this.state.new_password,
            cpsw: this.state.conf_password
        });
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        return (
            <div className='overflow-hidden'>
                <Header title='User Profile'/>

                <div className='row full'>

                    <div className='col-sm-3'>
                        <SidebarGeneral/>
                    </div>

                    <div className='col-sm-9'>
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
                                    <p>{this.state.message}</p>
                                </div>

                                <div>
                                    <button className='update-button' onClick={this.handleClick}>
                                        Update
                                    </button>
                                </div>
                            </div>
                        </div>
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
