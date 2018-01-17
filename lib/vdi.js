function VDI(data) {
  this.uuid = null
  this.name = null
  this.isTemplate = null
  this.isSnapshot = null
  this.isControlDomain = null
  this.powerState = null
  this.snapshotTime = null
  if (typeof data.uuid !== 'undefined') this.uuid = data.uuid
  if (data.name || data.name_label) this.name = data.name || data.name_label
  if (typeof data.is_a_template !== 'undefined') this.isTemplate = data.is_a_template
  if (typeof data.is_a_snapshot !== 'undefined') this.isSnapshot = data.is_a_snapshot
  if (typeof data.is_control_domain !== 'undefined') this.isControlDomain = data.is_control_domain
  if (typeof data.power_state !== 'undefined') this.powerState = data.power_state.toLowerCase()
  if (typeof data.snapshot_time !== 'undefined') this.snapshotTime = data.snapshot_time
}

module.exports = VDI;