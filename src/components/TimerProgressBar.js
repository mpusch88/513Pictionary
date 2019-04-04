import React, { Component } from 'react';
import 'rc-progress/assets/index.css';
import { Line } from 'rc-progress';

export default class TimerProgressBar extends Component {
    constructor() {
        super();
        this.state = {
            percent: -1,
        };
        this.increase = this.increase.bind(this);
        this.restart = this.restart.bind(this);
    }

    componentDidMount() {
        this.increase();
    }

    increase() {
        const percent = this.state.percent+1;
        if (percent > 60) {
            clearTimeout(this.tm);
            return;
        }
        this.setState({ percent });
        this.tm = setTimeout(this.increase, 1000);
    }

    restart() {
        clearTimeout(this.tm);
        this.setState({ percent: -1 }, () => {
            this.increase();
        });
    }

    render() {
        const {percent} = this.state;
        return (
            <div style={{ margin: 10, width: 400}}>
                <p>Remaining time: {60-percent}s</p>
                <Line strokeWidth="4"
                      percent={Math.fround(this.state.percent*10.0/6.0)}
                />
                {/*<button onClick={this.restart}>Restart</button>*/}
            </div>
        );
    }
}
