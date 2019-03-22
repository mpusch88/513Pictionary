import React from 'react';
import {connect} from 'react-redux';
import {setEmail, authenticate} from '../actions/userAction.js';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'example@email.com',
            password: 'password'
        };

        this.save = this
            .save
            .bind(this);
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

    save() {
        this
            .props
            .dispatch(setEmail(this.state.email));
    }

    handleClick(e) {
        e.preventDefault();

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
                    <span>513Pictionary</span>
                    <span>Sign In Below!</span>
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
                            <span>
                                <span onClick={this.handleForgotPassword}>Forgot Password?</span>
                            </span>
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
