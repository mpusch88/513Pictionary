import React from 'react';
import {connect} from 'react-redux';
import Dashboard from './Dashboard';

// could add something like the following (and compdidmount) to pre-populate
// an active user/gameRoom list.
// import {getUsers} from '../actions/userAction';

class AppRoot extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        let type = this.props.match.params.type;
        let id = this.props.match.params.id;

        return (
            <div>
                <div>
                    {(type === 'landing') && (<Dashboard userId={id} />)}
                </div>
            </div>
        );
    }
}

export default connect()(AppRoot);
