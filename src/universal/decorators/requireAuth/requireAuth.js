import React, {Component} from 'react';
import {push} from 'react-router-redux';
import getAuthedUser from 'universal/redux/getAuthedUser';
import {cashay} from 'cashay';

export default ComposedComponent => {
  return class RequiredAuth extends Component {
    render() {
      // no need to check for expired tokens here, right?
      // We check initial validation in the client.js. Our job should be to keep them logged in.
      const user = getAuthedUser();
      if (user) {
        return <ComposedComponent {...this.props} user={user} />;
      }
      // I probably shouldn't encourage this behavior
      cashay.store.dispatch(push('/'));

      // react is a stickler for returning an element or null
      return null;
    }
  };
};

