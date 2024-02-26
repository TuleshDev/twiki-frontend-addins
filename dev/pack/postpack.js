const path = require('path')
const fs = require('fs-extra')

fs.copySync(path.join(process.cwd(), './dev/pack/tmp/package.json'), path.join(process.cwd(), './package.json'))
fs.removeSync(path.join(process.cwd(), './dev/pack/tmp'))
