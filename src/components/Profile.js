import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {authenticate} from '../actions/userAction.js';
import {withRouter} from 'react-router-dom';
import {update_userinfo} from '../api';
import Header from './Header';
import '../styles/profile.css';

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            status: ''
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
            username: this.state.username,
            email: this.state.email,
            psw: this.state.password
        }, updateInfo => {

            if (updateInfo.type === 'success') {
                console.log('User info updated successfully!');
                let {history} = this.props;
                history.push({pathname: '/Dashboard'});
            } else if (updateInfo.type === 'fail') {
                alert('Update failed!');
                let {history} = this.props;
                history.push({pathname: '/'});
                console.log('failed to log in');
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
                <div className='profile-outer'>
                    <div className='profile-container'>

                        <span className='desc'>Modify your account info here!</span>
                        <div className='status'>{this.state.status}</div>

                        <div className='input-group'>
                            <span className='input-text-label'>User Name</span>
                            <input
                                className='input-field'
                                type='text'
                                name='username'
                                onChange={this.handleChange}
                                value={this.state.username}/>
                        </div>

                        <div className='input-group'>
                            <span className='input-text-label'>Email</span>
                            <input
                                className='input-field'
                                type='text'
                                name='email'
                                onChange={this.handleChange}
                                value={this.state.email}/>
                        </div>

                        <div className='input-group'>
                            <span className='input-text-label'>Password</span>
                            <input
                                className='input-field'
                                type='password'
                                name='password'
                                onChange={this.handleChange}
                                value={this.state.password}/>
                        </div>

                        <div>
                            <button className='update-button' onClick={this.handleClick}>
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {userType: state.userType};
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
        authenticate: authenticate
    }, dispatch);
};

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Profile));
