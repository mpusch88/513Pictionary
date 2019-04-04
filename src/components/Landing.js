import React from 'react';

class Landing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.handleChange = this
            .handleChange
            .bind(this);
    }

    componentDidMount() {
        alert('Signed in!');
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        return (
            <div>Landing page - Welcome!</div>
        );
    }
}

export default Landing;
