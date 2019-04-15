import React from 'react';
import Messages from "./Messages";
import {updateUserList, rcvMessage, sendMessageEvent, initializeChat} from "../api";
import {connect} from "react-redux";
import '../styles/chat.css';


//this component is used for rendering the chat functionality
class Chat extends React.Component {

    constructor(props) {
        super(props);

        
        this.state = {
            username: this.props.username
                ? this.props.username
                : 'DefaultUser',
            id: this.props.id
                ? this.props.id
                : this.generateID(),
            chat_read: false,
            users: [],
            messages: [],
            message: ''
        };
    }

    generateID() {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 15; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        this.setState({id: text});

        return text;
    }

    componentDidMount() {

        if (this.state.username.length) {
            this.initChat();
        }
    }

    initChat() {

        initializeChat({username: this.state.username, id: this.state.id});

        updateUserList(list => {
            this.setState({users: list})
        });


        rcvMessage(message => {
            this.setState({
                messages: this
                    .state
                    .messages
                    .concat([message])
            });

        });
    }

    sendMessage(message) {

        this.setState({
            messages: this
                .state
                .messages
                .concat([
                    {
                        username: this.state.username,
                        id: this.state.id,
                        message: message
                    }
                ])
        });

        sendMessageEvent({username: this.state.username, id: this.state.id, message: message, roomId: this.props.currentRoomId});

    }

    render() {
        return (
            <div className="chat-container">
                <Messages
                    sendMessage={this
                    .sendMessage
                    .bind(this)}
                    messages={this.state.messages}
                    ansFlg={this.props.ansFlg}/>


                    
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {username: state.username, currentRoomId: state.currentRoomId};
};

export default connect(mapStateToProps)(Chat);
