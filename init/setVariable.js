const env = process.env.NODE_ENV

ck.PROJECT_PATH = process.env.PWD
ck.APP_PATH = `${ck.PROJECT_PATH}/app`
ck.APP_VERSION = require(`package.json`).version
ck.VIEW_PATH = `${ck.PROJECT_PATH}/public`
ck.API_DOC_ROUTE_PATH = `/apidoc`
ck.WORKER_INDEX = parseInt(process.env.WORKER_INDEX || 0, 10)
ck.IS_FIRST_PROCESS = ck.WORKER_INDEX === 0
ck.CAN_DROP_DB = ck.IS_FIRST_PROCESS && (env === `dev` || env === `beta`)
