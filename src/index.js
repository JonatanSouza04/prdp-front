import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import Routes from './components/routes';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import './class/websql';

const renderApp = Component => {
    ReactDOM.render(
      <React.StrictMode>
        <HashRouter> 
          <Component />
        </HashRouter>  
      </React.StrictMode>,
      document.getElementById('root')
    )
};

renderApp(Routes);

