import express from "express"
import { createClient } from "redis"
import * as mysql from "mysql2"

const app = express()
const port = 3000

const redisHost = process.env.REDIS_HOST ? process.env.REDIS_HOST : "";
const redisPort = process.env.REDIS_PORT ? process.env.REDIS_PORT : "";

const client = createClient({
  url: `redis://${redisHost}:${redisPort}`,
});

var connection;

app.get('/', (req, res) => {
  res.send('root')
})

app.get('/redis', (req,res) => {
  res.send({
    message: "Connected to Redis"
  })
})

app.get('/mysql', (req,res) => {
  res.send({
    message: "Connected to MySQL"
  })
})

app.get('/mysql/set/:name', (req,res) => {
  a = connection.query(`select * from test`)
  res.send({
    name: req.params['name'],
  })
})

app.get('/mysql/get/:name', (req,res) => {
  a = connection.query(`select * from test`)
  res.send({
    name: req.params['name'],
  })
})

app.get('/redis/set/:key/:value', async (req, res) => {
  await client.set(req.params['key'], req.params['value']);
  res.send({
    key: req.params['key'],
    value: req.params['value']
  })
})

app.get('/redis/get/:key', async (req, res) => {
  const value = await client.get(req.params['key']);
  res.send({
    value,
  })
})

app.listen(port, async () => {
  await connectRedis()
  console.log(`Example app listening on port ${port}`)
})

const connectRedis = async () => {
  await client.connect();
  client.on("error", (err) => { console.log("Redis Client Error", err); process.exit(1); });
};
