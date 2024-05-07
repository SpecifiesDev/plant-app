const $ = require('jquery');
const fs = require('fs');

const showError = (message) => {
    
    let errorContainer = $('#error-container');

    // set the text to the new message

    errorContainer.html(`${message}<span class="close-btn">&times;</span>`);

    // show the error container
    errorContainer.addClass('show')

    // set a new timeout to automatically hide this container after 5 seconds
    setTimeout(() => {
      errorContainer.hide();
    }, 5000);

}

const hideError = () => {
    $('#error-container').css('right', '-400px');
    $('#error-container').removeClass('show');
}

module.exports = {
    showError,
    hideError
}