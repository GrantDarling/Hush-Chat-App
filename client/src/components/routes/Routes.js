import React from 'react';
import { Route, Switch } from 'react-router-dom';

// Page Imports
import Landing from '../layout/Landing';
import Room from '../layout/Room';
import Lobby from '../layout/Lobby';

const Routes = () => {
  return (
    <section className='container'>
      <Switch>
        <Route exact path='/' component={Landing} />
        <Route exact path='/room' component={Room} />
        <Route exact path='/lobby' component={Lobby}  />
      </Switch>
    </section>
  );
};

export default Routes;
