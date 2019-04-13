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

class Avatar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        
        // console.log(this.props.avatar);
        // var avatar = new Image();

        // if (this.props.avatar === 1) {
        //     avatar.src = '../resources/avatars/1.jpg';
        // } else if (this.props.avatar === 2) {
        //     avatar = avatar2;
        // }

        return (
            <div className="avatar-container">
                <span>Avatar</span>
                <img src={avatar10} className='avatar'></img>
            </div>
        );
    }
}

// const mapStateToProps = (state) => {
//     return {avatar: state.avatar};
// };

// export default connect(mapStateToProps)(Avatar);

export default Avatar;
