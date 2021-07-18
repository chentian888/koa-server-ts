import { resolve } from 'path'
import * as Koa from 'koa'
import * as R from 'ramda'
import { glob } from 'glob'
import config, { ServerConfig } from './app/config'
import logger from './app/utils/log4js'

type ApiMiddleWare = (app: Koa) => unknown

class Server {
  private app: Koa
  private readonly config: ServerConfig

  constructor() {
    this.app = new Koa()
    this.config = config
    this.useMiddleware(this.app)
  }

  async start() {
    const { port, host } = this.config
    await this.app.listen(port, host, () => {
      logger.info(`server listen at ${host}:${port}`)
    })
  }

  useMiddleware(app: Koa): void {
    const middlewarePath = resolve(__dirname, './app/middleware/**/*.ts')
    glob(middlewarePath, (err, files) => {
      if (files.length) {
        R.map(R.compose(
          R.map((module: ApiMiddleWare) => {
            logger.info(`setting middleware ${module.name}`)
            return module(app)
          }),
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          (file: string):ApiMiddleWare[] => <ApiMiddleWare[]>require(file)
        ))(files)
      }
    })
  }
}

const app = new Server()
void app.start()
