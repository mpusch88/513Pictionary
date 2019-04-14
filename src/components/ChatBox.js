import React from 'react';
import '../styles/chatbox.css';

class ChatBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: ''
        };
    }

    componentDidMount() {
        console.log('ChatBox mounted');
    }

    onChange(e) {
        this.setState({message: e.target.value});
    }

    onKeyUp(e) {
        if (e.key === 'Enter') {
            if (this.state.message.length) {
                this
                    .props
                    .sendMessage({type: 'message', text: this.state.message});
                this.setState({message: ''});
            }
        }
    }

    render() {
        return (
            <div className="chatbox">
                <input
                    className="form-control"
                    value={this.state.message}
                    onChange={this
                    .onChange
                    .bind(this)}
                    onKeyUp={this
                    .onKeyUp
                    .bind(this)}/>
            </div>
        );
    }
}

export default ChatBox;