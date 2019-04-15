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
import '../styles/base.css';


// this component contains all the inside game UI elements and logic for front end
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
            userList: [],
            clearFlg: false
        };

        this.gameReady = this
            .gameReady
            .bind(this);
    }

    componentDidMount() {
        socket.on('entireUserList', userList => {
            this.setState({userList: userList});
            this
                .props
                .updateUserList(this.state.userList);

            if (!this.state.setUpFlg && userList.length > 0) {
                this.setState({setUpFlg: true});

                if (userList[0].username === this.props.username) {
                    // set myself to drawer

                    this.setState({curDrawer: this.props.username});
                    this.updateUserStat(this.state.curDrawer, true, null, null);
                } else {
                    this.setState({curDrawer: userList[0].username});
                    this.updateUserStat(this.state.curDrawer, true, null, null);

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
            this
                .props
                .updateUserList(this.state.userList);



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

        socket.on('newScoreUpdate', data => {
            this.updateUserStat(data.username, null, data.score, null);
        });
    }

    updateUserStat(username, isDrawer, score, avatarId) {
        // search for the username in the userlist
        let i;
        let tmp = this.state.userList;

        for (i = 0; i < this.state.userList.length; i++) {
            if (this.state.userList[i].username === username) {
                break;
            }
        }

        if (i >= this.state.userList.length) {
            return;
        }

        if (isDrawer !== null) {
            tmp[i].isDrawer = isDrawer;
            if (isDrawer === true) { // set other to non drawer
                for (let j = 0; j < tmp.length; j++) {
                    if (j !== i)
                        tmp[j].isDrawer = false;
                    }
                }
        }

        if (score !== null) {
            tmp[i].score = score;
        }

        if (avatarId !== null) {
            tmp[i].avatarId = avatarId;
        }

        this.setState({userList: tmp});
        this
            .props
            .updateUserList(tmp);
    }

    nextDrawer() {


        for (let i = 0; i < this.state.userList.length; i++) {


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

    }

    gameStart() {
        socket.emit('gameIsStarted', this.props.currentRoomId);

        this.setState({newRound: false});

        if (this.props.username === this.state.curDrawer) {

            this.setState({isDrawer: true});
        }

        this.startCountdown();
    }

    startCountdown() {
        this.setState({clearFlg: true});

        this.setState({cdFlg: true});

        if (this.state.isDrawer === true) {
            this.setState({isDrawer: false});
            this.setState({wasDrawer: true});
        }


        if (this.state.wasDrawer) {
            let sendData = {
                category: this.props.currentRoomCategory,
                roomId: this.props.currentRoomId
            };



            setAnswer(sendData, ans => {

                this.setState({currentAnswer: ans});
            });
        }

        this.triggerCountdown();
    }

    countdownFinish = () => {
        this.setState({clearFlg: false});

        this.setState({cdFlg: false});

        if (this.state.wasDrawer === true) {
            this.setState({isDrawer: true});
            this.setState({wasDrawer: false});
        }

        this.triggerTimer();
    }

    findScoreByName(username){
        return this.state.userList.forEach(function(ele){
            if(ele.username === username){
                return ele.score;
            }
        });
    }

    clearAllScore() {
        let tmp = this.state.userList;
        tmp.forEach(function(ele){
            ele.score = 0;
        });
        this.setState({userList: tmp});
    }

    restartRound = () => {
        // TODO: check it game ends


        if (this.state.curDrawer === this.state.userList[this.state.userList.length - 1].username) {


            // end game
            socket.emit('gameIsEnded', {
                roomId: this.props.currentRoomId,
                username: this.props.username,
                score: this.findScoreByName(this.props.username)
            });
           // this.clearAllScore();
            this.setState({setUpFlg: false});
            this.setState({gameProgress: 'notReady'});
            this.clearReadyState();


            this.setState({curDrawer: this.state.userList[0].username});
            this.updateUserStat(this.state.curDrawer, true, null, null);
            this.setState({isDrawer: false});
            this.props.updateUserList(this.state.userList);
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
        this
            .props
            .updateUserList(this.state.userList);
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

        //check for all the users ready status in the uesrlist
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
        leaveRoom({id: this.props.currentRoomId, username: this.props.username});
        this
            .props
            .removeCurrentRoom();

        let {history} = this.props;
        history.push({pathname: '/Dashboard'});
    };

    // a little complicated to explain check out this:
    // https://stackoverflow.com/a/45582558
    triggerTimer = () => {};
    triggerCountdown = () => {};
    triggerSideBarUpdate = () => {};

    render() {
        const {gameProgress} = this.state;
        return (
            <div className='overflow-hidden'>

                <Header
                    home={'Room: ' + this.props.currentRoomName}
                    title={'Lets play words in category ' + this
                    .props
                    .currentRoomCategory
                    .toUpperCase() + '!'}/>

                <div className='row full'>

                    <div className='col-sm-3'>
                        <SidebarGame
                            updateUserList={func => this.triggerSideBarUpdate = func}
                            isDrawerToggled={this.state.isDrawer || this.state.wasDrawer}/>
                    </div>

                    <div className='col-sm-6 '>
                        <TimerProgressBar
                            restartTrigger={this.restartRound}
                            setReadyTrigger={func => this.triggerTimer = func}
                            setCountdownTrigger={func => this.triggerCountdown = func}
                            countdownFinishTrigger={this.countdownFinish}
                            cdFlg={this.state.cdFlg}
                            ansFlg={this.state.wasDrawer || this.state.isDrawer}
                            ans={this.state.currentAnswer}/>
                        <SketchComponent
                            drawFlg={this.state.isDrawer}
                            clearFlg={this.state.clearFlg}
                        />
                        {gameProgress === 'notReady'
                            ? <div className='buttons'>
                                    <button onClick={this.gameReady}>Ready</button>
                                    <button onClick={this.leaveRoom}>LEAVE GAME ROOM</button>
                                </div>
                            : ''}
                    </div>

                    <div className='col-sm-3'>
                        <Chat
                            ansFlg=
                            {gameProgress !== 'notReady' && (this.startCountdown.wasDrawer || this.state.isDrawer)}/>
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
