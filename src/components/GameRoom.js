import React from 'react';
import Header from "./Header";
import SketchComponent from '../components/SketchComponent';
import TimerProgressBar from './TimerProgressBar';
import Chat from './Chat';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {changeGameState} from '../actions/userAction.js';
import {removeCurrentRoom} from "../actions/dashBoardAction";
import { withRouter } from 'react-router-dom';

import {game_myReady, leaveRoom} from '../api';
import compose from "recompose/compose";


 class GameRoom extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            gameProgress: 'notReady',  //ready, waiting, start, roundEnd, gameEnd
            myUserInfo: {
                username: 'myDefault',
                score: 0,
                isDrawer: false,
                index: 0
            },
            userList: []
        };

        this.gameReady = this.gameReady.bind(this);
    }

    gameReady() {
        this.setState({gameProgress: 'ready'});
        this.props.changeGameState('ready');
        game_myReady(this.state.myUserInfo.username);
    }

    leaveRoom = () =>{
        leaveRoom({id: this.props.currentRoomId});
        this.props.removeCurrentRoom ();

        console.log("leaving game room" + this.props.currentRoomId)
        let { history } = this.props;
        history.push({
            pathname: '/Dashboard'
        });

    };

    render() {
        const { gameProgress } = this.state;
        return (
            <div>
                <Header />
                <TimerProgressBar/>
                <SketchComponent/>
                <button onClick={this.gameReady}>Ready</button>
                <button onClick={this.leaveRoom}>LEAVE GAME ROOM</button>
                <Chat/>

                {/*{*/}
                    {/*gameProgress === 'ready' ?*/}
                    {/*<div>*/}
                        {/*<TimerProgressBar/>*/}
                        {/*<SketchComponent gameFlg={'ready'}/>*/}
                    {/*</div> :*/}
                    {/*<div>*/}
                        {/*<TimerProgressBar/>*/}
                        {/*<SketchComponent gameFlg={'notReady'}/>*/}
                        {/*<button onClick={this.gameReady}>Ready</button>*/}
                    {/*</div>*/}
                {/*}*/}
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {gameState: state.gameState,
            currentRoomId: state.currentRoomId};
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
        changeGameState: changeGameState,
        removeCurrentRoom: removeCurrentRoom
    }, dispatch);
};


export default compose(
    connect(mapStateToProps, matchDispatchToProps)
)(withRouter(GameRoom))

