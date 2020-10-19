import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Main from './main'

const Routes = ({...props}) => {

 return (
     <BrowserRouter >
      <Switch>
          <Route exact path='/' component={() => <Main form={''}  /> } />
          <Route path='/produtos' component={() => <Main  form={'produtos'}  /> } />
          <Route path='/funcionarios' component={() => <Main  form={'funcionarios'}  /> } />
          <Route path='/retiradas' component={() => <Main  form={'retiradas'}  /> } /> 
          <Route path='/vendas' component={() => <Main  form={'vendas'}  /> } /> 
          <Route path='/sair' component={() => <Main  form={'sair'}  /> } /> 
      </Switch>
    </BrowserRouter>
  )
}


export default React.memo(Routes);

