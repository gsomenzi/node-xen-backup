#! /usr/bin/env node
const program = require('commander')
const moment = require('moment')
const request = require('request')
const path = require('path')
const fs = require('fs')
const XenBackup = require('./')
let connOptions = {
  host: 'localhost',
  port: 80,
  username: 'root',
  password: null
}
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

program
  .version('0.1.0')
  .option('-H, --host [host]', 'IP or hostname from Xenserver. Default: localhost.')
  .option('-P, --port [port]', 'TCP port from Xenserver. Default: 80.')
  .option('-u, --username [username]', 'Username to login in Xenserver.')
  .option('-p, --password <password>', 'Password to login in Xenserver.')
  .option('-f, --filename <filename>', 'Path to target file of exported snapshot.')
  .option('-v, --vm <vm>', 'VM name label or uuid to backup.')
  .parse(process.argv);

// REQUIRED
let missingRequireds = []
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
  XenBackup.getAllVMs((err, vms) => {
    if (err) {
      console.error(err)
      return process.exit(1)
    }
    console.log('- Searching for VM '+program.vm)
    let founded = false
    for (let i in vms) {
      if (vms[i].uuid.toLowerCase() === program.vm.toLowerCase() || vms[i].name.toLowerCase() === program.vm.toLowerCase()) {
        founded = true
        console.log('- Searching VM real reference for UUID '+vms[i].uuid)
        XenBackup.getByUuid(vms[i].uuid, (err, ref) => {
          if (err) {
            console.error(err)
            return process.exit(1)
          }
          console.log('- Taking snapshot...')
          XenBackup.takeSnapshot(ref.Value, vms[i].name.replace(/\s/g, "")+moment().unix(), (err, snap) => {
            if (err) {
              console.error(err)
              return process.exit(1)
            }
            console.log('- Getting snapshot data...')
            XenBackup.getByRef(snap.Value, (err, snapRecord) => {
              if (err) {
                console.error(err)
                return process.exit(1)
              }
              console.log('- Exporting snapshot '+snapRecord.name+' taked in '+moment(snapRecord.snapshotTime).format('LL'))
              console.log('- Will be saved on file '+program.filename)
              let protocol = 'http'
              if ((connOptions.port === '443') || (connOptions.port === 443)) protocol = 'https'
              request.get(protocol+'://'+connOptions.username+':'+connOptions.password+'@'+connOptions.host+'/export?use_compression=true&uuid='+snapRecord.uuid)
              .on('end', function(response) {
                const stats = fs.statSync(program.filename)
                const fileSize = stats.size
                console.log('- Snapshot exported successfully to '+program.filename)
                console.log('- The file has size '+(fileSize / 1024 / 1024).toFixed(2)+"MB")
                console.log('- Removing snapshot...')
                XenBackup.removeVm(snap.Value, (err, res) => {
                  if (err) {
                    console.error(err)
                    return process.exit(1)
                  }
                  console.log('- Snapshot removed successfuly')
                  return process.exit(0)
                })
              })
              .on('error', function(err) {
                console.log('- ERROR while exporting snaphot:')
                console.error(err)
                return process.exit(1)
              })
              .pipe(fs.createWriteStream(program.filename))
            })
          })
        })
      }
    }
    if (!founded) {
      return console.error("VM not found in Xenserver.")
      return process.exit(1)
    }
  })
})

