import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {authenticate} from '../actions/userAction.js';
import '../styles/login.css';
import {withRouter} from 'react-router-dom';
import {send_loginfo} from '../api';
import logo from '../resources/logo.png';

import $ from 'jquery';
import {cookie} from 'jquery.cookie';
import {socket} from '../api';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'email@email.com',
            password: 'qwerty'
        };

        this.handleClick = this
            .handleClick
            .bind(this);
        this.handleChange = this
            .handleChange
            .bind(this);

        // get the cookie
        let myName = $.cookie('user_name');
        let myType = $.cookie('user_type');
        if(myName && myType){   // has logged in before, route to dashboard/admin page
            if(myType === 'user'){
                this
                    .props
                    .authenticate(myType, myName);
                console.log('user reconnected successful');
                let {history} = this.props;
                history.push({pathname: '/Dashboard'});
            }else if(myType === 'admin'){
                this
                    .props
                    .authenticate(myType, myName);
                console.log('admin reconnected successful');
                let {history} = this.props;
                history.push({pathname: '/Admin'});
            }
        }

    }

    handleClick() {
        send_loginfo({
            email: this.state.email,
            psw: this.state.password
        }, loginInfo => {

            let userType = loginInfo.type
                ? loginInfo.type
                : '';
            console.log(loginInfo);

            this
                .props
                .authenticate(userType, loginInfo.username, loginInfo.email);

            if (loginInfo.type === 'user') {
                console.log('user logged in successful');
                let {history} = this.props;
                history.push({pathname: '/Dashboard'});
                $.cookie('user_name', loginInfo.username);
                $.cookie('user_type', loginInfo.type);
            } else if (loginInfo.type === 'admin') {
                console.log('admin logged in successful');
                let {history} = this.props;
                history.push({pathname: '/Admin'});
                $.cookie('user_name', loginInfo.username);
                $.cookie('user_type', loginInfo.type);
            } else if (loginInfo.type === 'fail') {
                alert('Invalid email or password!');
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
                        <button className='login-button' onClick={this.handleClick}>
                            Log In
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
