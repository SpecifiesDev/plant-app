// Primary database manager for this application

// we will rely on mariadb, as our hosted database is mdb
const mariadb = require('mariadb');

// for error handling to indicate to the user any errors
const error = require('./errorHandler.js');

// create a class manager
class SQLManager {

    // construct a new sql pool
    constructor() {
        this.pool = mariadb.createPool({
            host: 'null',
            user: 'null',
            password: 'null',
            database: 'plant-app',
            port: 3306
        });
    }

    async init() {
        await this.ensureConnection();
        await this.checkIfTablesExist();
    }

    /**
     * Function to ensure that the connection is established
     */
    async ensureConnection() {
        let conn;

        try {
            await this.pool.getConnection();
            console.log('Verified connection to database');
        } catch(err) {
            //error.showError('There was an error connecting to the database. Check console for more info.');
            console.error(err);
        } finally {
            // release conn back to pool
            if (conn) conn.release();
        }
    }

    /**
     * Function to check if the tables exist in our connected database.
     */
    async checkIfTablesExist() {
        let conn;

        try {
            conn = await this.pool.getConnection();

            const result = await conn.query('SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = ? AND table_name = ?', ['plant-app', 'plant_year']);

            // if resul[0].count is 0, then the table does not exist, let's execute a query to create it
            if (result[0].count === 0) {

                await conn.query(`CREATE TABLE plant_year (
                    ID INT PRIMARY KEY AUTO_INCREMENT,
                    name VARCHAR(255) NOT NULL,
                    type VARCHAR(100),
                    year INT,
                    plants INT
                )`);

                console.log('Created table plant_year');

            } else console.log('Table plant_year is established in the database.');
        } catch(err) {
            //error.showError('There was an error verifying database tables. Check console for more info.');
            console.error(err);
        } finally {
            if (conn) conn.release();
        }
    } 

    async executeQuery(query, params) {
        let conn;

        try {
            conn = await this.pool.getConnection();

            const result = await conn.query(query, params);

            return result;
        } catch(err) {
            //error.showError('There was an error executing a database call. Check console for more info.');
            console.error(err);
        } finally {
            if (conn) conn.release();
        }
    }

}


module.exports = SQLManager;