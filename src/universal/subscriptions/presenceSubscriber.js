import subscriptions from './subscriptions';
import socketCluster from 'socketcluster-client';
import {EDIT, PRESENT, LEAVE, SOUNDOFF} from './constants';
import {cashay} from 'cashay';

export default function presenceSubscriber(subscriptionString, variables, handlers) {
  const {channelfy} = subscriptions.find(sub => sub.string === subscriptionString);
  const channelName = channelfy(variables);
  const socket = socketCluster.connect();
  const {upsert, remove} = handlers;
  socket.subscribe(channelName, {waitForAuth: true});
  socket.watch(channelName, data => {
    if (data.type === SOUNDOFF) {
      const {editing} = cashay.store.getState();
      const options = {
        variables: {
          teamId: variables.teamId,
          targetId: data.targetId,
          editing
        }
      };
      cashay.mutate('present', options);
    }
    if (data.type === PRESENT) {
      upsert({
        id: data.socketId,
        userId: data.userId,
        editing: data.editing
      });
    }
    if (data.type === EDIT) {
      upsert({
        id: data.socketId,
        editing: data.editing
      });
    }
    if (data.type === LEAVE) {
      remove(data.socketId);
    }
  });
}
