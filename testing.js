/**
 * Testing file to test mass insertion for database and gui purpose
 */

const SQLManager = require('./src/scripts/dbManager');

let sqlManager = new SQLManager();

let injectData = async () => {
    for(let i = 0; i < 50; i++) {

        let year = Math.floor(Math.random() * (2024 - 2000) + 2000);
        let name = 'Year ' + year
        let type = i % 2 === 0 ? 'Squash' : 'Tomato';
        let plants = Math.floor(Math.random() * 1000);
    
        let query = "INSERT INTO plant_year (name, type, year, plants) VALUES (?, ?, ?, ?)";
        let params = [name, type, year, plants];
    
        await sqlManager.executeQuery(query, params);
    }
}

let deleteData = async () => {

    let query = "DELETE FROM plant_year";
    let params = [];

    await sqlManager.executeQuery(query, params);

}

