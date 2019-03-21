import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import Login from '../components/Login';
import Landing from '../components/Landing';

class AppRouter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Switch>
                    <Route path='/' component={Login} exact={true}/>
                    <Route path='/login' component={Login} exact={true}/>

                    <UserRoute
                        path="/:type"
                        component={Landing}
                        auth={{
                        userStatus: 'LoggedIn'
                    }}
                        exact={true}/>
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
            return ((!!auth && (auth.userType === 'Lawyer'))
                ? (<Component {...props}/>)
                : (<Redirect
                    to={{
                    pathname: '/login',
                    state: {
                        from: props.location
                    }
                }}/>));
        }}/>
    );
};

export {AppRouter as default};
