import express from "express"
import { createClient } from "redis"
import * as mysql from "mysql2"
import e from "express"

const app = express()
const port = 3000

const redisHost = process.env.REDIS_HOST ? process.env.REDIS_HOST : "";
const redisPort = process.env.REDIS_PORT ? process.env.REDIS_PORT : "";

const client = createClient({
  url: `redis://${redisHost}:${redisPort}`,
});

const host = process.env.MYSQL_HOST ? process.env.MYSQL_HOST : "";
const user = process.env.MYSQL_USER ? process.env.MYSQL_USER : "";
const database = process.env.MYSQL_DATABASE ? process.env.MYSQL_DATABASE : "";
const password = process.env.MYSQL_PASSWD ? process.env.MYSQL_PASSWD : "";
const mysqlPort = process.env.MYSQL_PORT ? process.env.MYSQL_PORT : "";

const connection = mysql.createConnection({
  host,
  user,
  database,
  password,
  port: mysqlPort
});

app.get('/', (req, res) => {
  res.send('root')
})

app.get('/redis', (req,res) => {
  res.send({
    message: "Connected to Redis"
  })
})

app.get('/mysql', (req,res) => {
  connection.query('select * from test', (err, result) => {
    console.log("result:", result)
  })
  res.send({
    message: "Connected to MySQL"
  })
})

app.get('/mysql/get/:name', (req,res) => {
  if (!req.params['name']) {
    return res.status(400).send({
      error: "Specify name"
    })
  } else {
    connection.execute('select * from `test` where `name` = ? limit 1', [req.params['name']], (err, result) => {
      console.log("result:", result)
      if(err != null || err != undefined) {
        console.log(err)
        return res.status(500).send({
          error: "An error has occured"
        })
      } else {
        if (result.length > 0) {
          return res.status(200).send({
            id: result[0]['id'],
            name: result[0]['name'],
          })
        } else {
          return res.status(404).send({
            error: 'User not found'
          })
        }
      }
    })
  }
})

app.get('/mysql/set/:name', (req,res) => {
  if(!req.params['name']) {
    return res.status(400).send({
      error: "Specify name"
    })
  } else {
    connection.execute('insert into `test` (name) values (?)', [req.params['name']], (err, result) => {
      console.log("result:", result)
      if(err != null || err != undefined) {
        console.log(err)
        return res.status(500).send({
          error: "An error has occured"
        })
      }
      return res.status(200).send({
        success: "true",
        insertId: result.insertId,
      })
    })
  }
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
