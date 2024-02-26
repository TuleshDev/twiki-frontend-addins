const path = require('path')
const fs = require('fs-extra')

fs.ensureDirSync(path.join(process.cwd(), './dev/pack/tmp'))
fs.copySync(path.join(process.cwd(), './package.json'), path.join(process.cwd(), './dev/pack/tmp/package.json'))
fs.copySync(path.join(process.cwd(), './dev/pack/package.json'), path.join(process.cwd(), './package.json'))
