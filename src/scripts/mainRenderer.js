const {ipcRenderer} = require('electron');
const $ = require('jquery');
const fs = require('fs');
const path = require('path');

// even though we are calling this in render process, render process is
// instantiated by index.html, so we begin in the root directory of /plant-app
const error = require(`${__dirname}/src/scripts/errorHandler.js`);
const { filterTable, searchTable, generateYearOptions, closeCreationModal, updateRowIndicator, addItemToTable } = require(`${__dirname}/src/scripts/main/utils.js`);


// due to path limitations, render files needs to be in the main class.
const renderFiles = () => {
    $('#fileTableBody').empty();
    fs.readdir(`${__dirname}/data`, (err, files) => {

        // if there was an error indicate in console, may create a popup later
        if (err) {
            error.showError(`Error reading files: ${err}`);
            return;
        }

        // loop over each file
        files.forEach((file, index) => {

            // get path of target file
            const filePath = path.join(`${__dirname}/data`, file);

            // read the file and process the data into the table
            fs.readFile(filePath, 'utf8', (err, data) => {
                // error log
                if (err) {
                    error.showError(`Error reading file: ${file}`);
					console.error(err);
                    return;
                }

                try {
                    const parsedJSON = JSON.parse(data);

                    addItemToTable(parsedJSON, index);


                } catch (err) {
                    error.showError(`Error parsing JSON: ${err}`);
					console.error(err);
                    return;
                }
            });

        });

    });
};


// new jquery equiv for $(document).ready()
$(() => {

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
		const newItem = {
			name: $('#itemName').val(),
			type: $('#itemType').val(),
			year: $('#itemDate').val().substr(0, 4),
			plants: $('#itemRows').val()
		};
		// Save newItem to JSON file
		// Implement saving functionality here

		// Close modal
		closeCreationModal();

		// Render all files, including the newly added item

		if (fs.existsSync(`${__dirname}/data/${newItem.name}.json`)) {
			error.showError("Object with this name already exists. Please choose a different name or delete the old record.");
		} else {
			
			await fs.writeFileSync(`${__dirname}/data/${newItem.name}.json`, JSON.stringify(newItem, null, 2));
			renderFiles();
		}
	});

	// when a delete button is clicked, delete the file, and delete the row from the table.
	$('#fileTableBody').on('click', '.deleteBtn', (e) => {

		// get the row containing the delete button
		const row = $(e.target).closest('tr');

		const name = row.find('td:eq(0)').text(); 
		const type = row.find('td:eq(1)').text(); 
		const year = row.find('td:eq(2)').text();

		fs.unlink(`${__dirname}/data/${name}.json`, (err) => {
			if (err) {
				error.showError(`Error deleting file: ${err}`);
				console.error(err);
				return;
			}

			row.remove();
		});


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

	// initial call to render any files that are in the data directory
	renderFiles();

	// generate the year options into the input dropdown
	generateYearOptions();

});

















