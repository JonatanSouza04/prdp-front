import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Main from './main'

const Routes = ({...props}) => {

 return (
     <BrowserRouter >
      <Switch>
          <Route exact path='/' component={() => <Main form={'cccc'}  /> } />
          <Route path='/produtos' component={() => <Main  form={'produtos'}  /> } />
          <Route path='/funcionarios' component={() => <Main  form={'funcionarios'}  /> } />
      </Switch>
    </BrowserRouter>
  )
}


export default React.memo(Routes);

