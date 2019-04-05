import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {authenticate} from '../actions/userAction.js';
import '../styles/login.css';
import {withRouter} from 'react-router-dom';

import {send_loginfo} from '../api';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'email@email.com',
            password: '12345'
        };

        this.handleClick = this
            .handleClick
            .bind(this);
        this.handleChange = this
            .handleChange
            .bind(this);
        this.handleForgotPassword = this
            .handleForgotPassword
            .bind(this);
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
                .authenticate(userType, loginInfo.username);
            if (loginInfo.type === 'user') {
                console.log('user logged in successful');
                let {history} = this.props;
                history.push({pathname: '/Dashboard'});
            } else if (loginInfo.type === 'admin') {
                console.log('admin logged in successful');
                let {history} = this.props;
                history.push({pathname: '/Admin'});
            } else if (loginInfo.type === 'fail') {
                alert('Invalid email or password!');
                let {history} = this.props;
                history.push({pathname: '/'});
                console.log('failed to log in');
            }
        });
    }

    handleForgotPassword(e) {
        e.preventDefault();
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
