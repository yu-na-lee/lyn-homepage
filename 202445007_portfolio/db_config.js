const mysql = require('mysql2');

const dbConfig = {
  host: 'localhost', 
  user: 'root',     
  password: '0000', 
  database: '202445007_schema'
};

const connection = mysql.createConnection(dbConfig);

connection.connect(err => {
  if (err) {
    console.error('MySQL 연결 실패: ' + err.stack);
    return;
  }
  console.log('MySQL 연결 성공. Thread ID: ' + connection.threadId);
});

module.exports = connection.promise();