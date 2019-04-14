import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Login from '../components/Login';
import GameRoom from '../components/GameRoom';
import Profile from '../components/Profile';
import requireAuth from '../components/requireAuth';
import {connect} from 'react-redux';
import Signup from '../components/Signup';
import Dashboard from '../components/Dashboard';
import AdminHome from '../components/AdminHome';

class AppRouter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Switch>
                    <Route path='/' component={Login} exact={true}/>
                    <Route path='/Login' component={Login} exact={true}/>
                    <Route path='/Signup' component={Signup} exact={true}/>
                    <Route path='/Game' component={requireAuth(GameRoom, false)} exact={true}/>
                    <Route path='/Profile' component={requireAuth(Profile, false)} exact={true}/>
                    <Route
                        path='/Dashboard'
                        component={requireAuth(Dashboard, false)}
                        exact={true}/>
                    <Route path='/Admin' component={requireAuth(AdminHome, true)} exact={true}/>
                </Switch>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {userType: state.userType};
};

export default connect(mapStateToProps)(AppRouter);
