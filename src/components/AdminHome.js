import React from 'react';
import Header from "./Header";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


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

const categories = [
    {
        value: 'Animal',
        label: 'Animal',
    },
    {
        value: 'Movie',
        label: 'Movie',
    },
    {
        value: 'Body Parts',
        label: 'Body Parts',
    },
    {
        value: 'Objects',
        label: 'Objects',
    },
];

class AdminHome extends React.Component {
    state = {
        category: 'Create a new Category',
    };

    handleChange = name => event => {
        this.setState({
            category: event.target.value,
        });
    };

    render() {
        const { classes } = this.props;

        return (
            <div>
            <Header/>
            <form className={classes.container} noValidate autoComplete="off">
                <TextField
                    id="filled-bare"
                    label="Enter a game category"
                    style={{ margin: 8 }}
                    placeholder="e.g Animal"
                    fullWidth
                    margin="normal"
                    variant="filled"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <TextField
                    id="filled-select-category"
                    select
                    label="Select a game category"
                    className={classes.textField}
                    value={this.state.categories}
                    onChange={this.handleChange('category')}
                    SelectProps={{
                        MenuProps: {
                            className: classes.menu,
                        },
                    }}
                    helperText="Please select an existing category of choose a new one"
                    margin="normal"
                    fullWidth
                    variant="filled"
                >
                    {categories.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    id="filled-bare"
                    label="Enter a play word"
                    style={{ margin: 8 }}
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
