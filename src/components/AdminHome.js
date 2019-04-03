import React from 'react';
import Header from "./Header";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {getCategories, checkIfCategoryExists} from '../api';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: 100,
        justifyContent: 'center', /*centers items on the line (the x-axis by default)*/
        alignItems: 'center',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    dense: {
        marginTop: 50,
    },
    menu: {
        width: 200,
    },

    button: {
        justifySelf:'center',
        margin: 25,
    },
    input: {
        display: 'none',
    },
});


class AdminHome extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            categories: [''],
            currentCategory:'',
            isExistingDisabled: false,
            isNewDisabled: false,
        };

    }

    componentDidMount() {
        console.log("previous state :" + this.state.categories);
        getCategories(data => {
            if(data) {
                this.setState({categories: this.state.categories.concat(data)});
            }
        });
    }

    timer = null

    handleNewCategory = event => {
        clearTimeout(this.timer);
        let value = event.target.value;
        this.timer = setTimeout(() => { this.triggerChange(value) }, 1000);
        this.setState( {isExistingDisabled: true, isNewDisabled: false} );
    }

    triggerChange = (targetValue) => {
        checkIfCategoryExists(targetValue, data =>{
            console.log(data)
        });
    }

    handleCategoryChange =  event => {
        this.setState({
            currentCategory: event.target.value,
        });
        console.log("current value " + event.target.value)
        if(!event.target.value) {
            console.log("inside")
            this.setState({isExistingDisabled: true, isNewDisabled: false});
        }else{
            this.setState({isExistingDisabled: false, isNewDisabled: true});
        }
    };



    render() {
        const { classes } = this.props;
        const categories = this.state.categories;
        console.log(this.state.categories);
        return (
            <div>
            <Header/>

            <form className={classes.container} noValidate autoComplete="off">

                <TextField
                    id="filled-select-category"
                    select
                    label="Select an existing game category"
                    className={classes.textField}
                    value={this.state.currentCategory}
                    disabled = {(this.state.isExistingDisabled)}
                    onChange={this.handleCategoryChange.bind(this)}
                    SelectProps={{
                        MenuProps: {
                            className: classes.menu,
                        },
                    }}
                    helperText="Please select an existing category or enter a new one below"
                    margin="normal"
                    fullWidth
                    variant="filled"
                >
                    {categories.map((option, index) => (
                        <MenuItem key={index} value={option}>
                            {option}
                        </MenuItem>
                    ))}

                </TextField>

                <TextField
                    id="filled-bare-new"
                    label="Enter a new game category"
                    style={{ margin: 10 }}
                    placeholder="e.g Animal"
                    fullWidth
                    margin="normal"
                    variant="filled"
                    disabled = {(this.state.isNewDisabled)}
                    onChange={this.handleNewCategory}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />


                <TextField
                    id="filled-bare"
                    label="Enter a play word"
                    style={{ margin: 10 }}
                    placeholder="e.g Cat"
                    fullWidth
                    margin="normal"
                    variant="filled"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Button variant="outlined" color="primary" className={classes.button}>
                   Save
                </Button>
                <Button variant="outlined" color="primary" className={classes.button}>
                    Clear
                </Button>


            </form>
            </div>
        );
    }
}

AdminHome.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AdminHome);
