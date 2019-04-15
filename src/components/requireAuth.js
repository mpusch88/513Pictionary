import React from 'react';
import {connect} from 'react-redux';
import Login from '../components/Login';

export default function requireAuth(Component, adminOnly) {

    class AuthenticatedComponent extends React.Component {

        constructor() {
            super();
            this.state = {
                showComponent: false
            };

        }

        componentDidMount() {
            this.checkAuth();
        }


        // function that checks the user is of right type to view a page
        checkAuth() {

            if (this.props.userType === 'user' && !adminOnly) {

                this.setState({showComponent: true});

            } else if (this.props.userType === 'admin' && adminOnly) {
                this.setState({showComponent: true});
            }
        }

        render() {
            var bool = this.state.showComponent;
            return bool
                ? <Component/>
                : <Login/>;
        }

    }

    const mapStateToProps = (state) => {
        return {userType: state.userType};
    };

    return connect(mapStateToProps)(AuthenticatedComponent);
}