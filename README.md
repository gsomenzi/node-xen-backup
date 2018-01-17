# node-xen-backup

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![NPM version](https://img.shields.io/npm/v/node-xen-backup.svg)](https://www.npmjs.com/package/node-xen-backup) 

<b>node-xen-backup</b> is a Node.js module that uses xen-api to take a snapshot of a Xenserver VM and export to a file for backup. The module includes a cli to execute direct on bash.

<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----MIIHZwYJKoZIhvcNAQcEoIIHWDCCB1QCAQExggEwMIIBLAIBADCBlDCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb20CAQAwDQYJKoZIhvcNAQEBBQAEgYBtzwvYarXzWBeF1f0285wjGbe52Zocb3Ow8fL40RgMSLPcXgGFPz8YqgGJwYf3Q5pgU1vN5HYF0r0uc/ofNPISbOzurlWBLac59H/6tr8xXt2bm/zQIGRgEQdq0Sz0b9Se2B1mh4S5sGl0sMnmDY9LbJ0k6ifo0c5UTzeHeUAZgTELMAkGBSsOAwIaBQAwgeQGCSqGSIb3DQEHATAUBggqhkiG9w0DBwQIpo3MqRyzgniAgcAG93VNTQdpMl3VDpm+t2WiDWAMDjaJw4ZwB5qewYxxwdlIV/z6AsZ2GsLSD3d9LosINbGG2GJzpzQjNq67MkF/D1VHOhWsWG3HPdHksIsHnbVUUFyQpfeHwod9mwTJZNUXtxgkPXLYJB0zDIe1QQvvx9gqcHtGnQI8C1k6lESOl5w3zD3SNO29Cpj35xFNGbhD2OYgGdD2juyouo/WbmWf1VLL2pRQDLcXme9Ao06KZwFGkO6w+HD5kBg/Bv9eWY+gggOHMIIDgzCCAuygAwIBAgIBADANBgkqhkiG9w0BAQUFADCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb20wHhcNMDQwMjEzMTAxMzE1WhcNMzUwMjEzMTAxMzE1WjCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb20wgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAMFHTt38RMxLXJyO2SmS+Ndl72T7oKJ4u4uw+6awntALWh03PewmIJuzbALScsTS4sZoS1fKciBGoh11gIfHzylvkdNe/hJl66/RGqrj5rFb08sAABNTzDTiqqNpJeBsYs/c2aiGozptX2RlnBktH+SUNpAajW724Nv2Wvhif6sFAgMBAAGjge4wgeswHQYDVR0OBBYEFJaffLvGbxe9WT9S1wob7BDWZJRrMIG7BgNVHSMEgbMwgbCAFJaffLvGbxe9WT9S1wob7BDWZJRroYGUpIGRMIGOMQswCQYDVQQGEwJVUzELMAkGA1UECBMCQ0ExFjAUBgNVBAcTDU1vdW50YWluIFZpZXcxFDASBgNVBAoTC1BheVBhbCBJbmMuMRMwEQYDVQQLFApsaXZlX2NlcnRzMREwDwYDVQQDFAhsaXZlX2FwaTEcMBoGCSqGSIb3DQEJARYNcmVAcGF5cGFsLmNvbYIBADAMBgNVHRMEBTADAQH/MA0GCSqGSIb3DQEBBQUAA4GBAIFfOlaagFrl71+jq6OKidbWFSE+Q4FqROvdgIONth+8kSK//Y/4ihuE4Ymvzn5ceE3S/iBSQQMjyvb+s2TWbQYDwcp129OPIbD9epdr4tJOUNiSojw7BHwYRiPh58S1xGlFgHFXwrEBb3dgNbMUa+u4qectsMAXpVHnD9wIyfmHMYIBmjCCAZYCAQEwgZQwgY4xCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJDQTEWMBQGA1UEBxMNTW91bnRhaW4gVmlldzEUMBIGA1UEChMLUGF5UGFsIEluYy4xEzARBgNVBAsUCmxpdmVfY2VydHMxETAPBgNVBAMUCGxpdmVfYXBpMRwwGgYJKoZIhvcNAQkBFg1yZUBwYXlwYWwuY29tAgEAMAkGBSsOAwIaBQCgXTAYBgkqhkiG9w0BCQMxCwYJKoZIhvcNAQcBMBwGCSqGSIb3DQEJBTEPFw0xODAxMTcxMjU3MTVaMCMGCSqGSIb3DQEJBDEWBBREdp00GUqGkV7qq+wQDI24dms4DTANBgkqhkiG9w0BAQEFAASBgBXSqyW7k8YHOsRM17W3qjvWyu5HsVv0raywrf2q62yxONkXSgijpfwGBCFCua9axFHGmbAk1LM9DGB0HWTa7T4rUSuMHiiBuD21qPGvuRa+WCAZ5aJC5W9PgWU05+cOc+xzMdQAWsZY6ZAPUjReluMnMG1AKWzwjRiNK/XAd8/6-----END PKCS7-----
">
<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
<img alt="" border="0" src="https://www.paypalobjects.com/pt_BR/i/scr/pixel.gif" width="1" height="1">
</form>
 
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
      if (vms[i].uuid.toLowerCase() === "vm_name_or_uuid" || vms[i].name.toLowerCase() === "vm_name_or_uuid") {
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
              .pipe(fs.createWriteStream("/backup/vm.xoa"))
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
