function VDI (data, client, sessionId) {
  this.uuid = null
  this.name = null
  this.isSnapshot = null
  this.powerState = null
  this.snapshotTime = null
  this.virtualSize = null
  this.physicalUtilisation = null
  this.missing = null
  this.snapshots = []
  this.client = null
  this.sessionId = null
  if (typeof sessionId !== 'undefined') this.sessionId = sessionId
  if (typeof client !== 'undefined') this.client = client
  if (typeof data.uuid !== 'undefined') this.uuid = data.uuid
  if (typeof data.virtual_size !== 'undefined') this.virtualSize = data.virtual_size
  if (typeof data.physical_utilisation !== 'undefined') this.physicalUtilisation = data.physical_utilisation
  if (typeof data.snapshots !== 'undefined') this.snapshots = data.snapshots
  if (typeof data.missing !== 'undefined') this.missing = data.missing
  if (data.name || data.name_label) this.name = data.name || data.name_label
  if (typeof data.is_a_snapshot !== 'undefined') this.isSnapshot = data.is_a_snapshot
  if (typeof data.power_state !== 'undefined') this.powerState = data.power_state.toLowerCase()
  if (typeof data.snapshot_time !== 'undefined') this.snapshotTime = data.snapshot_time
}

VDI.prototype.snapshot = function (snapshotName, callback) {
  this.getRefByUuid((err, ref) => {
    if (err) return callback(err, null)
    this.client.methodCall('VDI.snapshot', [this.sessionId, ref], (err, resSnap) => {
      if (err) return callback(err, null)
      this.client.methodCall('VDI.get_record', [this.sessionId, resSnap.Value], (err, res) => {
        if (err) return callback(err, null)
        return callback(null, new VDI(res.Value, this.client, this.sessionId))
      })
    })
  })
}

VDI.prototype.getRefByUuid = function (callback) {
  if (this.ref) return callback(null, this.ref)
  this.client.methodCall('VDI.get_by_uuid', [this.sessionId, this.uuid], function (err, res) {
    if (err) return callback(err, null)
    if (res.Value) this.ref = res.Value
    return callback(null, res.Value)
  })
}

VDI.prototype.getRawData = function (callback) {
  this.client.methodCall('VDI.get_record', [this.sessionId, this.ref], (err, res) => {
    if (err) return callback(err, null)
    return callback(null, res.Value)
  })
}

VDI.prototype.remove = function (callback) {
  this.getRefByUuid((err, ref) => {
    if (err) return callback(err, null)
    this.client.methodCall('VDI.destroy', [this.sessionId, ref], function (err, res) {
      if (err) return callback(err, null)
      return callback(null, res)
    })
  })
}



module.exports = VDI
