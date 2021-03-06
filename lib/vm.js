function VM (data, client, sessionId) {
  this.uuid = null
  this.ref = null
  this.name = null
  this.isTemplate = null
  this.isSnapshot = null
  this.isControlDomain = null
  this.powerState = null
  this.snapshotTime = null
  this.client = null
  this.sessionId = null
  if (typeof sessionId !== 'undefined') this.sessionId = sessionId
  if (typeof data.uuid !== 'undefined') this.uuid = data.uuid
  if (typeof data.ref !== 'undefined') this.ref = data.ref
  if (data.name || data.name_label) this.name = data.name || data.name_label
  if (typeof data.is_a_template !== 'undefined') this.isTemplate = data.is_a_template
  if (typeof data.is_a_snapshot !== 'undefined') this.isSnapshot = data.is_a_snapshot
  if (typeof data.is_control_domain !== 'undefined') this.isControlDomain = data.is_control_domain
  if (typeof data.power_state !== 'undefined') this.powerState = data.power_state.toLowerCase()
  if (typeof data.snapshot_time !== 'undefined') this.snapshotTime = data.snapshot_time
  // GETS VM REFS
  if (typeof client !== 'undefined') this.client = client
}

VM.prototype.snapshot = function (snapshotName, callback) {
  this.getRefByUuid((err, ref) => {
    if (err) return callback(err, null)
    this.client.methodCall('VM.snapshot', [this.sessionId, ref, snapshotName], (err, res) => {
      if (err) return callback(err, null)
      this.client.methodCall('VM.get_record', [this.sessionId, res.Value], (err, res) => {
        if (err) return callback(err, null)
        return callback(null, new VM(res.Value, this.client, this.sessionId))
      })
    })
  })
}

VM.prototype.getRefByUuid = function (callback) {
  if (this.ref) return callback(null, this.ref)
  this.client.methodCall('VM.get_by_uuid', [this.sessionId, this.uuid], function (err, res) {
    if (err) return callback(err, null)
    if (res.Value) this.ref = res.Value
    return callback(null, res.Value)
  })
}

VM.prototype.getRawData = function (callback) {
  this.client.methodCall('VM.get_record', [this.sessionId, this.ref], function (err, res) {
    if (err) return callback(err, null)
    return callback(null, res.Value)
  })
}

VM.prototype.remove = function (callback) {
  this.getRefByUuid((err, ref) => {
    if (err) return callback(err, null)
    this.client.methodCall('VM.destroy', [this.sessionId, ref], function (err, res) {
      if (err) return callback(err, null)
      return callback(null, res)
    })
  })
}

module.exports = VM

// PRIVATE METHODS
