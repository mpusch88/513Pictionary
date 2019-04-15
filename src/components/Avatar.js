import React from 'react';
import {connect} from 'react-redux';
import avatar1 from '../resources/avatars/1.jpg';
import avatar2 from '../resources/avatars/2.jpg';
import avatar3 from '../resources/avatars/3.jpg';
import avatar4 from '../resources/avatars/4.jpg';
import avatar5 from '../resources/avatars/5.jpg';
import avatar6 from '../resources/avatars/6.jpg';
import avatar7 from '../resources/avatars/7.jpg';
import avatar8 from '../resources/avatars/8.jpg';
import avatar9 from '../resources/avatars/9.jpg';
import avatar10 from '../resources/avatars/10.jpg';
import '../styles/avatar.css';


// this component is used for rendering the avatar on side bar for profile page and dashboard
class Avatar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        if (this.props.avatar == 0) {
            return (
                <img src={avatar1} className='avatar'></img>
            );

        } else if (this.props.avatar == 1) {
            return (
                <img src={avatar2} className='avatar'></img>
            );

        } else if (this.props.avatar == 2) {
            return (
                <img src={avatar3} className='avatar'></img>
            );

        } else if (this.props.avatar == 3) {
            return (
                <img src={avatar4} className='avatar'></img>
            );

        } else if (this.props.avatar == 4) {
            return (
                <img src={avatar5} className='avatar'></img>
            );

        } else if (this.props.avatar == 5) {
            return (
                <img src={avatar6} className='avatar'></img>
            );

        } else if (this.props.avatar == 6) {
            return (
                <img src={avatar7} className='avatar'></img>
            );

        } else if (this.props.avatar == 7) {
            return (
                <img src={avatar8} className='avatar'></img>
            );

        } else if (this.props.avatar == 8) {
            return (
                <img src={avatar9} className='avatar'></img>
            );

        } else if (this.props.avatar == 9) {
            return (
                <img src={avatar10} className='avatar'></img>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {avatar: state.avatar};
};

export default connect(mapStateToProps)(Avatar);
