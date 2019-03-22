import React, {Component} from 'react';
import {connect} from 'react-redux';
import {simpleAction} from './actions/simpleAction';
import logo from './resources/logo.svg';
import Login from './components/Login';
// import Landing from './components/Landing';

class App extends Component {

    simpleAction = () => {
        this
            .props
            .simpleAction();
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">

                    <img src={logo} alt="logo"/> 

                    <Login/>

                    <h1 className="App-title">Welcome to React</h1>

                    <pre>{JSON.stringify(this.props)}</pre>

                    <button onClick={this.simpleAction}>Test</button>

                </header>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    ...state
});

const mapDispatchToProps = dispatch => ({
    simpleAction: () => dispatch(simpleAction())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
