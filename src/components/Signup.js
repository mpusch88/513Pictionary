import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {authenticate} from '../actions/userAction.js';
import '../styles/login.css';
import {withRouter} from 'react-router-dom';
import {send_signupinfo, socket} from '../api';
import logo from '../resources/logo.png';
import DialogWindow from './DialogWindow';

class Signup extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            message: '',
            username: '',
            email: '',
            password: '',
            showConfirmDialog: false,
            dialogMessage: ''
        };

        this.handleClick = this
            .handleClick
            .bind(this);
        this.handleChange = this
            .handleChange
            .bind(this);
        this.handleGoBack = this
            .handleGoBack
            .bind(this);
        // this.handleForgotPassword = this     .handleForgotPassword     .bind(this);
    }

    componentDidMount() {
        socket.on('signup_flag', loginInfo => {
            let userType = loginInfo.type
                ? loginInfo.type
                : '';
            console.log(loginInfo);

            this
                .props
                .authenticate(userType, loginInfo.username);
            if (loginInfo.type === 'taken') {
                this.setState({message: 'username taken'});
            } else if (loginInfo.type === 'signed') {
                this.toggleModal();
                this.showDialogMessage('Account created successfully');

            } else if (loginInfo.type === 'email') {
                this.setState({message: 'invalid email format'});
            } else if (loginInfo.type === 'empty') {
                this.setState({message: 'Please fill all the fields'});
            }
        });
    }

    handleGoBack() {
        let {history} = this.props;
        history.push({pathname: '/'});
    }

    handleClick() {
        send_signupinfo({username: this.state.username, email: this.state.email, psw: this.state.password});
    }

    toggleModal = () => {
        this.setState({
            showConfirmDialog: !this.state.showConfirmDialog
        });

    };

    showDialogMessage = (data) => {
        this.setState({dialogMessage: data});
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleDialogClose = () => {
        this.toggleModal();
        let {history} = this.props;
        history.push({pathname: '/'});
    }

    render() {
        return (
            <div className='login-outer'>
                <div className='login-container'>
                    <div className='titles'>
                        <span className='title'>513Pictionary</span>
                        <span className='subtitle'>Sign In Below!</span>
                    </div>

                    <div>
                        <h1>Let the journey begin</h1>
                    </div>

                    <img src={logo} className="logo" alt="logo"/>

                    <div className='input-group-signup'>
                        <span className='input-text-label'>User Name</span>
                        <input
                            className='input-field'
                            type='text'
                            name='username'
                            onChange={this.handleChange}
                            value={this.state.username}/>
                    </div>

                    <div className='input-group-signup'>
                        <span className='input-text-label'>Email</span>
                        <input
                            className='input-field'
                            type='text'
                            name='email'
                            onChange={this.handleChange}
                            value={this.state.email}/>
                    </div>

                    <div className='input-group-signup'>
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
                        <button className='login-button-signup' onClick={this.handleClick}>
                            Sign Up
                        </button>
                    </div>

                    <div>
                        <button className='login-button-signup' onClick={this.handleGoBack}>
                            Back
                        </button>
                    </div>

                </div>
                <DialogWindow
                    message={this.state.dialogMessage}
                    show={this.state.showConfirmDialog}
                    title={'Congradulations!'}
                    onClose={this.handleDialogClose}/>
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

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Signup));
