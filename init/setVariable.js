const env = process.env.NODE_ENV

ck.IS_FIRST_PROCESS = parseInt(process.env.WORKER_INDEX || 0, 10) === 0
ck.CAN_DROP_DB = ck.IS_FIRST_PROCESS && (env === `dev` || env === `beta`)
