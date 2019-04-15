import React from 'react';
import Message from './Message';
import ChatBox from './ChatBox';
import '../styles/chat.css';

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

    messagesEnd = React.createRef()

    componentDidMount() {
        console.log('Messages mounted');
        this.scrollToBottom();

    }

    componentDidUpdate () {
      this.scrollToBottom();
    }
    
    scrollToBottom = () => {
      this.messagesEnd.current.scrollIntoView({ behavior: 'smooth' });
    }

    render() {
        return (
            <div>
            <div className="messages">
                {this.state.messages.length
                    ? (this.state.messages.map((message, i) => {
                        return (<Message key={i} message={message}/>);
                    }))
                    : <div className="no-message">Welcome to the Room!</div>
                }     
                <div ref={this.messagesEnd} />          
            </div>
            {this.props.ansFlg?'':<div><ChatBox sendMessage={this.props.sendMessage}/></div>}
            </div>
        );
    }
}

export default Messages;
