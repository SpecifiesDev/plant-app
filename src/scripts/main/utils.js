const $ = require('jquery');
const fs = require('fs');
const path = require('path');


const error = require(`../errorHandler.js`);

/**
 * Function to add an item to the item
 * @param {*} item An object containing the pertinent data to add
 * @param {*} index Index of the item, usually next in row
 */
const addItemToTable = (item, index) => {
    const row = $('<tr></tr>');
    const name = $('<td></td>').text(item.name);
    const type = $('<td></td>').text(item.type);
    const year = $('<td></td>').text(item.year);
    row.append(name, type, year);
	row.append(`<td><button class="deleteBtn" data-index="${index}">Delete</button></td>`); // Add delete button
    $('#fileTableBody').append(row);
}

/**
 * Function to filter the table based on the search query, file type, and file year
 */
const filterTable = (searchQuery, fileType, fileYear) => {
    const tableRows = $('#fileTableBody').find('tr'); // Get all table rows
    
    tableRows.each((index, row) => {
        const fileName = $(row).find('td:nth-child(1)').text().toLowerCase();
        const fileTypeValue = $(row).find('td:nth-child(2)').text().toLowerCase();
        const fileYearValue = $(row).find('td:nth-child(3)').text();

        const matchSearch = fileName.includes(searchQuery.toLowerCase());
        const matchType = fileType === 'all' ? true : fileTypeValue === fileType.toLowerCase();
        const matchYear = fileYear === 'all' ? true : fileYearValue === fileYear;

        if (matchSearch && matchType && matchYear) {
            $(row).show();
        } else {
            $(row).hide();
        }
    });
};

/**
 * Function to search the table based on the search query
 * @param {*} searchQuery The child to query
 */
const searchTable = (searchQuery) => {
    const tableRows = $('#fileTableBody').find('tr'); // Get all table rows
    
    tableRows.each((index, row) => {
        const fileName = $(row).find('td:nth-child(1)').text().toLowerCase();
        const fileTypeValue = $(row).find('td:nth-child(2)').text().toLowerCase();
        const fileYearValue = $(row).find('td:nth-child(3)').text();

        const matchSearch = fileName.includes(searchQuery.toLowerCase()) ||
                            fileTypeValue.includes(searchQuery.toLowerCase()) ||
                            fileYearValue.includes(searchQuery);

        if (matchSearch) {
            $(row).show();
        } else {
            $(row).hide();
        }
    });
};

/**
 * Function to generate year options for the select element
 */
const generateYearOptions = () => {
    const yearSelect = $('#yearSelect');
    for (let year = 2024; year >= 2000; year--) {
        const option = $('<option></option>');
        option.val(year).text(year);
        yearSelect.append(option);
    }
};

/**
 * Function to close the creation modal
 * Will also clear all the input fields to make it ready for the next use
 */
const closeCreationModal = () => {
	$('#myModal').css('display', 'none');
	$('#myModal').find('input[type="text"]').val('');
	$('#myModal').find('input[type="date"]').val('');
	$('#myModal').find('select').prop('selectedIndex', 0);
	$('#itemRows').val(0);
	$('#itemRowsNumber').val(0);
    updateRowIndicator(0);
}

// Function to update the row indicator
const updateRowIndicator = (value) => {
	$('#rowIndicator').text(`${value} plants`);
}

module.exports = { filterTable, searchTable, generateYearOptions, closeCreationModal, updateRowIndicator, addItemToTable };