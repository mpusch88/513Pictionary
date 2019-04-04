import React from 'react';
import Header from './Header';
import SketchComponent from '../components/SketchComponent'
import Users from '../components/Users'
import Chat from '../components/Chat';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';


class GameRoom extends React.Component {

    constructor(props) {
        super(props);


    }
    render() {

        return (
            <div>
                <Header/>
                <SketchComponent/>
                <Chat/>
            </div>
        );
    }
}


export default GameRoom;