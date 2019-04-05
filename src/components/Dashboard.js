import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Header from "./Header";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import {getCategories,joinOrcreateRoom} from '../api';
import { withRouter } from 'react-router-dom';



const styles = {
    button: {
        width: 100, height: 100,
        padding: 0
    },
    icon: {

    },
    leftIcon: {
        marginRight: 20,
        fontSize:50,
        color:'#fffff'
    },

    textField: {
        marginLeft: 2,
        marginRight: 2,
    },
    dense: {
        marginTop: 50,
    },
    menu: {
        width: 200,
    },

    listItem:{

    }
};

const ListItem = ({ value, onClick }) => (
    <li className={styles.listItem}>{value}
        <Button variant="outlined" onClick={onClick} color="primary">
           Join Room
        </Button>

    </li>
);

const List = ({ items, onItemClick }) => (
    <ul>
        {
            items.map((item, i) => <ListItem key={i} value={item} onClick={onItemClick} />)
        }
    </ul>
);



class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogOpen: false,
            categories: [''],
            roomList: [],
            roomCategory: '',
            newRoomName: ''
        };


    }

    componentDidMount() {
        getCategories(data => {
            if(data) {
                this.setState({categories: this.state.categories.concat(data)});
            }
        });
    }

    handleCategorySelect =  event => {
        this.setState({
            roomCategory: event.target.value,
        });

    };

    handleRoomName =  event => {
        this.setState({
            newRoomName: event.target.value,
        });

    };


    handleClickOpen = () => {
        this.setState({ dialogOpen: true });
    };

    handleClose = () => {
        this.setState({ dialogOpen: false });
    };

    createNewRoom = () => {
        if(this.state.newRoomName && this.state.roomCategory){
            joinOrcreateRoom({id: '', newRoomName: this.state.newRoomName,
                roomCategory: this.state.roomCategory});
        }

        let roomList = this.state.roomList;
        const nextState = [...roomList, this.state.newRoomName];
        this.setState({ roomList: nextState, newRoomName: '' });

        this.setState({ dialogOpen: false });

    };


    handleJoinRoomClick = (e) => {

        console.log(e.target.innerHTML)
        let { history } = this.props;
        history.push({
            pathname: '/Game'
        });

    };



    render() {
        const { classes } = this.props;
        const { roomList} = this.state;

        return (
            <div>
                <Header/>
            <div>Landing page - Welcome!</div>

                <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                    Open form dialog
                </Button>
                <Dialog
                    open={this.state.dialogOpen}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Create New Room</DialogTitle>
                    <DialogContent>
                        <form  autoComplete="off">
                        <TextField
                            value={this.state.newRoomName}
                            required
                            autoFocus
                            margin="dense"
                            id="roomName"
                            label="Enter a room name"
                            onChange={this.handleRoomName}
                            fullWidth
                        />
                            <TextField
                                id="filled-select-category"
                                select
                                required
                                label="Choose a game Category"
                                className={classes.textField}
                                value={this.state.roomCategory}
                                onChange={this.handleCategorySelect.bind(this)}
                                SelectProps={{
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}
                                margin="normal"
                                fullWidth
                                variant="outlined"
                            >
                                {this.state.categories.map((option, index) => (
                                    <MenuItem key={index} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}

                            </TextField>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.createNewRoom} color="primary">
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>
                <div>
                    <List items={roomList} onItemClick={this.handleJoinRoomClick} />
                </div>
            </div>
        );
    }
}


Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Dashboard));
