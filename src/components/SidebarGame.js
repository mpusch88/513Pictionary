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
import BlockOutlined from '@material-ui/icons/BlockOutlined';
import compose from "recompose/compose";
import {connect} from "react-redux";
import {leaveRoom} from "../api";





const styles = theme => ({
    root: {
        flex: 1,

        width: '100%'
    },


    list:{
        width: '100%',
    },


    title: {
        color:'#ffffff',
        align: 'center',
        margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`,
    },

    userName: {
        fontSize: 22,
        fontFamily: 'Verdana',
        color:'#ffffff',
    },

    score: {
        fontSize: 15,
        color:'purple',
    },

    avatar: {
        margin: 10,
        width: 30,
        height: 30,
    },

    avatarBackground: {
        backgroundColor: 'purple'
    },

    avatarDrawer: {
        backgroundColor: 'green'
    }
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

        this.state = { }

    }


     listItems = (userList) =>

         userList.map((userInfo) =>
         <ListItem>
             <ListItemAvatar>
                 <Avatar className={ this.props.isDrawerToggled  && this.props.username === userInfo.username ? this.props.classes.avatarDrawer : null}>
                         <Avatar className={this.props.classes.avatar} src={"images/" + userInfo.avatarId + ".jpg"}/>
                 </Avatar>
             </ListItemAvatar>
             <ListItemText classes={{ primary: this.props.classes.userName, secondary: this.props.classes.score}}
                           primary={userInfo.username}
                           secondary={'Score: ' + userInfo.score}
             />
             {/*{ this.props.isCurrentRoomHost && this.props.username !== userInfo.username &&*/}
             {/*<ListItemSecondaryAction onClick={this.removeUserFromRoom(userInfo.username)}>*/}
                 {/*<IconButton aria-label="Delete">*/}
                     {/*<BlockOutlined />*/}
                 {/*</IconButton>*/}
             {/*</ListItemSecondaryAction>}*/}
         </ListItem>
    );



    render() {
        const { classes } = this.props;
        console.log(this.props.userList)
        return (
            <div className="sidebar-container ">
                    <Typography variant="h6" className={classes.title}>
                        Users
                    </Typography>
                    <div className={classes.root}>
                        <List className={classes.list}>
                            {this.listItems(this.props.userList)}
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
        currentRoomId: state.currentRoomId,
        isCurrentRoomHost: state.isCurrentRoomHost
    };
};

export  default compose(withStyles(styles), connect(mapStateToProps))(SidebarGame);


