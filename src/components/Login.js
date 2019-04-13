import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {authenticate} from '../actions/userAction.js';
import '../styles/login.css';
import {withRouter} from 'react-router-dom';
import {send_loginfo} from '../api';
import logo from '../resources/logo.png';
import $ from 'jquery';
// eslint-disable-next-line no-unused-vars
import {cookie} from 'jquery.cookie';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'user1@example.com',
            password: '12345',
            message: ''
        };

        this.handleClick = this
            .handleClick
            .bind(this);
        this.handleClickSignUp = this
            .handleClickSignUp
            .bind(this);
        this.handleChange = this
            .handleChange
            .bind(this);

        // get the cookie
        let myName = $.cookie('user_name');
        let myType = $.cookie('user_type');
        let myEmail = $.cookie('user_email');
        let myAvatar = $.cookie('user_avatar');

        if (myName && myType) { // has logged in before, route to dashboard/admin page
            if (myType === 'user') {
                this
                    .props
                    .authenticate(myType, myName, myEmail, myAvatar);
                console.log('user reconnected successful');
            } else if (myType === 'admin') {
                this
                    .props
                    .authenticate(myType, myName, myEmail, myAvatar);
                console.log('admin reconnected successful');
            } else if (myType === 'fail') {
                this
                    .props
                    .authenticate(myType, myName, myEmail);
                this.setState({message: 'Invalid username or password'});
            }
        }
    }

    handleClickSignUp() {
        let {history} = this.props;
        history.push({pathname: '/Signup'});
    }

    handleClick() {
        send_loginfo({
            email: this.state.email,
            psw: this.state.password
        }, loginInfo => {

            let userType = loginInfo.type
                ? loginInfo.type
                : '';

            this
                .props
                .authenticate(userType, loginInfo.username, loginInfo.email);

            if (loginInfo.type === 'user') {
                console.log('user logged in successful');
                let {history} = this.props;
                history.push({pathname: '/Dashboard'});
                $.cookie('user_name', loginInfo.username);
                $.cookie('user_type', loginInfo.type);
                $.cookie('user_email', loginInfo.email);
                $.cookie('user_avatar', loginInfo.avatar);
            } else if (loginInfo.type === 'admin') {
                console.log('admin logged in successful');
                let {history} = this.props;
                history.push({pathname: '/Admin'});
                $.cookie('user_name', loginInfo.username);
                $.cookie('user_type', loginInfo.type);
                $.cookie('user_email', loginInfo.email);
                $.cookie('user_avatar', loginInfo.avatar);
            } else if (loginInfo.type === 'fail') {
                let {history} = this.props;
                history.push({pathname: '/'});
                this.setState({message: 'Invalid email or password!'});
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
            <div className='login-outer'>
                <div className='login-container'>
                    <div className='titles'>
                        <span className='title'>513Pictionary</span>
                        <span className='subtitle'>Sign In Below!</span>
                    </div>

                    <img src={logo} className="logo" alt="logo"/>

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
                        <p>{this.state.message}</p>
                    </div>

                    <div>
                        <button className='login-button' onClick={this.handleClick}>
                            Log In
                        </button>
                    </div>

                    <div>
                        <button className="login-button" onClick={this.handleClickSignUp}>
                            Sign Up
                        </button>
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

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Login));
