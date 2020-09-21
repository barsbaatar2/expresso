/* Express App */
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import compression from 'compression'
import customLogger from '../utils/logger'
const mysql = require('mysql');
const db = mysql.createConnection ({
  host: "remotemysql.com",
  user: "YlO55imx4W",
  password: "xe5gPs4pNo",
  database: "YlO55imx4W"
});

/* My express App */
export default function expressApp(functionName) {
  const app = express()
  const router = express.Router()

  db.connect((err) => {
    if (err) {console.log('Error connected to database' + err);}
    console.log('Connected to database');
  });
  global.db = db;

  router.use(compression())
  router.use(cors())
  router.use(bodyParser.json())
  router.use(bodyParser.urlencoded({ extended: true }))

  const routerBasePath = process.env.NODE_ENV === 'dev' ? `/${functionName}` : `/.netlify/functions/${functionName}/`

  app.use(morgan(customLogger))
  app.use(express.json());
  app.use(routerBasePath, router)

  router.get('/users', (req, res) => {
    let query = `SELECT * FROM users`;
    let resulty;
    
    db.query(query, (err, result) => {
      if (err) { res.redirect('/'); }
      console.log(JSON.stringify(result))
      resulty=result[0];
      res.json({
        user: resulty,
      })
    })
  })

  router.post('/users', (req, res) => {
    let query = `INSERT INTO users (username, password, age, type) VALUES ('${req.body.username}', '${req.body.password}', '${req.body.age}', '${req.body.type}');`;
    // res.send(query)
    db.query(query, (err, result) => {
      if (err) { res.redirect('/'); }
      res.send(result)
    })
  })

  return app
}
