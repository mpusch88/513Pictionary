import React from 'react';
import Users from "./Users";
import Messages from "./Messages";
import {updateUserList, rcvMessage, sendMessageEvent, initializeChat} from "../api";
import {connect} from "react-redux";

class Chat extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            username: this.props.username ? this.props.username : 'DefaultUser',
            id : this.props.id? this.props.id : this.generateID(),
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
        console.log('ID not found, generating new id: ' + text);
        return text;
    }

    componentDidMount() {
        console.log('Chat mounted');
        console.log('Username set as: ' + this.state.username);
        console.log('User id set as: ' + this.state.id);
        if (this.state.username.length) {
            this.initChat();
        }
    }

    initChat() {
        initializeChat({username: this.state.username, id: this.state.id});

        updateUserList( list => {
            this.setState({users: list})
        });

        rcvMessage( message => {
            this.setState({
                messages: this
                    .state
                    .messages
                    .concat([message])
            });
        });
    }

    sendMessage(message) {
        console.log("Chat.js message value: "+message);
        this.setState({
            messages: this
                .state
                .messages
                .concat([
                    {
                        username: this.state.username,
                        id: this.state.id,
                        message: message,
                    }
                ])
        });
        sendMessageEvent({
            username: this.state.username,
            id: this.state.id,
            message: message,
            roomId: this.props.currentRoomId,
        });
    }

    render() {
        return (
            <div className="chat-container">
                <React.Fragment>
                    <Users users={this.state.users}/>
                    <Messages
                        sendMessage={this
                        .sendMessage
                        .bind(this)}
                        messages={this.state.messages}/>
                </React.Fragment>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.username,
        currentRoomId: state.currentRoomId}
};

export default connect(mapStateToProps)(Chat);
