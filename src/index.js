import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import configureStore from './store/store';
import AppRouter from './routers/AppRouter';

ReactDOM.render(

    <Provider store={configureStore()}>

    <HashRouter>
        <AppRouter/>
    </HashRouter>

</Provider>, document.getElementById('root'));
