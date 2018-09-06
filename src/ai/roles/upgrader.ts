
import Role from '../models/role';
import misc from '../misc';
import actions from './parts/actions';
import senses from './parts/senses';

const states = {
  SEEKING_SOURCE: {
    do: actions.SEEKING_SOURCE,
    code: '🚚⛏',
    until: [
      senses.shouldSeek.controller,
      senses.atSource
    ]
  },
  HARVEST: {
    do: actions.HARVEST,
    code: '⛏',
    until: [
      senses.shouldSeek.controller,
      senses.atSource,
      senses.isDepleted.needsContainer,
      senses.isDepleted.needsSource
    ]
  },
  SEEKING_CONTROLLER: {
    code: 'SEEK_CTRL',
    code: '🚚🏰',
    do: actions.SEEKING_CONTROLLER,
    until: [
      senses.atController
    ]
  },
  SEEKING_CONTAINER: {
    code: '🚚📦',
    do: actions.SEEKING_CONTAINER,
    until: [
      senses.targetIsFull.container,
      senses.atContainer
    ]
  },
  DRAIN_CONTAINER: {
    code: '+📦',
    do: actions.DRAIN_CONTAINER,
    until: [
      senses.shouldSeek.controller,
      senses.isDepleted.needsContainer,
      senses.isDepleted.needsSource
    ]
  },
  UPGRADING: {
    do: actions.UPGRADING,
    code: '+1',
    until: [
      senses.isDepleted.needsContainer,
      senses.isDepleted.needsSource
    ]
  }
}

export default Role(states, {
  initalState: 'SEEKING_SOURCE'
});
