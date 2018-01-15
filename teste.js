const XenBackup = require('./')

XenBackup.setClient('172.16.74.10', 80)
XenBackup.login('root', 'b1fr5GG', (err, res) => {
  if (err) return console.log(err)
  XenBackup.getAllVMs((err, res) => {
    if (err) return console.log(err)
    return console.log(res)
  })
})