require('dotenv').config()

import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'

import { createAdapter } from '@socket.io/cluster-adapter'
import { setupWorker } from '@socket.io/sticky'

import { Match, Bar } from '../../models'

import { subscribe, unsubscribe } from './sockets'
import { pushDeal, pushAccountNewMatch } from './pushes'

const redis = require('redis')
const client = redis.createClient()
const subscriber = client.duplicate()

const httpServer = createServer()
const io = new Server(httpServer, { cors: { origin: '*' } })

//io.adapter(createAdapter())
//setupWorker(io)

httpServer.listen(process.env.PORT || 7002, function () {
  console.log(`SocketService Listening on port ${process.env.PORT || 7002}`)
})

async function main() {
  const uri = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/alcor_prod_new`
  await mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
  await client.connect()
  await subscriber.connect()

  // FOR PM2
  //process.send('ready')
  process.on('SIGINT', async () => {
    await mongoose.connection.close()
    await httpServer.close()
    //httpServer.close()

    //await client.quit()

    process.exit(0)
  })

  io.on('connection', socket => {
    console.log(socket.client.conn.server.clientsCount + 'users connected')

    subscribe(io, socket, client)
    unsubscribe(io, socket)
  })

  Match.watch().on('change', ({ fullDocument: match, operationType }) => {
    if (operationType != 'insert') return

    pushDeal(io, match)
    pushAccountNewMatch(io, match)
  })

  Bar.watch().on('change', async (op) => {
    let bar

    if (op.operationType == 'update') {
      const { documentKey: { _id } } = op
      bar = await Bar.findById(_id)
    } else if (op.operationType == 'insert') {
      bar = op.fullDocument
    }

    const { chain, market, timeframe, time, close, open, high, low, volume } = bar
    const tick = { close, open, high, low, volume, time: new Date(time).getTime() }
    io.to(`ticker:${chain}.${market}.${timeframe}`).emit('tick', tick)
  })

  subscriber.subscribe('orderbook_update', msg => {
    const { key, update } = JSON.parse(msg)
    const [chain, side, market] = key.split('_')

    io.to(`orderbook:${chain}.${side}.${market}`).emit(`orderbook_${side}`, update)
  })
}

main()
