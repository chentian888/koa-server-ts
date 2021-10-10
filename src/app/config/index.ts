import { resolve } from 'path'
import Config from '../core/configFactory'
import { CoreConfigFactory } from '../types'

//TODO 自动加载config目录下相关文件
function initConfig(): CoreConfigFactory<Config> {
  const config: CoreConfigFactory<Config> = new Config()
  config.getConfigFromEnv()
  const env = config.getEnv()
  const envFile = resolve(__dirname, `./app/config/${env}.ts`)
  const message = resolve(__dirname, './app/config/message.ts')
  config.getConfigFromFile(envFile)
  config.getConfigFromFile(message)
  return config
}

export default initConfig()