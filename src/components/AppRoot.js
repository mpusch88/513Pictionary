import React from 'react';
import {connect} from 'react-redux';
import Landing from './Landing';

// could add something like the following (and compdidmount) to pre-populate
// an active user/gameRoom list.
// import {getUsers} from '../actions/userAction';

class AppRoot extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    // componentDidMount() {
    //     this.setState(() => {
    //         return {isUpdating: true};
    //     });

    //     // let testPromise = this
    //     //     .props
    //     //     .dispatch(getUsers());

    //     Promise
    //         .all([testPromise])
    //         .then(() => {
    //             this.setState(() => {
    //                 return {isUpdating: false};
    //             });
    //         });
    // }

    render() {
        let type = this.props.match.params.type;
        let id = this.props.match.params.id;

        // let sidebar = <Sidebar/>;    // this stays here
        // <div className="nav-side-container">{sidebar}</div> // re-add in return below if needed

        //  add new page IDs below

        return (
            <div>

                <div className="content-container">

                    {(type === 'landing') && (<Landing userId={id} />)}

                </div>
            </div>
        );
    }
}

export default connect()(AppRoot);
