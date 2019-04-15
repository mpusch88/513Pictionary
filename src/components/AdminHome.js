import React from 'react';
import Header from './Header';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {getCategories, checkIfCategoryExists, saveNewCategoryOrWord} from '../api';
import {withRouter} from 'react-router-dom';
import DialogWindow from './DialogWindow';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    },
    dense: {
        marginTop: 50
    },
    menu: {
        width: 200
    },

    button: {
        justifySelf: 'center',
        margin: 25
    },
    input: {
        display: 'none'
    }
});

class AdminHome extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [''],
            currentCategory: '',
            isExistingDisabled: false,
            isNewDisabled: false,
            newCatVal: '',
            word: '',
            showConfirmDialog: false,
            dialogMessage: ''
        };
    }

    componentDidMount() {
        getCategories(data => {
            if (data) {
                this.setState({
                    categories: this
                        .state
                        .categories
                        .concat(data)
                });
            }
        });
    }

    timer = null


    // adding new category to db
    handleNewCategory = event => {
        clearTimeout(this.timer);
        let value = event.target.value;
        this.setState({newCatVal: value});

        this.timer = setTimeout(() => {
        }, 1000);

        if (!value) {
            this.setState({isExistingDisabled: false, isNewDisabled: false});
        } else {
            this.setState({isExistingDisabled: true, isNewDisabled: false});
        }
    };


    handleCategoryChange = event => {
        this.setState({currentCategory: event.target.value});


        if (!event.target.value) {
            this.setState({isExistingDisabled: false, isNewDisabled: false});
        } else {
            this.setState({isExistingDisabled: false, isNewDisabled: true});
        }
    };

    handleWordChange = event => {
        this.setState({word: event.target.value});
    };

    saveForm = () => {

        if ((this.state.currentCategory || this.state.newCatVal) && this.state.word) {

            if (this.state.newCatVal) {
                checkIfCategoryExists(this.state.newCatVal, data => {

                    if (data.error === 'Category Already Exists') {
                        this.toggleModal();
                        this.showDialogMessage('Category Already exists');
                    }

                    return;
                });
            }


            saveNewCategoryOrWord({
                existingCategory: this.state.currentCategory,
                newCategory: this.state.newCatVal,
                word: this.state.word
            });

            this.toggleModal();

            if (this.state.currentCategory && this.state.word) {
                this.showDialogMessage('New word was successfully added');
            } else if (this.state.newCatVal && this.state.word) {
                this.showDialogMessage('New category and word was successfully added');
            }

            this.handleClear();
            this.setState({isExistingDisabled: false, isNewDisabled: false});
        }

    };



    toggleModal = () => {
        this.setState({
            showConfirmDialog: !this.state.showConfirmDialog
        });
    };

    showDialogMessage = (data) => {
        this.setState({dialogMessage: data});
    };

    handleClear = () => {

        this.setState({currentCategory: '', newCatVal: '', word: ''});
    };
    render() {
        const {classes} = this.props;
        const categories = this.state.categories;

        return (
            <div>
                <Header title='Admin Home' hideProfileItem={true}/>
                <form className={classes.container} noValidate autoComplete="off">
                    <TextField
                        id="filled-select-category"
                        select
                        label="Select an existing game category"
                        className={classes.textField}
                        value={this.state.currentCategory}
                        disabled={(this.state.isExistingDisabled)}
                        onChange={this
                        .handleCategoryChange
                        .bind(this)}
                        SelectProps={{
                        MenuProps: {
                            className: classes.menu
                        }
                    }}
                        helperText="Please select an existing category or enter a new one below"
                        margin="normal"
                        fullWidth
                        variant="filled">
                        {categories.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        id="filled-bare-new"
                        label="Enter a new game category"
                        value={this.state.newCatVal}
                        style={{
                        margin: 10
                    }}
                        placeholder="e.g Animal"
                        fullWidth
                        margin="normal"
                        variant="filled"
                        disabled={(this.state.isNewDisabled)}
                        onChange={this.handleNewCategory}
                        InputLabelProps={{
                        shrink: true
                    }}/>
                    <TextField
                        id="filled-bare"
                        label="Enter a play word"
                        value={this.state.word}
                        style={{
                        margin: 10
                    }}
                        placeholder="e.g Cat"
                        fullWidth
                        margin="normal"
                        variant="filled"
                        onChange={this.handleWordChange}
                        InputLabelProps={{
                        shrink: true
                    }}/>
                    <Button
                        variant="outlined"
                        onClick={this.saveForm}
                        color="primary"
                        className={classes.button}>
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        className={classes.button}
                        onClick={this.handleClear}>
                        Clear
                    </Button>
                </form>
                <DialogWindow
                    message={this.state.dialogMessage}
                    show={this.state.showConfirmDialog}
                    onClose={this.toggleModal}/>
            </div>
        );
    }
}

AdminHome.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(AdminHome));
