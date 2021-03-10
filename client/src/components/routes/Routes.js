import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Landing from '../layout/Landing';
import Room from '../layout/Room';
import Lobby from '../layout/Lobby';

const Routes = () => {
  const [roomAddress, setRoomAddress] = useState('someAddress')

  return (
    <section className='container'>
      <Switch>
        <Route exact path='/' component={Landing} />
        <Route exact path='/room' component={Room} roomAddress={roomAddress}  />
        <Route exact path='/lobby' component={Lobby} roomAddress={roomAddress}  />
      </Switch>
    </section>
  );
};

export default Routes;
