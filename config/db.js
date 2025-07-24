import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10
});

console.log("Toma aqui meu host! ", process.env.DB_HOST);

if(!pool){
    console.error("Database connection pool could not be created.");
}else{
    console.log("Database connection pool created successfully.");
}

export default pool;