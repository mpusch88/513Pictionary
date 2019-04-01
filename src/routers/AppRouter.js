import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import Login from '../components/Login';
import AppRoot from '../components/AppRoot';
import GameRoom from '../components/GameRoom';

class AppRouter extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <div>
                <Switch>

                    <Route path='/' component={Login} exact={true}/>
                    <Route path='/login' component={Login} exact={true}/>
                    <Route path='/Game' component={GameRoom} exact={true}/>

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
