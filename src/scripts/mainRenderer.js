const {ipcRenderer} = require('electron');
const $ = require('jquery');
const fs = require('fs');
const path = require('path');

// even though we are calling this in render process, render process is
// instantiated by index.html, so we begin in the root directory of /plant-app
const error = require(`${__dirname}/src/scripts/errorHandler.js`);
const { filterTable, searchTable, generateYearOptions, closeCreationModal, updateRowIndicator, addItemToTable } = require(`${__dirname}/src/scripts/main/utils.js`);


const SQLManager = require(`${__dirname}/src/scripts/dbManager.js`);

let sqlManager;

// due to path limitations, render files needs to be in the main class.
const renderDatabase = async () => {
    $('#fileTableBody').empty();

	try {
		
		// query, order desc
		const query = "SELECT * FROM plant_year ORDER by YEAR DESC";
		const params = []

		let results = await sqlManager.executeQuery(query, params);

		if(Array.isArray(results)) {
			results.forEach((row, index) => {
				addItemToTable(row, index);
			});
		} else {
			error.showError("Error querying database, unexpected query return format.");
		}

	} catch(err) {
		error.showError("Error querying database, check console for more info.");
		console.error(err);
	}
};


// new jquery equiv for $(document).ready()
$(() => {

	ipcRenderer.on('sql-manager-ready', async (event, data) => {
		if(!data.success) {
			error.showError("Database was not properly created, refer to console for errors.");
		} else {
			

			sqlManager = await new SQLManager();

			renderDatabase(); // we call here to make sure the database is ready to call to
		}
	})

	// Event listener for search input
	$('#searchInput').on('input', () => {
		const searchQuery = $('#searchInput').val().trim();
		searchTable(searchQuery);
	});

	// Event listener for type dropdown
	$('#typeSelect').on('change', () => {
		const searchQuery = $('#searchInput').val().trim();
		const fileType = $('#typeSelect').val();
		const fileYear = $('#yearSelect').val();
		filterTable(searchQuery, fileType, fileYear);
	});

	// Event listener for year dropdown
	$('#yearSelect').on('change', () => {
		const searchQuery = $('#searchInput').val().trim();
		const fileType = $('#typeSelect').val();
		const fileYear = $('#yearSelect').val();
		filterTable(searchQuery, fileType, fileYear);
	});

	// Add event listener to show modal when "New Item" button is clicked
	$('#createBtn').on('click', () => {
		$('#myModal').css('display', 'block');
	});

	// Add event listener to close modal when "x" button is clicked
	$('.close').on('click', () => {
		closeCreationModal();
	});

	// Add event listener to save button in modal
	$('#saveBtn').on('click', async () => {
		// create a new item object from the modal info
		const item = {
			name: $('#itemName').val(),
			type: $('#itemType').val(),
			year: $('#itemDate').val().substr(0, 4), // only the year
			rows: $('#itemRows').val()
		}

		try {
			const query = "INSERT INTO plant_year (name, type, year, plants) VALUES (?, ?, ?, ?)";
			const params = [item.name, item.type, item.year, item.rows];

			const result = await sqlManager.executeQuery(query, params);

			// if result is not null and an id was return (auto increment)
			if(result && result.insertId) {
				item.ID = result.insertId;
				addItemToTable(item, $("#fileTableBody tr").length); // add item to table at end of list
				closeCreationModal(); // close the modal
			} else {
				error.showError("Error inserting item into database. No ID was returned from the database connection.");
			}
		} catch(err) {
			error.showError("Error inserting item into database, check console for more info.");
			console.error(err);
		}
	});

	// when a delete button is clicked, delete the file, and delete the row from the table.
	$('#fileTableBody').on('click', '.deleteBtn', async (e) => {

		// get the target's id
		const target = $(e.target).data('id');

		console.log(target);

		// try to delete the object from the database
		try {
			const query = "DELETE FROM plant_year WHERE ID = ?";
			const params = [target];

			const result = await sqlManager.executeQuery(query, params);

			// if result isnt null and a row was modified it was successful
			if(result && result.affectedRows > 0) {
				$(e.target).closest('tr').remove(); // remove the item from table
			} // else we show an error
			else {
				error.showError("Error deleting item from database, check console for more info.");
			}
		} catch(err) {
			console.error(err);
		}


	});

	// Close modal without saving
	$('#exitBtn').on('click', () => {
		$('#myModal').css('display', 'none');
		closeCreationModal();
	});

	// When an item row slider is changed, update the row indicator, as well as the input field
	$("#itemRows").on('input', () => {
		const sliderValue = $("#itemRows").val();
	
		updateRowIndicator(sliderValue);
		$('#itemRowsNumber').val(sliderValue);
	});

	// same as previous but update the slider instead of the input field
	$('#itemRowsNumber').on('input', () => {
		let numberValue = $("#itemRowsNumber").val();
	
		updateRowIndicator(numberValue);
		$('#itemRows').val(numberValue);
	});

	// give the user the ability to close any error message before the 5 second interval goes out
	$('#error-container').on('click', () => {
		error.hideError();
	});


	// generate the year options into the input dropdown
	generateYearOptions();

});

















