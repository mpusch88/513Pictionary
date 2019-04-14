import React from 'react';
import Header from './Header';
import SketchComponent from '../components/SketchComponent';
import TimerProgressBar from './TimerProgressBar';
import Chat from './Chat';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {changeGameState, updateUserList} from '../actions/userAction.js';
import {removeCurrentRoom} from '../actions/dashBoardAction';
import {withRouter} from 'react-router-dom';
import {leaveRoom, socket, setAnswer} from '../api';
import compose from 'recompose/compose';
import SidebarGame from './SidebarGame';
import '../styles/sidebar.css';

class GameRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            setUpFlg: false,
            curDrawer: '',
            isDrawer: false,
            wasDrawer: false,
            cdFlg: false,
            newRound: false,
            gameProgress: 'notReady', //ready, start
            userList: []
        };

        this.gameReady = this
            .gameReady
            .bind(this);
    }

    componentDidMount() {
        socket.on('entireUserList', userList => {
            this.setState({userList: userList});
            this.props.updateUserList(this.state.userList);

            if (!this.state.setUpFlg) {
                this.setState({setUpFlg: true});
                if (userList[0].username === this.props.username) {
                    // set myself to drawer
                    console.log(this.props.username + ' is the drawer');
                    this.setState({curDrawer: this.props.username});
                    this.updateUserStat(this.state.curDrawer, true, null, null);
                } else {
                    this.setState({curDrawer: userList[0].username});
                    this.updateUserStat(this.state.curDrawer, true, null, null);
                    console.log(this.state.curDrawer + ' is the drawer');
                }
            }
        });

        socket.on('newReadyPlayer', username => {
            let tmp = this.state.userList;
            tmp.forEach(function (ele) {
                if (ele.username === username)
                    ele.isReady = true;
                }
            );
            this.setState({userList: tmp});
            this.props.updateUserList(this.state.userList);
            console.log(username + ' is ready');

            //check for all the uesrs ready status in the uesrlist
            if (this.allUsersReady()) {
                this.setState({gameProgress: 'start'});
                this
                    .props
                    .changeGameState('start');
                // start the timer
                this.gameStart();
            }
        });
    }

    updateUserStat(username, isDrawer, score, avatarId){
        // search for the username in the userlist
        let i;
        let tmp = this.state.userList;
        for(i=0; i<this.state.userList.length; i++){
            if(this.state.userList[i].username === username){
                break;
            }
        }
        if(i>=this.state.userList.length)return;
        if(isDrawer !== null){
            tmp[i].isDrawer = isDrawer;
            if(isDrawer === true){  // set other to non drawer
                for(let j=0; j<tmp.length; j++){
                    if(j !== i) tmp[j].isDrawer = false;
                }
            }
        }
        if(score !== null) tmp[i].score = score;
        if(avatarId !== null) tmp[i].avatarId = avatarId;
        this.setState({userList: tmp});
        this.props.updateUserList(this.state.userList);
    }

    nextDrawer() {
        console.log('calc nextDrawer');
        for (let i = 0; i < this.state.userList.length; i++) {
            console.log(i + ': ' + this.state.userList[i].username);
            if (this.state.curDrawer === this.state.userList[i].username) {
                this.setState({
                    curDrawer: this.state.userList[i + 1].username
                });
                this.updateUserStat(this.state.curDrawer, true, null, null);

                if (this.state.curDrawer === this.props.username) {
                    this.setState({isDrawer: true});
                } else
                    this.setState({isDrawer: false});

                break;
            }
        }

        console.log('next drawer is ' + this.state.curDrawer);
    }

    gameStart() {
        socket.emit('gameIsStarted', this.props.currentRoomId);

        this.setState({newRound: false});
        if (this.props.username === this.state.curDrawer) {
                    console.log('enable pad!');
                    this.setState({isDrawer: true});
        }
        this.startCountdown();
    }


    startCountdown() {
        this.setState({cdFlg: true});
        if(this.state.isDrawer ===  true){
            this.setState({isDrawer: false});
            this.setState({wasDrawer: true});
        }
        console.log("Before Current Drawer");
        if(this.state.wasDrawer){
            let sendData = {category : this.props.currentRoomCategory, roomId : this.props.currentRoomId};
            console.log("Current Drawer");
            setAnswer(sendData, ans => {
                console.log(ans);
                this.setState({
                    currentAnswer: ans
                });
            });
        }
        this.triggerCountdown();
    }

    countdownFinish = () => {
        this.setState({cdFlg: false});
        if(this.state.wasDrawer === true){
            this.setState({isDrawer: true});
            this.setState({wasDrawer: false});
        }
        this.triggerTimer();
    }

    restartRound = () => {
        // TODO: check it game ends
        console.log('restartRound entry!');
        console.log('cur drawer: ', this.state.curDrawer);
        console.log('userList: ', this.state.userList);
        console.log('last user in the user list:', this.state.userList[this.state.userList.length - 1]);

        if (this.state.curDrawer === this.state.userList[this.state.userList.length - 1].username) {
            console.log('game ends');
            // end game
            socket.emit('gameIsEnded', this.props.currentRoomId);
            this.setState({setUpFlg: false});
            this.setState({gameProgress: 'notReady'});
            this.clearReadyState();

            console.log(this.state.userList[0].username + ' is the drawer of next game');
            this.setState({curDrawer: this.state.userList[0].username});
            this.updateUserStat(this.state.curDrawer, true, null, null);
            this.setState({isDrawer: false});
        } else {
            this.setState({newRound: true});
            this.nextDrawer();
            this.setState({newRound: true});
            this.startCountdown();
        }
    };

    clearReadyState() {
        let tmp = this.state.userList;
        tmp.forEach(function (ele) {
            ele.isReady = false;
        });
        this.setState({userList: tmp});
        this.props.updateUserList(this.state.userList);
    }

    setUserToReady(username) {
        let tmp = this.state.userList;
        tmp.forEach(function (ele) {
            if (ele.username === username)
                ele.isReady = true;
            }
        );
        this.setState({userList: tmp});
    }

    gameReady() {
        this.setUserToReady(this.props.username);
        socket.emit('imReady', {
            username: this.props.username,
            roomId: this.props.currentRoomId
        });

        //check for all the uesrs ready status in the uesrlist
        if (this.allUsersReady()) {
            this.setState({gameProgress: 'start'});
            this
                .props
                .changeGameState('start');
            // start the timer
            this.gameStart();
        } else {
            this.setState({gameProgress: 'ready'});
            this
                .props
                .changeGameState('ready');
        }
    }

    allUsersReady() {
        if (this.state.userList.length > 1) { //at least two
            let flag = true;
            this
                .state
                .userList
                .forEach(function (ele) {
                    if (!ele.isReady) {
                        flag = false;
                    }
                });
            return flag;
        }
        return false;
    }

    leaveRoom = () => {
        leaveRoom({id: this.props.currentRoomId});
        this
            .props
            .removeCurrentRoom();

        console.log('leaving game room' + this.props.currentRoomId);
        let {history} = this.props;
        history.push({pathname: '/Dashboard'});
    };

    // a little complicated to explain check out this:
    // https://stackoverflow.com/a/45582558
    triggerTimer = () => {};
    triggerCountdown = () => {};

    render() {
        const {gameProgress} = this.state;
        return (
            <div>
                <Header
                    home={'Room: ' + this.props.currentRoomName}
                    title={'Lets play words in category ' + this
                    .props
                    .currentRoomCategory
                    .toUpperCase() + '!'}/>
                <div className='row full'>

                    <div className='col-2'>
                        <SidebarGame users={this.state.userList}/>
                    </div>

                    <div className='col-10'>

                            <TimerProgressBar
                                restartTrigger={this.restartRound}
                                setReadyTrigger={func => this.triggerTimer = func}
                                setCountdownTrigger={func => this.triggerCountdown = func}
                                countdownFinishTrigger={this.countdownFinish}
                                cdFlg={this.state.cdFlg}
                                ansFlg={this.state.wasDrawer || this.state.isDrawer}
                                ans={this.state.currentAnswer}
                            />
                            <SketchComponent drawFlg={this.state.isDrawer}/>
                            {gameProgress === 'notReady'
                                ? <div>
                                        <button onClick={this.gameReady}>Ready</button>
                                        <button onClick={this.leaveRoom}>LEAVE GAME ROOM</button>
                                    </div>
                                : ''
}
                            <Chat ansFlg = {gameProgress !== 'notReady' && (this.startCountdown.wasDrawer || this.state.isDrawer)}/>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        gameState: state.gameState,
        currentRoomId: state.currentRoomId,
        currentRoomCategory: state.currentRoomCategory,
        currentRoomName: state.currentRoomName,
        username: state.username,
        userList: state.userList
    };
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
        changeGameState: changeGameState,
        removeCurrentRoom: removeCurrentRoom,
        updateUserList: updateUserList
    }, dispatch);
};

export default compose(connect(mapStateToProps, matchDispatchToProps))(withRouter(GameRoom));
