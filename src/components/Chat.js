import React from 'react';
import Users from "./Users";
import Messages from "./Messages";
import socketIOClient from 'socket.io-client';

class Chat extends React.Component{
    
    constructor(props){
        super(props);
        this.socket = null;
        this.state = {
            username : localStorage.getItem('username')? localStorage.getItem('username'): '',
            id : localStorage.getItem('id')? localStorage.getItem('id'):"undefined ID",
            chat_read : false,
            users : [],
            messages : [],
            message : ''
        }
    }

    componentDidMount(){
        if(this.state.username.length){
            this.initChat();
        }
    }

    initChat(){
        localStorage.setItem('username', this.state.username);

        //change the uri to the host once it's set up
        //might have to relocae this block to the after-login page
        this.socket = socketIOClient('ws://localhost:8000',{
            query:'username='+this.state.username+'&id='+this.state.id
        });

        this.socket.on('updateUsersList', function(users){
            console.log(users);
            this.setState({
                users:users
            });
        }.bind(this));

        this.socket.on('message', function(message){
            this.setState({
                messages : this.state.messages.concat([message])
            });
            //this.scrollToBottom();
        }.bind(this));
    }

    sendMessage(message, e){
        console.log(message);
        this.setState({
            messages : this.state.messages.concat([{
               username : localStorage.getItem('username'),
               id : localStorage.getItem('id'),
               message : message,
           }])
        });
        this.socket.emit('message', {
            username : localStorage.getItem('username'),
            id : localStorage.getItem('id'),
            message : message,
        });
        this.scrollToBottom();
}


    render(){
        return(
            <div class="chat-container">
                <React.Fragment>
                    <Users users={this.state.users}/>
                    <Messages
                        sendMessage={this.sendMessage.bind(this)}
                        messages={this.state.messages} />
                </React.Fragment>
            </div>
        );
    }
}

export default Chat;