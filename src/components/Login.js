import React from 'react';
import {connect} from 'react-redux';
import {authenticate} from '../actions/userAction.js';
import '../styles/login.css';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'example@email.com',
            password: 'password'
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

    handleClick(e) {
        e.preventDefault();
        console.log(JSON.stringify(this.state));

        let user = {
            email: this.state.email,
            password: this.state.password
        };

        this
            .props
            .dispatch(authenticate(user))
            .then(() => {
                this
                    .props
                    .history
                    .push('/landing');
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
            <div>
                <div>
                    <span className='title'>513Pictionary</span>
                    <span className='gap'>Sign In Below!</span>
                </div>
                <div>
                    <form>
                        <div>
                            <span>Email</span>
                            <input
                                type='text'
                                name='email'
                                onChange={this.handleChange}
                                value={this.state.email}/>
                        </div>

                        <div>
                            <span>Password</span>
                            <input
                                type='password'
                                name='password'
                                onChange={this.handleChange}
                                value={this.state.password}/>
                        </div>

                        <div>
                            <button onClick={this.handleClick}>
                                Log In
                            </button>
                        </div>

                        <div>
                            <button onClick={this.handleForgotPassword}>Forgot Password?</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log(state);
    return {email: state.email, password: state.password, user: state.user};
};

export default connect(mapStateToProps)(Login);
