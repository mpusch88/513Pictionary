import React from 'react';
import '../styles/sidebar.css';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import compose from 'recompose/compose';
import {connect} from 'react-redux';

const styles = theme => ({
    root: {
        flex: 1,
        width: '100%'
    },
    list: {
        width: '100%'
    },
    title: {
        color: '#ffffff',
        align: 'center',
        margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`
    },
    userName: {
        fontSize: 22,
        fontFamily: 'Verdana',
        color: '#ffffff'
    },
    score: {
        fontSize: 15,
        color: 'purple'
    },
    avatar: {
        margin: 10,
        width: 30,
        height: 30
    },
    avatarBackground: {
        backgroundColor: 'purple'
    },
    avatarDrawer: {
        backgroundColor: 'green'
    }
});


//Component to show userList on Game room
class SidebarGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {userList: []};
    }


    componentDidMount() {

        this.props.updateUserList(this.getList())
    }



    getList = () => {
        return (
            <List className={this.props.classes.list}>
                {this.listItems(this.props.userList)}
            </List>
        )
    }



    listItems = (userList) => userList.map((userInfo) => <ListItem key={userInfo.username}>
        <ListItemAvatar>
            <Avatar
                className={userInfo.isDrawer
                ? this.props.classes.avatarDrawer
                : null}>
                <Avatar
                    className={this.props.classes.avatar}
                    src={'images/' + userInfo.avatarId + '.jpg'}/>
            </Avatar>
        </ListItemAvatar>
        <ListItemText
            classes={{
            primary: this.props.classes.userName,
            secondary: this.props.classes.score
        }}
            primary={userInfo.username}
            secondary={'Score: ' + userInfo.score}/>
    </ListItem>);

    render() {
        const {classes} = this.props;

        return (
            <div className="sidebar-container text-center">
                <Typography variant="h6" className={classes.title}>
                    Users
                </Typography>
                <div className={classes.root}>
                    {this.getList()}
                </div>
            </div>
        );
    }
}

SidebarGame.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        avatar: state.avatar,
        username: state.username,
        currentRoomId: state.currentRoomId,
        isCurrentRoomHost: state.isCurrentRoomHost,
        userList: state.userList

    };
};

export  default compose(withStyles(styles), connect(mapStateToProps))(SidebarGame);


