const {
	ipcRenderer
} = require('electron');
const $ = require('jquery');



// Function to render files in the table



const renderFiles = (files) => {
	$('#fileTableBody').empty();
	files.forEach(file => {
		const row = $('<tr></tr>');
		row.html(`
            <td>${file.name}</td>
            <td>${file.type}</td>
            <td>${file.year}</td>
        `);
		$('#fileTableBody').append(row);
	});
};


// Function to filter files
const filterFiles = (searchQuery, fileType, fileYear) => {
	const filteredFiles = sampleData.filter(file => {
		const matchSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
		const matchType = fileType === 'all' ? true : file.type === fileType;
		const matchYear = fileYear === 'all' ? true : file.year === fileYear;
		return matchSearch && matchType && matchYear;
	});
	renderFiles(filteredFiles);
};

// Function to search table
const searchTable = (searchQuery) => {
	const filteredFiles = sampleData.filter(file => {
		const matchSearch =
			file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			file.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
			file.year.includes(searchQuery);
		return matchSearch;
	});
	renderFiles(filteredFiles);
};

// Function to generate year options
const generateYearOptions = () => {
	const yearSelect = $('#yearSelect');
	for (let year = 2024; year >= 2000; year--) {
		const option = $('<option></option>');
		option.val(year).text(year);
		yearSelect.append(option);
	}
};

// Call the function to generate year options when the page renders
generateYearOptions();

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
	filterFiles(searchQuery, fileType, fileYear);
});

// Event listener for year dropdown
$('#yearSelect').on('change', () => {
	const searchQuery = $('#searchInput').val().trim();
	const fileType = $('#typeSelect').val();
	const fileYear = $('#yearSelect').val();
	filterFiles(searchQuery, fileType, fileYear);
});

// Add event listener to show modal when "New Item" button is clicked
$('#createBtn').on('click', () => {
    console.log("Button clicked"); // Check if the event listener is triggered
    $('#myModal').css('display', 'block');
});

// Add event listener to close modal when "x" button is clicked
$('.close').on('click', () => {
	$('#myModal').css('display', 'none');
});

// Add event listener to save button in modal
$('#saveBtn').on('click', () => {
	const newItem = {
		name: $('#itemName').val(),
		type: $('#itemType').val(),
		year: $('#itemDate').val().substr(0, 4) // Extract year from date
	};
	// Save newItem to JSON file
	// Implement saving functionality here

	// Close modal
	$('#myModal').css('display', 'none');
	// Render all files, including the newly added item
	renderAllFiles();
});

// Add event listener to exit button in modal
$('#exitBtn').on('click', () => {
	// Close modal without saving
	$('#myModal').css('display', 'none');
});