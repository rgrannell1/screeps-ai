
export const id = (creep:Creep):number => {
  return Memory.roles[creep.memory.role].count
}
