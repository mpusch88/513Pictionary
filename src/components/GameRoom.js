import React from 'react';
import Header from './Header';
import SketchComponent from '../components/SketchComponent';
import TimerProgressBar from './TimerProgressBar';
import Chat from './Chat';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {changeGameState} from '../actions/userAction.js';
import {removeCurrentRoom} from '../actions/dashBoardAction';
import { withRouter } from 'react-router-dom';

import {game_myReady, leaveRoom, getNewUserJoin, getUserList} from '../api';
import {game_otherReady} from '../api';
import compose from 'recompose/compose';


 class GameRoom extends React.Component {
    constructor(props) {
        super(props);
        game_otherReady(username => this.setUserToReady(username));

        this.state = {
            gameProgress: 'notReady', //ready, start, roundEnd, gameEnd
            myUserInfo: {
                username: this.props.username,
                score: 0,
                isDrawer: false,
                isReady: false
            },
            userList: []
        };

        this.setState({userList: this.state.userList.push(this.state.myUserInfo)});

        this.gameReady = this
            .gameReady
            .bind(this);
    }

    componentDidMount() {
        getNewUserJoin( userInfo => {

            console.log('User joined room as :' + userInfo.username);
            this.setState({userList: this.state.userList.push(userInfo)});

            console.trace(this.state.userList);
        });

        getUserList( { id: this.props.currentRoomId}, userList => {
            console.log('UserList' + userList)
            this.setState({userList: this.state.userList.concat(userList)});
        });
    }

    // a little complicated to explain
    // check out this:  https://stackoverflow.com/a/45582558
    triggerTimer = () => {};

    setUserToReady(username){
        let tmp = this.state.userList;
        tmp.forEach(function(ele){
            if(ele.username === username)ele.isReady = true;
        });
        this.setState({userList: tmp});
    }

    gameReady() {
        console.log(this.state.userList);
        // emit ready event to server
        game_myReady({toomIdthis: this.props.currentRoomId, username: this.state.myUserInfo.username});

        this.setUserToReady(this.state.myUserInfo.username);

        //check for all the uesrs ready status in the uesrlist
        if(this.allUsersReady()){
            this.setState({gameProgress: 'start'});
            this.props.changeGameState('start');
            // start the timer
            this.triggerTimer();
        }else {
            this.setState({gameProgress: 'ready'});
            this.props
                .changeGameState('ready');
        }

    }

    allUsersReady() {
        if(this.state.userList.length > 1){    //at least two
            this.state.userList.forEach(function(ele){
                if(!ele.isReady)return false;
            });
            return true;
        }
        return false;
    }

    leaveRoom = () => {
        leaveRoom({id: this.props.currentRoomId});
        this.props.removeCurrentRoom ();

        console.log('leaving game room' + this.props.currentRoomId);
        let { history } = this.props;
        history.push({
            pathname: '/Dashboard'
        });

    };

    render() {
        const {gameProgress} = this.state;
        return (
            <div>
                <Header home={'Room: ' + this.props.currentRoomName}
                        title={'Lets play words in category '+ this.props.currentRoomCategory.toUpperCase() + '!'}/>
                <TimerProgressBar setReadyTrigger={func => this.triggerTimer = func}/>
                <SketchComponent/>
                {
                    gameProgress === 'notReady' ?
                        <div><button onClick={this.gameReady}>Ready</button></div> :
                        ''
                }

                <button onClick={this.leaveRoom}>LEAVE GAME ROOM</button>
                <Chat/>
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {gameState: state.gameState,
            currentRoomId: state.currentRoomId,
            currentRoomCategory: state.currentRoomCategory,
    currentRoomName: state.currentRoomName,
    username: state.username};
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
        changeGameState: changeGameState,
        removeCurrentRoom: removeCurrentRoom
    }, dispatch);
};

export default compose(
    connect(mapStateToProps, matchDispatchToProps)
)(withRouter(GameRoom));
