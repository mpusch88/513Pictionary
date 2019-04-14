import React, {Component} from 'react';
import 'rc-progress/assets/index.css';
import {Line} from 'rc-progress';

export default class TimerProgressBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            percent: 0,
            start: false,
            cdStart: false  // countdown start flag
        };

        this.increase = this
            .increase
            .bind(this);
        this.restart = this
            .restart
            .bind(this);
        this.cdIncrease = this
            .cdIncrease
            .bind(this);
        this.cdRestart = this
            .cdRestart
            .bind(this);
    }

    componentDidMount() {
        this.props.setReadyTrigger(this.restart);
        this.props.setCountdownTrigger(this.cdRestart);

        if(this.state.start)
        this.increase();

        if(this.state.cdStart)
        this.cdIncrease();
    }

    cdIncrease() {
        const percent = this.state.percent + 1;

        if (percent > 5) {  // TODO: change it back to 60
            this.setState({cdStart: false});
            clearTimeout(this.tm);

            this.props.countdownFinishTrigger();
            return;
        }

        this.setState({percent});
        this.tm = setTimeout(this.cdIncrease, 1000);
    }

    increase() {
        const percent = this.state.percent + 1;

        if (percent > 10) {  // TODO: change it back to 60
            this.setState({start: false});
            clearTimeout(this.tm);

            this.props.restartTrigger();
            return;
        }

        this.setState({percent});
        this.tm = setTimeout(this.increase, 1000);
    }

    cdRestart() {
        this.setState({cdStart: true});
        clearTimeout(this.tm);

        this.setState({
            percent: 0
        }, () => {
            this.cdIncrease();
        });
    }

    restart() {
        this.setState({start: true});
        clearTimeout(this.tm);

        this.setState({
            percent: 0
        }, () => {
            this.increase();
        });
    }

    render() {
        const {percent} = this.state;

        return (
            <div
                style={{
                margin: 10,
                width: 400,
            }}>
                {this.props.cdFlg===false ?
                    <div>
                        <p>Remaining time: {60 - percent}s</p>
                        <Line strokeWidth="4" percent={Math.fround(this.state.percent * 10.0 / 6.0)}/>
                    </div> :
                    <div>
                        <p>New round will start in: {6 - percent}s</p>
                        <Line strokeWidth="4" percent={Math.fround(this.state.percent * 20.0)}/>
                    </div>
                }
                {
                     this.props.ansFlg?
                     // eslint-disable-next-line react/no-unescaped-entities
                     <div><p>You're drawing {this.props.ans}</p></div>:''
                }
            </div>
        );
    }
}
