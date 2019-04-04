import React from 'react';
import Header from "./Header";
import SketchComponent from '../components/SketchComponent';
import TimerProgressBar from './TimerProgressBar'

import {game_myReady} from '../api';
import {game_otherReady} from '../api';


export default class GameRoom extends React.Component {
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
        game_myReady(this.state.myUserInfo.username);
    }

    render() {
        const { gameProgress } = this.state;
        return (
            <div>
                <Header />
                {
                    gameProgress === 'ready' ?
                    <div>
                        <TimerProgressBar/>
                        <SketchComponent size={2}/>
                        <script>console.log("!!!!");</script>
                    </div> :
                    <div>
                        <TimerProgressBar/>
                        <SketchComponent size={0}/>
                        <button onClick={this.gameReady}>Ready</button>
                    </div>
                }
            </div>
        );
    }

}

