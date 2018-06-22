#! /usr/bin/env node
const program = require('commander')
const moment = require('moment')
const request = require('request')
const fs = require('fs')
const zlib = require('zlib')
const GZip = zlib.createGzip({
  level: 9
})
const XenBackup = require('./')
let connOptions = {
  host: 'localhost',
  port: 80,
  username: 'root',
  password: null,
  sessionId: null
}
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

program
  .version('0.1.0')
  .option('-H, --host [host]', 'IP or hostname from Xenserver. Default: localhost.')
  .option('-P, --port [port]', 'TCP port from Xenserver. Default: 80.')
  .option('-u, --username [username]', 'Username to login in Xenserver.')
  .option('-p, --password <password>', 'Password to login in Xenserver.')
  .option('-f, --filename <filename>', 'Path to target file of exported snapshot.')
  .option('-t, --type <type>', 'Type of object to export. <vm|vdi> default vm.')
  .option('-v, --vm <vm>', 'VM name label or uuid to backup.')
  .parse(process.argv)

// REQUIRED
let missingRequireds = []
if (!program.type) program.type = 'vm'
if (!program.password) missingRequireds.push('The password of Xenserver user is required as -p or --password option.')
if (!program.vm) missingRequireds.push('The VM is required as -v or --vm option.')
if (!program.filename) missingRequireds.push('The filename is required as -f or --filename option.')
if (missingRequireds.length > 0) {
  for (let i in missingRequireds) {
    console.log(missingRequireds[i])
  }
  process.exit(1)
}

if (program.host) connOptions.host = program.host
if (program.port) connOptions.port = parseInt(program.port)
if (program.username) connOptions.username = program.username
if (program.password) connOptions.password = program.password

XenBackup.setClient(connOptions.host, connOptions.port)
XenBackup.login(connOptions.username, connOptions.password, (err, sessionId) => {
  if (err) {
    console.error(err)
    return process.exit(1)
  }
  connOptions.sessionId = sessionId
  getItens((err, itens) => {
    if (err) {
      console.error(err)
      return process.exit(1)
    }
    if (program.type === 'vm') console.log(`- Searching for VM ${program.vm}`)
    if (program.type === 'vdi') console.log(`- Searching for VDI ${program.vm}`)
    let founded = false
    for (let i in itens) {
      if (itens[i].uuid.toLowerCase() === program.vm.toLowerCase() || itens[i].name.toLowerCase() === program.vm.toLowerCase()) {
        founded = true
        console.log('- Taking snapshot...')
        itens[i].snapshot(itens[i].name.replace(/\s/g, '') + moment().unix(), (err, snapshot) => {
          if (err) {
            console.error(err)
            return process.exit(1)
          }
          console.log(`- Exporting snapshot ${snapshot.name} taked in ${moment(snapshot.snapshotTime).format('LL')}`)
          console.log(`- It will be saved on file ${program.filename}`)
          let protocol = 'http'
          if ((connOptions.port === '443') || (connOptions.port === 443)) protocol = 'https'
          downloadBackup(protocol, snapshot.uuid, (err, download) => {
            if (err) {
              console.error(err)
              return process.exit(1)
            }
            console.log(`- Snapshot exported successfully to ${program.filename}`)
            console.log(`- The file has size ${(fs.statSync(program.filename).size / 1024 / 1024).toFixed(2)}MB`)
            console.log(`- Removing snapshot...`)
            snapshot.remove((err, removed) => {
              if (err) {
                console.error(err)
                return process.exit(1)
              }
              console.log('- Snapshot removed successfuly')
              return process.exit(0)
            })
          })
        })
      }
    }
    if (!founded) {
      console.error('VM or VDI not found in Xenserver.')
      return process.exit(1)
    }
  })
})

function getItens (callback) {
  if (program.type === 'vm') {
    XenBackup.getAllVMs((err, vms) => {
      if (err) return callback(err, null)
      return callback(null, vms)
    })
  }
  if (program.type === 'vdi') {
    XenBackup.getAllVDIs((err, vdis) => {
      if (err) return callback(err, null)
      return callback(null, vdis)
    })
  }
  if ((program.type !== 'vdi') && (program.type !== 'vm')) {
    return callback(new Error('Cannot define object type <vm|vdi>.'))
  }
}

function downloadBackup (protocol, uuid, callback) {
  let sufix = null
  if (program.type === 'vm') {
    sufix = `/export?session_id=${connOptions.sessionId}&use_compression=true&uuid=`
  }
  if (program.type === 'vdi') {
    sufix = `/export_raw_vdi?session_id=${connOptions.sessionId}&format=vhd&vdi=`
  }
  let req = request.get(`${protocol}://${connOptions.host}:${connOptions.port}${sufix}${uuid}`)
    .on('end', function (response) {
      return callback(null, response)
    })
    .on('error', function (err) {
      console.log(err)
      return callback(err, null)
    })
  if (program.type === 'vdi') {
    req.pipe(GZip).pipe(fs.createWriteStream(program.filename))
  } else {
    req.pipe(fs.createWriteStream(program.filename))
  }
}
