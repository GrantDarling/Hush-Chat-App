import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Landing from '../layout/Landing';

const Routes = (props) => {
  return (
    <section className='container'>
      <Switch>
        <Route exact path='/' component={Landing} />
      </Switch>
    </section>
  );
};

export default Routes;
