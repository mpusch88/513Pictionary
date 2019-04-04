import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import Login from '../components/Login';
import AppRoot from '../components/AppRoot';
import GameRoom from '../components/GameRoom';
import AdminHome from '../components/AdminHome';


// import { subscribeToTimer } from '../api';

class AppRouter extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        timestamp: 'no timestamp yet'
    };

    render() {
        return (
            <div>
                <Switch>

                    <Route path='/' component={Login} exact={true}/>
                    <Route path='/login' component={Login} exact={true}/>
                    <Route path='/Game' component={GameRoom} exact={true}/>
                    <Route path='/Admin' component={AdminHome} exact={true}/>

                    <UserRoute
                        path="/:type"
                        component={AppRoot}
                        auth={{
                            status: 'LoggedIn'
                        }}
                        exact={true} />

                </Switch>
            </div>
        );
    }
}

const UserRoute = ({
    component: Component,
    auth,
    ...rest
}) => {
    return (
        <Route
            {...rest}
            render={(props) => {
            return (!!auth && (auth.status === 'LoggedIn'))
                ? (<Component {...props}/>)
                : (<Redirect
                    to={{
                    pathname: '/login',
                    state: {
                        from: props.location
                    }
                }}/>);
        }}/>
    );
};

export {AppRouter as default};
