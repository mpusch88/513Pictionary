import React from 'react';

class Users extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            users : props.users
        }
    }

    static getDerivedStateFromProps(nprops, pstate){
        return{
            users : nprops.users,
        }
    }

    render(){
        return(
            <div className="users">
                {this.state.users.length ? this.state.users.map((user, i) => {
                    return (
                        <div className="user" key={i}>
                            <i className="fa fa-user"/> {user}
                        </div>
                    )
                }) : 'No Users'}
            </div>
        )
    }
}

export default Users;