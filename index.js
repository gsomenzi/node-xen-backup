const XenModule = require('./lib/xen-module');

module.exports = {
  setClient: (host, port, callback) => {
    return XenModule.setClient(host, port, callback)
  },
  login: (user, password, callback) => {
    return XenModule.login(user, password, callback)
  },
  getAllVMs: (callback) => {
    return XenModule.getAllVMs(callback)
  },
  removeVm: (ref, callback) => {
    return XenModule.removeVm(ref, callback)
  },
  getByUuid: (uuid, callback) => {
    return XenModule.getByUuid(uuid, callback)
  },
  getByRef: (ref, callback) => {
    return XenModule.getByRef(ref, callback)
  },
  takeSnapshot: (vm, snapshotName, callback) => {
    return XenModule.takeSnapshot(vm, snapshotName, callback)
  }
}