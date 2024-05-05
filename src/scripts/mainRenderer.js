const { ipcRenderer } = require('electron');

// Sample data
const sampleData = [
    { name: 'Tomato Grid', type: 'Tomato', year: '2022' },
    { name: 'Squash Notes', type: 'Squash', year: '2019' },
    { name: 'Tomato Grid', type: 'Tomato', year: '2022' },
    { name: 'Tomato Grid', type: 'Tomato', year: '2023' },
    { name: 'Cauliflower Grid', type: 'Cauliflower', year: '2022' },
    { name: 'Tomato Grid', type: 'Tomato', year: '2023' },
    { name: 'Tomato Grid', type: 'Tomato', year: '2023' },
    { name: 'Tomato Grid', type: 'Tomato', year: '2023' },
    { name: 'Tomato Grid', type: 'Tomato', year: '2023' },
    { name: 'Tomato Grid', type: 'Tomato', year: '2023' },
    { name: 'Tomato Grid', type: 'Tomato', year: '2023' },
    { name: 'Tomato Grid', type: 'Tomato', year: '2023' },
    { name: 'Tomato Grid', type: 'Tomato', year: '2023' },
    { name: 'Tomato Grid', type: 'Tomato', year: '2023' },
    { name: 'Tomato Grid', type: 'Tomato', year: '2023' },
    { name: 'Tomato Grid', type: 'Tomato', year: '2023' },
    { name: 'Tomato Grid', type: 'Tomato', year: '2023' },
    { name: 'Tomato Grid', type: 'Tomato', year: '2023' },
    { name: 'Tomato Grid', type: 'Tomato', year: '2023' },
    { name: 'Tomato Grid', type: 'Tomato', year: '2023' }
    // Add more sample data items as needed
];

// Function to render files in the table
function renderFiles(files) {
    const fileTableBody = document.getElementById('fileTableBody');
    fileTableBody.innerHTML = '';
    files.forEach(file => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${file.name}</td>
            <td>${file.type}</td>
            <td>${file.year}</td>
        `;
        fileTableBody.appendChild(row);
    });
}

// Initial rendering of files
renderFiles(sampleData);

// Function to filter files
function filterFiles(searchQuery, fileType, fileYear) {
    const filteredFiles = sampleData.filter(file => {
        const matchSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchType = fileType === 'all' ? true : file.type === fileType;
        const matchYear = fileYear === 'all' ? true : file.year === fileYear;
        return matchSearch && matchType && matchYear;
    });
    renderFiles(filteredFiles);
}

// Function to search table
function searchTable(searchQuery) {
    const filteredFiles = sampleData.filter(file => {
        const matchSearch = 
            file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            file.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            file.year.includes(searchQuery);
        return matchSearch;
    });
    renderFiles(filteredFiles);
}

// Function to generate year options
function generateYearOptions() {
    const yearSelect = document.getElementById('yearSelect');
    for (let year = 2024; year >= 2000; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

// Call the function to generate year options when the page renders
generateYearOptions();

// Event listener for search input
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', () => {
    const searchQuery = searchInput.value.trim();
    searchTable(searchQuery);
});

// Event listener for type dropdown
const typeSelect = document.getElementById('typeSelect');
typeSelect.addEventListener('change', () => {
    const searchQuery = searchInput.value.trim();
    const fileType = typeSelect.value;
    const fileYear = document.getElementById('yearSelect').value;
    filterFiles(searchQuery, fileType, fileYear);
});

// Event listener for year dropdown
const yearSelect = document.getElementById('yearSelect');
yearSelect.addEventListener('change', () => {
    const searchQuery = searchInput.value.trim();
    const fileType = document.getElementById('typeSelect').value;
    const fileYear = yearSelect.value;
    filterFiles(searchQuery, fileType, fileYear);
});