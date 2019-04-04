import React from 'react';
import { withRouter } from 'react-router';
import {connect} from "react-redux";
import Login from '../components/Login';


export default function requireAuth(Component, adminOnly) {

    class AuthenticatedComponent extends React.Component {

        constructor(){
            super();
            this.state ={
                showComponent: false,
            }

        }

        componentDidMount() {
            this.checkAuth();
        }

        checkAuth() {
            console.log("inside" + this.props.userType);
            if (this.props.userType === 'user' && !adminOnly) {
                // const location = this.props.location;
                // const redirect = location.pathname + location.search;
                //
                // this.props.router.push(`/login?redirect=${redirect}`);

               this.setState({showComponent: true});

            }else if (this.props.userType === 'admin' && adminOnly){
                this.setState({showComponent: true});
            }
        }

        render() {
            var bool = this.state.showComponent;
            return bool
                ? <Component />
                : <Login />;
        }


    }

    const mapStateToProps = (state) => {
        return {userType: state.userType}
    };

    return connect(mapStateToProps)(withRouter(AuthenticatedComponent));
}