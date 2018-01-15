# node-xen-backup

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![NPM version](https://img.shields.io/npm/v/node-xen-backup.svg)](https://www.npmjs.com/package/node-xen-backup) 

<b>node-xen-backup</b> is a Node.js module that uses xen-api to take a snapshot of a Xenserver VM and export to a file for backup. The module includes a cli to execute direct on bash.
 
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
#   -V, --version              output the version number
#   -H, --host [host]          IP or hostname from Xenserver. Default: localhost.
#   -P, --port [port]          TCP port from Xenserver. Default: 80.
#   -u, --username [username]  Username to login in Xenserver.
#   -p, --password <password>  Password to login in Xenserver.
#   -f, --filename <filename>  Path to target file of exported snapshot.
#   -v, --vm <vm>              VM name label or uuid to backup.
#   -h, --help                 output usage information
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

const connOptions = {
  username: 'root',
  password: 'password',
  host: '192.168.1.1',
  port: 80
}

const XenBackup = require('node-xen-backup')
// First sets connecion options.
XenBackup.setClient(connOptions.host, connOptions.port)
// Login in xenserver xen-api.
XenBackup.login(connOptions.username, connOptions.password, (err, sessionId) => {
  if (err) return console.log(err)
  // Gets VMs.
  XenBackup.getAllVMs((err, vms) => {
    if (err) return console.log(err)
    let founded = false
    for (let i in vms) {
      if (vms[i].uuid.toLowerCase() === program.vm.toLowerCase() || vms[i].name.toLowerCase() === program.vm.toLowerCase()) {
        founded = true
        // Gets VMs real reference. UUID is not real reference.
        XenBackup.getByUuid(vms[i].uuid, (err, ref) => {
          if (err) return console.log(err)
          // Takes a snapshot.
          XenBackup.takeSnapshot(ref.Value, vms[i].name.replace(/\s/g, "")+moment().unix(), (err, snap) => {
            if (err) return console.log(err)
            // Now gets snapshot data by real reference.
            XenBackup.getByRef(snap.Value, (err, snapRecord) => {
              if (err) return console.log(err)
              // Uses request to download snapshot and pipes to a file.
              request.get('http://'+connOptions.username+':'+connOptions.password+'@'+connOptions.host+'/export?use_compression=true&uuid='+snapRecord.uuid)
              .on('end', function(response) {
                // Removes the snapshot used.
                XenBackup.removeVm(snap.Value, (err, res) => {
                  if (err) return console.log(err)
                  return console.log('- Snapshot removed successfuly')
                })
              })
              .on('error', function(err) {
                return console.error(err)
              })
              .pipe(fs.createWriteStream(program.filename))
            })
          })
        })
      }
    }
    // If no VM founded.
    if (!founded) {
      return console.error("VM not found in Xenserver.")
    }
  })
})
```