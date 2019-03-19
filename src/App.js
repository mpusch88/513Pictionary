import React, {Component} from 'react';
import {connect} from 'react-redux';
import {simpleAction} from './actions/simpeAction';
import logo from './resources/logo.svg';
import './App.css';

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
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>

                    <pre>
                    {
                        JSON.stringify(this.props)
                    }
                    </pre>

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
