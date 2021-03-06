import React, {PropTypes} from 'react';
import requireAuth from 'universal/decorators/requireAuth/requireAuth';
import reduxSocketOptions from 'universal/redux/reduxSocketOptions';
import {reduxSocket} from 'redux-socket-cluster';
import {DashSidebar} from 'universal/components/Dashboard';
import DashLayoutContainer from 'universal/containers/DashLayoutContainer/DashLayoutContainer';

const DashboardContainer = (props) => {
  const {children, location: {pathname}} = props;
  const [, dashType, dashChild] = pathname.split('/');
  const isUserSettings = dashType === 'me' && dashChild === 'settings';
  const title = dashType === 'me' ? 'My Dashboard' : 'Team Dashboard';
  return (
    <DashLayoutContainer title={title}>
      <DashSidebar isUserSettings={isUserSettings}/>
      {children}
    </DashLayoutContainer>
  );
};

DashboardContainer.propTypes = {
  children: PropTypes.any,
  location: PropTypes.object
};

export default
requireAuth(
  reduxSocket({}, reduxSocketOptions)(
    DashboardContainer
  )
);
