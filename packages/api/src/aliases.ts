import moduleAlias from 'module-alias'
import path from 'path'

moduleAlias.addAlias('@api', __dirname)
moduleAlias.addAlias('@common', path.join(__dirname, '..', '..', 'common', 'src'))

moduleAlias()
