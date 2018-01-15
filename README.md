# node-xen-backup

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![NPM version](https://img.shields.io/npm/v/sz-iptools.svg)](https://www.npmjs.com/package/node-xen-backup) 

<b>node-xen-backup</b> is a Node.js module that uses xen-api to take a snapshot of a Xenserver VM and export to a file for backup. The module includes a cli to execute direct on bash.
 
* <b>IPRouter</b>: (Just some methods implemented) Gets routes information. Manages routes, tables and routing rules.
  * getRoutes
  * getDefaultGateway
  * getIpForward
  * setIpForward

## Support

 * Node.js (tested on >= 7.x)
 
## Installation

```sh
> npm install -g node-xen-backup
```

## Cli

### Loading IPCalculator module
 ```javascript
 const SzIPCalculator = require('sz-iptools').IPCalculator
 ```
### Loading ConnTester module
 ```javascript
 const SzConnTester = require('sz-iptools').ConnTester
 ```
### Loading IFaceConfigurator module
 ```javascript
 const SzIFaceConfig = require('sz-iptools').IFaceConfigurator
 ```
### Loading IPRouter module
 ```javascript
 const SzIPRouter = require('sz-iptools').IPRouter
 ```

## API

### IPCalculator

#### SzIPCalculator.isIPv4(string, callback)
Evaluate if the string passed is a valid IPv4 address.

*string* (string) IP address to evaluate. Must to be a string, can contain netmask, cidr prefix or not.

*callback* (function) Function executed as callback. Arguments (err, boolean).

```javascript
// Checks if 192.168.1.1 is a valid IPv4 address.
SzIPCalculator.isIPv4('192.168.1.1', (err, isValidIp) => {
  if (err) return console.error(err)
  if (!isValidIp) return console.log('192.168.1.1 NOT an valid IPv4 address')
  return console.log('192.168.1.1 Valid IPv4 address')
})
// Checks if 192.168.1.1/24 is a valid IPv4 address.
SzIPCalculator.isIPv4('192.168.1.1/24', (err, res) => {
  if (err) return console.error(err)
  if (!isValidIp) return console.log('192.168.1.1/24 NOT an valid IPv4 address')
  return console.log('192.168.1.1/24 Valid IPv4 address')
})
// Checks if 192.168.1.1/255.255.255.0 is a valid IPv4 address.
SzIPCalculator.isIPv4('192.168.1.1/255.255.255.0', (err, res) => {
  if (err) return console.error(err)
  if (!isValidIp) return console.log('192.168.1.1/255.255.255.0 NOT an valid IPv4 address')
  return console.log('192.168.1.1/255.255.255.0 Valid IPv4 address')
})
```