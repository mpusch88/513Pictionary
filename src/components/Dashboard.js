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
import {getCategories,joinOrcreateRoom, getRoomInfo} from '../api';
import { withRouter } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import SearchIcon from '@material-ui/icons/Search'
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';



const styles = theme =>({
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

    table: {
        minWidth: 600,
        marginTop: 200
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: '#009',
        },
    },

    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing.unit * 2,
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit * 3,
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
});

const CustomTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 16,
    },
}))(TableCell);



const ListItem = ({ id, name, category, capacity, onClick }) => (

        <TableRow className={styles.row} key={id}>
            <CustomTableCell component="th" scope="row">
                {name}
            </CustomTableCell>
            <CustomTableCell align="right">{category}</CustomTableCell>
            <CustomTableCell align="right">{capacity}</CustomTableCell>
            <CustomTableCell align="right">
                <Button variant="outlined" color="primary" onClick={onClick}>
                    Join Room
                </Button>
            </CustomTableCell>
        </TableRow>


);

const List = ({ items, onItemClick }) => (

            items.map((item, i) =>
                <ListItem id={item.id} name={item.name} category={item.category} capacity={item.capacity} onClick={onItemClick} />)

);



class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogOpen: false,
            categories: [''],
            roomList: [],
            roomCategory: '',
            newRoomName: '',
            currentRoomId: '',
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
        let roomList = this.state.roomList;
        if(this.state.newRoomName && this.state.roomCategory){
            joinOrcreateRoom({id: '', newRoomName: this.state.newRoomName,
                roomCategory: this.state.roomCategory});

            getRoomInfo({id: '', newRoomName: this.state.newRoomName,
                roomCategory: this.state.roomCategory}, info => {

                let nextState = roomList.concat({id: info.id,
                    name: this.state.newRoomName,
                    category: this.state.roomCategory,
                    capacity: info.capacity});

                this.setState({ roomList: nextState});

            })

            this.setState({ dialogOpen: false });
        }

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

        console.log(roomList);
        return (
            <div>
                <Header/>
            <div>

                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon />
                    </div>
                    <InputBase
                        placeholder="Search…"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                    />
                </div>
                <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                    Create New Game Room
                </Button>
            </div>
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
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <CustomTableCell>Room Name</CustomTableCell>
                                <CustomTableCell align="right">Game Category</CustomTableCell>
                                <CustomTableCell align="right">Capacity</CustomTableCell>
                                <CustomTableCell align="right"></CustomTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <List items={roomList} onItemClick={this.handleJoinRoomClick} />
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }
}


Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Dashboard));
