import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Home from '@material-ui/icons/HomeOutlined';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import compose from 'recompose/compose';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {socket} from '../api';
import {Link} from 'react-router-dom';
import {authenticate} from '../actions/userAction.js';
import {bindActionCreators} from 'redux';
import $ from 'jquery';

const styles = {
    root: {
        flexGrow: 1
    },
    grow: {
        flexGrow: 1
    },
    menuButton: {
        marginLeft: -10,
        marginRight: 15
    }
};

class Header extends React.Component {
    state = {
        auth: true,
        anchorEl: null
    };

    handleMenu = event => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleClose = () => {
        this.setState({anchorEl: null});
    };

    handleProfile = () => {
        this.setState({anchorEl: null});
        let {history} = this.props;
        history.push({pathname: '/Profile'});
    };

    handleLogout = () => {
        this.setState({anchorEl: null});
        this
            .props
            .authenticate('', '');

        $.cookie('user_name', '');
        $.cookie('user_type', '');
        let {history} = this.props;
        history.push({pathname: '/Login'});
        //socket.emit('disconnect');
    };

    render() {
        const {classes} = this.props;
        const {anchorEl} = this.state;
        const open = Boolean(anchorEl);

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>

                        <IconButton
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="Home"
                            component={Link}
                            to={this.props.userType === 'user'
                            ? '/Dashboard'
                            : '/Admin'}>
                            <Home/>
                        </IconButton>

                        <Typography variant="h9" color="inherit" className={classes.grow}>
                            {this.props.home
                                ? this.props.home
                                : '513Pictionary'}
                        </Typography>

                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            {this.props.title}
                        </Typography>

                        <div>
                            <Typography variant="h9" color="inherit" className={classes.grow}>
                                signed in as {this.props.username}
                            </Typography>
                        </div>

                        <div>
                            <IconButton
                                aria-owns={open
                                ? 'menu-appbar'
                                : undefined}
                                aria-haspopup="true"
                                onClick={this.handleMenu}
                                color="inherit">
                                <AccountCircle/>
                            </IconButton>

                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                                transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                                open={open}
                                onClose={this.handleClose}>
                                <MenuItem hidden={this.props.hideProfileItem} onClick={this.handleProfile}>Profile</MenuItem>
                                <MenuItem onClick={this.handleLogout}>Log out</MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {username: state.username, userType: state.userType};
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
        authenticate: authenticate
    }, dispatch);
};

export default compose(withStyles(styles), connect(mapStateToProps, matchDispatchToProps))(withRouter(Header));
