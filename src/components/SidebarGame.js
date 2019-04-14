import React from 'react';
import '../styles/sidebar.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import avatar2 from '../resources/avatars/1.jpg';
import DeleteIcon from '@material-ui/icons/Delete';
import compose from "recompose/compose";
import {connect} from "react-redux";





const styles = theme => ({
    root: {
        flexGrow: 1,
        maxWidth: 752,
    },
    demo: {
        color:'#ffffff'
    },
    title: {
        color:'#ffffff',
        margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`,
    },

    userName: {
        color:'#ffffff',
    },

    avatar: {
        margin: 10,
        width: 40,
        height: 40,
    },
});

function generate(element) {
    return [0, 1, 2,3,4,5].map(value =>
        React.cloneElement(element, {
            key: value,
        }),
    );
}



class SidebarGame extends React.Component {
    constructor(props) {
        super(props);

        this.state = {dense: false,
            secondary: false,
            userList: [{username: 'mary', score: 10},
                {username: 'jason', score: 10},
                {username: 'cammy', score: 14},
                {username: 'noah', score: 10},]};

    }



     listItems = (userList) => userList.map((userInfo) =>
         <ListItem>
             <ListItemAvatar>
                 <Avatar>
                     <Avatar  src={avatar2} />
                 </Avatar>
             </ListItemAvatar>
             <ListItemText
                           primary={userInfo.username}
                           secondary={userInfo.score}
             />
             { this.props.isCurrentRoomHost && <ListItemSecondaryAction>
                 <IconButton aria-label="Delete">
                     <DeleteIcon />
                 </IconButton>
             </ListItemSecondaryAction>}
         </ListItem>
    );



    render() {
        const { classes } = this.props;
        const { dense, secondary} = this.state;

        //console.log(this.props.users);
        return (
            <div className="sidebar-container ">
                    <Typography variant="h6" className={classes.title}>
                        Users
                    </Typography>
                    <div className={classes.demo}>
                        <List dense='false'>
                            {this.listItems(this.state.userList)}
                        </List>
                    </div>

            </div>
        );
    }
}

SidebarGame.propTypes = {
    classes: PropTypes.object.isRequired,
};


const mapStateToProps = (state) => {
    return {
        avatar: state.avatar,
        username: state.username,
        isCurrentRoomHost: state.isCurrentRoomHost
    };
};

export  default compose(withStyles(styles), connect(mapStateToProps))(SidebarGame);



//export default SidebarGame;
