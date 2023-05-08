const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '192.168.31.195',
  database: 'api',
  password: 'admin',
  port: 5432,
});

const getAllTables = (req, res) => {
  const query = `SELECT table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE' AND table_schema = 'test'`;
  pool.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error fetching data');
    } else {
      res.status(200).json(results.rows);
    }
  });
};

const getDataByTable = (req, res) => {
  const table = req.params.table;
  const query = `SELECT * FROM test."${table}"`;
  pool.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error fetching data');
    } else {
      res.status(200).json(results.rows);
    }
  });
};

const insertData = (tableName, data, callback) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const insertStatement = `INSERT INTO test."${tableName}" (${keys.join(",")}) VALUES(${keys.map((_, i) => `$${i+1}`).join(",")})`;
  pool.query(insertStatement, values, (error, results) => {
    if (error) {
      console.error(error);
      callback(error);
    } else {
      console.log(`Successfully inserted data into ${tableName}`);
      callback(null, results);
    }
  });
};

const deleteData = (tableName, columnName, columnValue, callback) => {
  const query = `DELETE FROM test."${tableName}" WHERE "${columnName}" = $1`;
  pool.query(query, [columnValue], (error, results) => {
    if (error) {
      console.error(error);
      callback(error);
    } else {
      console.log(`Successfully deleted data from ${tableName}`);
      callback(null, results);
    }
  });
};

const updateData = (tableName, columnName, dataId, newData, callback) => {
  const keys = Object.keys(newData);
  const values = Object.values(newData);
  const updateStatement = `UPDATE test."${tableName}" SET ${keys.map((key, i) => `"${key}" = $${i+1}`).join(",")} WHERE "${columnName}" = $${keys.length + 1}`;
  pool.query(updateStatement, [...values, dataId], (error, results) => {
    if (error) {
      console.error(error);
      callback(error);
    } else {
      console.log(`Successfully updated data in ${tableName}`);
      callback(null, results);
    }
  });
};

module.exports = {
  getAllTables,
  getDataByTable,
  insertData,
  deleteData,
  updateData,
};
