const express = require('express');
const cookieParser = require('cookie-parser');
const serverLog = require('easy-log')('app:server');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

const mysqlConfig = {
  host: 'localhost',
  user: 'root',
  database: 'wx_test',
  password: ''
}

app.use((req, res, next) => {
  serverLog(`${req.method} - ${req.originalUrl}`);
  next();
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.get('/count', (req, res, next) => {

  const conn = mysql.createConnection(mysqlConfig);

  conn.connect(err => {
    if (err) console.log(err);
  });

  const response = {
    success: false,
    count: 0,
    message: ""
  }

  const filter = JSON.parse(req.query.filter);
  let query = "";

  if (!filter.value) {
    query = "SELECT COUNT(*) AS count FROM road_signs"

  } else {
    query = "SELECT COUNT(*) AS count FROM road_signs";
    query += getWherePartOfQuery(filter);
  }

  conn.query(query, (err, result) => {
    if (result) {
      console.log("count", result);
      response.success = true;
      response.count = result[0].count;
      res.send(response);

    } else {
      response.message = 'Нет данных';
      res.send(response);
    }
  });

  conn.end(err => {
    if (err) throw err;
  });

});

app.get('/data', (req, res, next) => {

  const conn = mysql.createConnection(mysqlConfig);

  conn.connect(err => {
    if (err) console.log(err);
  });

  const response = {
    success: false,
    records: [],
    message: ""
  }

  const limit = (!isNaN(req.query.limit)) ? req.query.limit : 0;
  const offset = (!isNaN(req.query.offset)) ? req.query.offset : 0;

  const allowedOrderFields = ['the_date', 'name', 'amount', 'distance'];
  let orderBy = "";
  if (allowedOrderFields.includes(req.query.orderBy)) {
    orderBy = req.query.orderBy;
  }

  const allowedOrder = ['ASC', 'DESC'];
  let order = "";
  if (allowedOrder.includes(req.query.order.toUpperCase())) {
    order = req.query.order.toUpperCase();
  }

  const filter = JSON.parse(req.query.filter);

  let query = "";

  if (!filter.value) {
    query = `
      SELECT
        id,
        DATE_FORMAT(the_date, '%d.%m.%Y') as the_date,
        name,
        amount,
        distance
      FROM
        road_signs
      ORDER BY ${orderBy} ${order}
      LIMIT ${limit} OFFSET ${offset}
    `;

  } else {
    query = `
      SELECT
        id,
        DATE_FORMAT(the_date, '%d.%m.%Y') as the_date,
        name,
        amount,
        distance
      FROM
        road_signs`;

    query += getWherePartOfQuery(filter);

    query += `
      ORDER BY ${orderBy} ${order}
      LIMIT ${limit} OFFSET ${offset}
    `;
  }

  conn.query(query, (err, result) => {
    if (result) {
      response.success = true;
      response.records = result;
      res.send(response);

    } else {
      response.message = 'Нет данных';
      res.send(response);
    }
  });

  conn.end(err => {
    if (err) {
      console.log(err);
    }
  });

});

function getWherePartOfQuery(filter) {
  let str = "";

  if (filter.column == 'name' && filter.condition == 'contain') {
    str += ` WHERE name LIKE '%${filter.value}%'`;
  } else if (filter.column == 'amount' && filter.condition == 'equal') {
    str += ` WHERE amount = ${parseInt(filter.value)}`;
  } else if (filter.column == 'amount' && filter.condition == 'isMore') {
    str += ` WHERE amount > ${filter.value}`;
  } else if (filter.column == 'amount' && filter.condition == 'isLess') {
    str += ` WHERE amount < ${filter.value}`;
  } else if (filter.column == 'distance' && filter.condition == 'equal') {
    str += ` WHERE distance = ${parseInt(filter.value)}`;
  } else if (filter.column == 'distance' && filter.condition == 'isMore') {
    str += ` WHERE distance > ${filter.value}`;
  } else if (filter.column == 'distance' && filter.condition == 'isLess') {
    str += ` WHERE distance < ${filter.value}`;
  } else if (filter.column == 'the_date' && filter.condition == 'equal') {
    str += ` WHERE DATE(the_date) = '${filter.value}'`;
  } else if (filter.column == 'the_date' && filter.condition == 'isMore') {
    str += ` WHERE DATE(the_date) > '${filter.value}'`;
  } else if (filter.column == 'the_date' && filter.condition == 'isLess') {
    str += ` WHERE DATE(the_date) < '${filter.value}'`;
  } else if (filter.column == 'the_date' && filter.condition == 'contain') {
    str += ` WHERE DATE(the_date) LIKE '%${filter.value}%'`;
  }

  return str;
}

module.exports = app;
