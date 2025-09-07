// Calculator variables
let display = document.getElementById('display');
let currentInput = '0';
let shouldResetDisplay = false;

// Update display function
function updateDisplay() {
    display.textContent = currentInput;
    display.classList.add('active');
    setTimeout(() => display.classList.remove('active'), 100);
}

// Clear display function
function clearDisplay() {
    currentInput = '0';
    shouldResetDisplay = false;
    updateDisplay();
}

// Delete last character
function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// Check if character is an operator
function isOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
}

// Append to display
function appendToDisplay(value) {
    // If we should reset (after calculation), start fresh
    if (shouldResetDisplay && !isOperator(value)) {
        currentInput = '0';
        shouldResetDisplay = false;
    }

    // Handle starting with 0
    if (currentInput === '0' && value !== '.') {
        if (isOperator(value)) {
            currentInput += value;
        } else {
            currentInput = value;
        }
    } 
    // Prevent multiple decimal points in same number
    else if (value === '.') {
        let parts = currentInput.split(/[\+\-\*\/]/);
        let lastPart = parts[parts.length - 1];
        if (!lastPart.includes('.')) {
            currentInput += value;
        }
    }
    // Prevent consecutive operators
    else if (isOperator(value) && isOperator(currentInput[currentInput.length - 1])) {
        currentInput = currentInput.slice(0, -1) + value;
    }
    // Normal append
    else {
        currentInput += value;
    }

    shouldResetDisplay = false;
    updateDisplay();
}

// Calculate result
function calculate() {
    try {
        // Remove trailing operator if exists
        if (isOperator(currentInput[currentInput.length - 1])) {
            currentInput = currentInput.slice(0, -1);
        }
        
        // Evaluate the expression
        let result = eval(currentInput);
        
        // Handle division by zero
        if (!isFinite(result)) {
            currentInput = 'Error';
        } else {
            // Round to avoid floating point issues
            result = Math.round(result * 100000000) / 100000000;
            currentInput = result.toString();
        }
        
        shouldResetDisplay = true;
        updateDisplay();
    } catch (error) {
        currentInput = 'Error';
        shouldResetDisplay = true;
        updateDisplay();
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    if (event.key >= '0' && event.key <= '9') {
        appendToDisplay(event.key);
    } else if (event.key === '.') {
        appendToDisplay('.');
    } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        appendToDisplay(event.key);
    } else if (event.key === 'Enter' || event.key === '=') {
        calculate();
    } else if (event.key === 'Escape' || event.key === 'c' || event.key === 'C') {
        clearDisplay();
    } else if (event.key === 'Backspace') {
        deleteLast();
    }
});