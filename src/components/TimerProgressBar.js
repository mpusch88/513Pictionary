import React, {Component} from 'react';
import 'rc-progress/assets/index.css';
import {Line} from 'rc-progress';

export default class TimerProgressBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            percent: 0,
            start: false
        };
        this.increase = this
            .increase
            .bind(this);
        this.restart = this
            .restart
            .bind(this);
    }

    componentDidMount() {
        this.props.setReadyTrigger(this.restart);
        if(this.state.start)this.increase();
    }

    increase() {
        const percent = this.state.percent + 1;
        if (percent > 60) {
            this.setState({start: false});
            clearTimeout(this.tm);
            return;
        }
        this.setState({percent});
        this.tm = setTimeout(this.increase, 1000);
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
                width: 400
            }}>
                <p>Remaining time: {60 - percent}s</p>
                <Line strokeWidth="4" percent={Math.fround(this.state.percent * 10.0 / 6.0)}/>
            </div>
        );
    }
}
