const VM = require('./vm')
const xmlrpc = require('../node_modules/xmlrpc')
let client = null
let session = null

module.exports = {
  setClient: (host, port, callback) => {
    return setClient(host, port, callback)
  },
  login: (user, password, callback) => {
    return login(user, password, callback)
  },
  getAllVMs: (callback) => {
    return getAllVMs(callback)
  },
  removeVm: (ref, callback) => {
    return removeVm(ref, callback)
  },
  getByUuid: (uuid, callback) => {
    return getByUuid(uuid, callback)
  },
  getByRef: (ref, callback) => {
    return getByRef(ref, callback)
  },
  takeSnapshot: (vm, snapshotName, callback) => {
    return takeSnapshot(vm, snapshotName, callback)
  }
}

function setClient(host, port) {
  client = xmlrpc.createClient({ host: host, port: port})
}

function login(user, password, callback) {
  client.methodCall('session.login_with_password', [user, password], function (err, res) {
    if (err) return callback(err, null)
    session = res.Value
    return callback(null, session)
  })
}

function getAllVMs(callback) {
  let vms = []
  client.methodCall('VM.get_all_records', [session], function (err, res) {
    if (err) return callback(err, null)
    let keys = Object.keys(res.Value)
    for (let i in res.Value) {
      if (!res.Value[i].is_a_template && !res.Value[i].is_a_snapshot) {
        vms.push(new VM(res.Value[i]))
      }
    }
    return callback(null, vms)
  })
}

function getByUuid (uuid, callback) {
  client.methodCall('VM.get_by_uuid', [session, uuid], function (err, res) {
    if (err) return callback(err, null)
    return callback(null, res)
  })
}

function getByRef (ref, callback) {
  client.methodCall('VM.get_record', [session, ref], function (err, res) {
    if (err) return callback(err, null)
    return callback(null, new VM(res.Value))
  })
}

function takeSnapshot(vm, snapshotName, callback) {
  client.methodCall('VM.snapshot', [session, vm, snapshotName], function (err, res) {
    if (err) return callback(err, null)
    return callback(null, res)
  })
}

function removeVm(ref, callback) {
  client.methodCall('VM.destroy', [session, ref], function (err, res) {
    if (err) return callback(err, null)
    return callback(null, res)
  })
}