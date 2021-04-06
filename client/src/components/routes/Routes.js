import React from 'react';
import { Route, Switch } from 'react-router-dom';

// Page Imports
import Landing from '../layout/Landing';
import Room from '../layout/Room';
import Lobby from '../layout/Lobby';

import Viewer from '../layout/Viewer';
import Broadcaster from '../layout/Broadcaster';

const Routes = ({socket, location}) => {
  return (
    <section className='container'>
      <Switch socket={socket} >
        <Route exact path='/' component={Landing} />
        <Route exact path='/room' component={() => <Room socket={socket} state={location.state} />} />
        <Route exact path='/lobby' component={() => <Lobby socket={socket} state={location.state} />} />
        <Route exact path='/viewer' component={() => <Viewer socket={socket} state={location.state} />} />
        <Route exact path='/broadcaster' component={() => <Broadcaster socket={socket} state={location.state} />} />
      </Switch>
    </section>
  );
};

export default Routes;
