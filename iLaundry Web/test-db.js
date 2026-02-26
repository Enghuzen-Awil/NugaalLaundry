const mysql = require('mysql2');
require('dotenv').config({path:'config.env'});

console.log('Testing connection with:');
console.log('Host:', process.env.DB_HOST);
console.log('User:', process.env.DB_USER);
console.log('Database:', process.env.DB_NAME);

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

conn.connect((err) => {
    if (err) {
        console.error('Connection failed!');
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.message);
        process.exit(1);
    }
    console.log('Connection successful!');
    
    conn.query('SHOW TABLES', (err, results) => {
        if (err) {
            console.error('Query failed!');
            console.error(err);
        } else {
            console.log('Tables in database:', results.map(r => Object.values(r)[0]));
        }
        conn.end();
        process.exit(0);
    });
});
