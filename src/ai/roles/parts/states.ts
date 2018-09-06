
import actions from './actions';
import senses from './senses';
import constants from '../../constants';

const states = {} as any

states.BUILDING = () => {
  return {
    do: actions.BUILDING,
    code: constants.states.BUILDING.code,
    until: [
      senses.isDepleted.needsCharge
    ]
  }
}

states.SEEKING_SITE = () => {
  return {
    do: actions.SEEKING_SITE,
    code: constants.states.SEEKING_SITE.code,
    until: [
      senses.atSite
    ]
  }
}

states.CHARGE = () => {
  return {
    do: actions.CHARGE,
    code: constants.states.CHARGE.code,
    until: [
      senses.shouldSeek.site,
      senses.isDepleted.needsCharge
    ]
  }
}

states.SEEKING_CHARGE = () => {
  return {
    do: actions.SEEKING_CHARGE,
    code: constants.states.SEEKING_CHARGE.code,
    until: [
      senses.shouldSeek.charge,
      senses.atCharge
    ]
  }
}

states.SEEKING_SOURCE = () => {
  return {
    do: actions.SEEKING_SOURCE,
    code: constants.states.SEEKING_SOURCE.code,
    until: [
      senses.shouldSeek.container,
      senses.shouldSeek.spawn,
      senses.atSource
    ]
  }
}

states.HARVEST = () => {
  return {
      do: actions.HARVEST,
      code: constants.states.HARVEST.code,
      until: [
        senses.shouldSeek.emptyContainer,
        senses.shouldSeek.spawn,
        senses.atSource,
      senses.isDepleted.needsSource
    ]
  }
}

states.SEEKING_SPAWN = () => {
  return {
    do: actions.SEEKING_SPAWN,
    code: constants.states.SEEKING_SPAWN.code,
    until: [
      senses.atSpawn
    ]
  }
}

states.SEEKING_CONTAINER = () => {
  return {
    do: actions.SEEKING_CONTAINER,
    code: constants.states.SEEKING_CONTAINER.code,
    until: [
      senses.atContainer
    ]
  }
}

states.SEEKING_EXTENSION = () => {
  return {
    do: actions.SEEKING_EXTENSION,
    code: constants.states.SEEKING_EXTENSION.code,
    until: [
      senses.atExtension
    ]
  }
}

states.DRAIN_CONTAINER = () => {
  return {
    code: constants.states.DRAIN_CONTAINER.code,
    do: actions.DRAIN_CONTAINER,
    until: [
      senses.shouldSeek.spawn,
      senses.isDepleted.needsContainer
    ]
  }
}

states.CHARGE_SPAWN = () => {
  return {
    code: constants.states.CHARGE_SPAWN.code,
    do: actions.CHARGE_SPAWN,
    until: [
      senses.isDepleted.needsSource
    ]
  }
}

states.CHARGE_EXTENSION = () => {
  return {
    code: '-⚡',
    do: actions.CHARGE_EXTENSION,
    until: [
      senses.isDepleted.needsContainer,
      senses.atExtension
    ]
  }
}

states.CHARGE_CONTAINER = () => {
  return {
    code: constants.states.CHARGE_CONTAINER.code,
    do: actions.CHARGE_CONTAINER,
    until: [
      senses.targetIsFull.container,
      senses.isDepleted.needsSource
    ]
  }
}

states.REPAIR = () => {
  return {
    code: constants.states.REPAIR.code,
    do: actions.REPAIR,
    until: [
      senses.repairComplete,
      senses.isDepleted.needsCharge,
    ]
  }
}

states.SEEKING_DAMAGE = () => {
  return {
    code: constants.states.SEEKING_DAMAGE.code,
    do: actions.SEEKING_DAMAGE,
    until: [
      senses.isDepleted.needsCharge,
      senses.atDamage
    ]
  }
}

states.SIGNING = () => {
  return {
    code: constants.states.SIGNING.code,
    do: actions.SIGNING,
    until: [
      senses.isSigned
    ]
  }
}

states.DYING = () => {
  return {
    code: constants.states.DYING.code,
    do: actions.DYING,
    until: []
  }
}

states.SEEKING_ENEMY = () => {
  return {
    code: constants.states.SEEKING_ENEMY.code,
    do: actions.SEEKING_ENEMY,
    until: [
      senses.atEnemy
    ]
  }
}

states.ATTACKING = () => {
  return {
    code: constants.states.ATTACKING.code,
    do: actions.ATTACKING,
    until: [
      senses.atEnemy
    ]
  }
}

export default states;
