import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Landing from '../layout/Landing';
import Room from '../layout/Room';

const Routes = (props) => {
  return (
    <section className='container'>
      <Switch>
        <Route exact path='/' component={Landing} />
        <Route exact path='/room' component={Room} />
      </Switch>
    </section>
  );
};

export default Routes;
