import React from 'react';
import Header from './Header';
import SketchComponent from '../components/SketchComponent';
import TimerProgressBar from './TimerProgressBar';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {changeGameState} from '../actions/userAction.js';

import {game_myReady} from '../api';

class GameRoom extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            gameProgress: 'notReady', //ready, waiting, start, roundEnd, gameEnd
            myUserInfo: {
                username: 'myDefault',
                score: 0,
                isDrawer: false,
                index: 0
            },
            userList: []
        };

        this.gameReady = this
            .gameReady
            .bind(this);
    }

    gameReady() {
        this.setState({gameProgress: 'ready'});
        this
            .props
            .changeGameState('ready');
        game_myReady(this.state.myUserInfo.username);
    }

    render() {
        const {gameProgress} = this.state;
        return (
            <div>
                <Header/>
                <TimerProgressBar/>
                <SketchComponent/>
                <button onClick={this.gameReady}>Ready</button>

                {/*{*/
            }
            {/*gameProgress === 'ready' ?*/
            }
            {/*<div>*/
            }
            {/*<TimerProgressBar/>*/
            }
            {/*<SketchComponent gameFlg={'ready'}/>*/
            }
            {/*</div> :*/
            }
            {/*<div>*/
            }
            {/*<TimerProgressBar/>*/
            }
            {/*<SketchComponent gameFlg={'notReady'}/>*/
            }
            {/*<button onClick={this.gameReady}>Ready</button>*/
            }
            {/*</div>*/
            }
            {/*}*/}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {gameState: state.gameState};
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
        changeGameState: changeGameState
    }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(GameRoom);
