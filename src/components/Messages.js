import React from 'react';
import Message from './Message';
import ChatBox from './ChatBox';

class Messages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            height: 0,
            messages: props.messages
        };
    }

    static getDerivedStateFromProps(nprops) {
        return {messages: nprops.messages};
    }

    componentDidMount() {
        console.log('Messages mounted');
    }

    render() {
        return (
            <div className="messages">
                {this.state.messages.length
                    ? (this.state.messages.map((message, i) => {
                        return (<Message key={i} message={message}/>);
                    }))
                    : <div className="no-message">Welcome to the Room!</div>
}               
                {this.props.ansFlg?'':<div><ChatBox sendMessage={this.props.sendMessage}/></div>}
                
            </div>
        );
    }
}

export default Messages;