// Get DOM elements
const cardholderNameInput = document.getElementById('cardholder-name');
const cardNumberInput = document.getElementById('card-number');
const expMonthInput = document.getElementById('exp-month');
const expYearInput = document.getElementById('exp-year');
const cvcInput = document.getElementById('cvc');
const confirmBtn = document.querySelector('.confirm-btn');
const continueBtn = document.querySelector('.continue-btn');
const cardForm = document.querySelector('.card-form');
const successForm = document.querySelector('.success-form');

// Display elements
const cardNumberDisplay = document.querySelector('.card-number-display');
const cardholderNameDisplay = document.querySelector('.cardholder-name-display');
const expDateDisplay = document.querySelector('.exp-date-display');
const cvcDisplay = document.querySelector('.cvc-display');

// Error elements
const nameError = document.getElementById('name-error');
const cardError = document.getElementById('card-error');
const dateError = document.getElementById('date-error');
const cvcError = document.getElementById('cvc-error');

// Real-time card display updates
cardholderNameInput.addEventListener('input', () => {
    cardholderNameDisplay.textContent = cardholderNameInput.value || 'Jane Appleseed';
});

cardNumberInput.addEventListener('input', (e) => {
    // Only allow numbers and format with spaces
    let value = e.target.value.replace(/\s+/g, ' ');

    // Remove all spaces first, then only keep digits
    let digits = value.replace(/\s/g, '');

    // Limit to 16 digits
    if (digits.length > 16) {
        digits = digits.substring(0, 16);
    }

    // Format with spaces every 4 digits
    let formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');

    // Only update if value changed to avoid cursor issues
    if (e.target.value !== formatted) {
        e.target.value = formatted;
    }

    // Update display with padding
    let displayValue = digits.padEnd(16, '0');
    displayValue = displayValue.replace(/(\d{4})(?=\d)/g, '$1 ');
    cardNumberDisplay.textContent = digits ? formatted : '0000 0000 0000 0000';
});

expMonthInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
    updateExpDate();
});

expYearInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
    updateExpDate();
});

cvcInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
    cvcDisplay.textContent = e.target.value || '000';
});

function updateExpDate() {
    const month = expMonthInput.value || '00';
    const year = expYearInput.value || '00';
    expDateDisplay.textContent = `${month.padStart(2, '0')}/${year.padStart(2, '0')}`;
}

// Validation functions
function showError(input, errorElement, message) {
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function clearError(input, errorElement) {
    input.classList.remove('error');
    errorElement.textContent = '';
    errorElement.classList.remove('show');
}

function validateName() {
    const value = cardholderNameInput.value.trim();
    if (!value) {
        showError(cardholderNameInput, nameError, "Can't be blank");
        return false;
    }
    clearError(cardholderNameInput, nameError);
    return true;
}

function validateCardNumber() {
    const value = cardNumberInput.value.replace(/\s/g, '');
    if (!value) {
        showError(cardNumberInput, cardError, "Can't be blank");
        return false;
    }
    if (!/^\d+$/.test(value)) {
        showError(cardNumberInput, cardError, 'Wrong format, numbers only');
        return false;
    }
    if (value.length !== 16) {
        showError(cardNumberInput, cardError, 'Card number must be 16 digits');
        return false;
    }
    clearError(cardNumberInput, cardError);
    return true;
}

function validateExpDate() {
    const month = expMonthInput.value.trim();
    const year = expYearInput.value.trim();
    let isValid = true;

    // Clear previous errors
    expMonthInput.classList.remove('error');
    expYearInput.classList.remove('error');
    dateError.classList.remove('show');

    if (!month || !year) {
        if (!month) expMonthInput.classList.add('error');
        if (!year) expYearInput.classList.add('error');
        showError(expMonthInput, dateError, "Can't be blank");
        return false;
    }

    if (!/^\d+$/.test(month) || !/^\d+$/.test(year)) {
        expMonthInput.classList.add('error');
        expYearInput.classList.add('error');
        showError(expMonthInput, dateError, 'Wrong format, numbers only');
        return false;
    }

    const monthNum = parseInt(month, 10);
    if (monthNum < 1 || monthNum > 12) {
        expMonthInput.classList.add('error');
        showError(expMonthInput, dateError, 'Must be a valid month');
        return false;
    }

    clearError(expMonthInput, dateError);
    expYearInput.classList.remove('error');
    return true;
}

function validateCVC() {
    const value = cvcInput.value.trim();
    if (!value) {
        showError(cvcInput, cvcError, "Can't be blank");
        return false;
    }
    if (!/^\d+$/.test(value)) {
        showError(cvcInput, cvcError, 'Wrong format, numbers only');
        return false;
    }
    if (value.length !== 3) {
        showError(cvcInput, cvcError, 'CVC must be 3 digits');
        return false;
    }
    clearError(cvcInput, cvcError);
    return true;
}

// Form submission
confirmBtn.addEventListener('click', () => {
    const isNameValid = validateName();
    const isCardValid = validateCardNumber();
    const isDateValid = validateExpDate();
    const isCVCValid = validateCVC();

    if (isNameValid && isCardValid && isDateValid && isCVCValid) {
        // All validations passed - you can add completion state here
        cardForm.style.display = 'none';
        successForm.style.display = 'flex';
        console.log('Form submitted successfully!');
    }
});

continueBtn.addEventListener('click', () => {
    // Reset form and go back to card form
    cardForm.style.display = 'flex';
    successForm.style.display = 'none';

    // Clear all inputs and displays
    cardholderNameInput.value = '';
    cardNumberInput.value = '';
    expMonthInput.value = '';
    expYearInput.value = '';
    cvcInput.value = '';

    cardholderNameDisplay.textContent = 'Jane Appleseed';
    cardNumberDisplay.textContent = '0000 0000 0000 0000';
    expDateDisplay.textContent = '00/00';
    cvcDisplay.textContent = '000';
});
