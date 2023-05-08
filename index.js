const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./quaries.js');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: "http://localhost:3000"
}));

app.get('/', (req, res) => {
  res.json({ info: 'Node.js, Express, and Postgres API' });
});

app.get('/tables', db.getAllTables);
app.get('/tables/:table', db.getDataByTable);

app.post('/insert/:table', (req, res) => {
  const { table } = req.params;
  const data = req.body;
  db.insertData(table, data, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send(`Error inserting data into ${table}`);
    } else {
      res.status(201).send(`Data inserted into ${table}`);
    }
  });
});

app.delete('/delete/:table/:columnName/:columnValue', (req, res) => {
  const { table, columnName, columnValue } = req.params;
  db.deleteData(table, columnName, columnValue, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send(`Error deleting data from ${table}`);
    } else {
      res.status(200).send(`Data deleted from ${table}`);
    }
  });
});

app.put('/update/:table/:columnName/:id', (req, res) => {
  const { table, columnName, id } = req.params;
  const newData = req.body;
  db.updateData(table, columnName, id, newData, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send(`Error updating data in ${table}`);
    } else {
      res.status(200).send(`Data updated in ${table}`);
    }
  });
});



app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
