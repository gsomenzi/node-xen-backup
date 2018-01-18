# node-xen-backup

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![NPM version](https://img.shields.io/npm/v/node-xen-backup.svg)](https://www.npmjs.com/package/node-xen-backup) 

<b>node-xen-backup</b> is a Node.js module that uses xen-api to take a snapshot of a Xenserver VM and export to a file for backup. The module includes a cli to execute direct on bash.

## You can contribute

It is a free software and its use is free for everyone, but if you want to contribute anyway, please submit a donation.

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=G9AL2VHXZRL92&lc=US&item_name=Xenserver%20backup%20script%20development%20costs%20and%20efforts&item_number=0001&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted)
 
## Support

 * Node.js (tested on >= 7.x)
 
## Installation

### Installing global for cli usage
```sh
> npm install -g node-xen-backup
```

### Installing as node module
```sh
> npm install node-xen-backup
```
```javascript
  const XenBackup = require('node-xen-backup')
```

## Cli

### Getting help

 ```sh
> xen-backup --help

# Usage: xen-backup [options]


# Options:
#
#    -V, --version              output the version number
#    -H, --host [host]          IP or hostname from Xenserver. Default: localhost.
#    -P, --port [port]          TCP port from Xenserver. Default: 80.
#    -u, --username [username]  Username to login in Xenserver.
#    -p, --password <password>  Password to login in Xenserver.
#    -f, --filename <filename>  Path to target file of exported snapshot.
#    -t, --type <type>          Type of object to export. <vm|vdi> default vm.
#    -v, --vm <vm>              VM name label or uuid to backup.
#    -h, --help                 output usage information
 ```

### Creating a backup to a VM
```sh
# Backup command
> xen-backup -H 192.168.1.1 -P 80 -u root -p password -f /backup/VMLinux.xva -v VMLinux
# Normal output
- Searching for VM VMLinux
- Searching VM real reference for UUID 38d15c62-a1a2-f5f8-de3d-55fb360e96c8
- Taking snapshot...
- Getting snapshot data...
- Exporting snapshot VMLinux1516035235 taked in January 15, 2018
- Will be saved on file /backup/VMLinux.xva
- The file has size 784.93MB
- Removing snapshot...
- Snapshot removed successfuly
```

## API

### Creating a backup
Example creating a backup using as Node.js module. This is very much like procedure used in cli.

```javascript
// [another requires...]

const XenBackup = require('node-xen-backup')

const connOptions = {
  username: 'root',
  password: 'password',
  host: '192.168.1.1',
  port: 80,
  sessionId: null
}
const destFileName = "/backup/filename.xva"

// First sets connecion options.
XenBackup.setClient(connOptions.host, connOptions.port)
// Login in xenserver xen-api.
XenBackup.login(connOptions.username, connOptions.password, (err, sessionId) => {
  if (err) return console.error(err)
  // Once logged sets session ID
  connOptions.sessionId = sessionId
  // Calls function to get itens
  getItens((err, itens) => {
    if (err) return console.error(err)
    let founded = false
    // Search for VM or VDI in returned itens
    for (let i in itens) {
      if (itens[i].uuid.toLowerCase() === program.vm.toLowerCase() || itens[i].name.toLowerCase() === program.vm.toLowerCase()) {
        founded = true
        // Takes snapshot
        itens[i].snapshot(itens[i].name.replace(/\s/g, '') + moment().unix(), (err, snapshot) => {
          if (err) return console.error(err)
          let protocol = 'http'
          if ((connOptions.port === '443') || (connOptions.port === 443)) protocol = 'https'
          // Call function to export snapshot
          downloadBackup(protocol, snapshot.uuid, (err, download) => {
            if (err) console.error(err)
            // Removes snapshot
            snapshot.remove((err, removed) => {
              if (err) return console.error(err)
              // SUCCESS!!!
              return console.log("VM OR VDI EXPORTED")
            })
          })
        })
      }
    }
    if (!founded) {
      return console.error('VDI or VHD not found in Xenserver.')
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
  if ((program.type !== 'vdi') && (program.type !== 'mv')) {
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
    req.pipe(GZip).pipe(fs.createWriteStream(destFileName))
  } else {
    req.pipe(fs.createWriteStream(destFileName))
  }
}
```
