// Countdown Timer
function startCountdown() {
    let timeLeft = 10 * 60; // 10 minutes in seconds
    const countdownElement = document.getElementById('countdown');
    
    const timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        countdownElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        timeLeft--;
        
        if (timeLeft < 0) {
            clearInterval(timer);
            countdownElement.textContent = '0:00';
        }
    }, 1000);
}

// Quantity Controls
function initQuantityControls() {
    const plusButtons = document.querySelectorAll('.qty-btn.plus');
    const minusButtons = document.querySelectorAll('.qty-btn.minus');
    
    plusButtons.forEach(button => {
        button.addEventListener('click', () => {
            const quantitySpan = button.parentElement.querySelector('.quantity');
            let quantity = parseInt(quantitySpan.textContent);
            quantitySpan.textContent = quantity + 1;
            updateTotals();
        });
    });
    
    minusButtons.forEach(button => {
        button.addEventListener('click', () => {
            const quantitySpan = button.parentElement.querySelector('.quantity');
            let quantity = parseInt(quantitySpan.textContent);
            if (quantity > 1) {
                quantitySpan.textContent = quantity - 1;
                updateTotals();
            }
        });
    });
}

// Update Order Totals
function updateTotals() {
    const quantity = parseInt(document.querySelector('.quantity').textContent);
    const pricePerItem = 39.00;
    const subtotal = quantity * pricePerItem;
    
    // Update subtotal
    const subtotalElement = document.querySelector('.total-row:not(.compare):not(.final-total) span:last-child');
    if (subtotalElement) {
        subtotalElement.textContent = `${subtotal.toFixed(2)}€`;
    }
    
    // Update final total
    const finalTotalElement = document.querySelector('.final-total span:last-child');
    if (finalTotalElement) {
        finalTotalElement.textContent = `${subtotal.toFixed(2)}€`;
    }
    
    // Update recurring total
    const recurringTotalElement = document.querySelector('.recurring-total strong');
    if (recurringTotalElement) {
        recurringTotalElement.textContent = `${subtotal.toFixed(2)}€ ogni mese`;
    }
    
    // Update order summary section
    updateOrderSummary();
}

// Update Order Summary Section
function updateOrderSummary() {
    const quantity = parseInt(document.querySelector('.quantity').textContent);
    const pricePerItem = 39.00;
    const subtotal = quantity * pricePerItem;
    
    // Update the main product quantity display
    const mainProductQuantity = document.querySelector('.cart-item:not(.gift) .quantity');
    if (mainProductQuantity) {
        mainProductQuantity.textContent = quantity;
    }
    
    // Update the main product price
    const mainProductPrice = document.querySelector('.cart-item:not(.gift) .current-price');
    if (mainProductPrice) {
        mainProductPrice.textContent = `${subtotal.toFixed(2)}€ al mese`;
    }
    
    // Add visual feedback for quantity change
    const cartItem = document.querySelector('.cart-item:not(.gift)');
    if (cartItem) {
        cartItem.style.transform = 'scale(1.02)';
        cartItem.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            cartItem.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Update any upsell totals if they exist
    updateUpsellTotals();
}

// Update Upsell Totals
function updateUpsellTotals() {
    const orderProtection = document.getElementById('orderProtection');
    const surpriseGift = document.getElementById('surpriseGift');
    
    let upsellTotal = 0;
    if (orderProtection && orderProtection.checked) {
        upsellTotal += 3.99;
    }
    if (surpriseGift && surpriseGift.checked) {
        upsellTotal += 9.99;
    }
    
    // Update final total with upsells
    const quantity = parseInt(document.querySelector('.quantity').textContent);
    const pricePerItem = 39.00;
    const subtotal = quantity * pricePerItem;
    const finalTotal = subtotal + upsellTotal;
    
    const finalTotalElement = document.querySelector('.final-total span:last-child');
    if (finalTotalElement) {
        finalTotalElement.textContent = `${finalTotal.toFixed(2)}€`;
    }
    
    const recurringTotalElement = document.querySelector('.recurring-total strong');
    if (recurringTotalElement) {
        recurringTotalElement.textContent = `${finalTotal.toFixed(2)}€ ogni mese`;
    }
}

// Discount Code Application
function initDiscountCode() {
    const applyButton = document.querySelector('.apply-btn');
    const discountInput = document.getElementById('discountCode');
    
    applyButton.addEventListener('click', () => {
        const discountCode = discountInput.value.trim().toUpperCase();
        
        if (discountCode === 'WELCOME10') {
            // Apply 10% discount
            const subtotalElement = document.querySelector('.total-row:not(.compare):not(.final-total) span:last-child');
            const finalTotalElement = document.querySelector('.final-total span:last-child');
            const recurringTotalElement = document.querySelector('.recurring-total strong');
            
            if (subtotalElement && finalTotalElement && recurringTotalElement) {
                const currentSubtotal = parseFloat(subtotalElement.textContent.replace('€', ''));
                const discount = currentSubtotal * 0.1;
                const newTotal = currentSubtotal - discount;
                
                subtotalElement.textContent = `${newTotal.toFixed(2)}€`;
                finalTotalElement.textContent = `${newTotal.toFixed(2)}€`;
                recurringTotalElement.textContent = `${newTotal.toFixed(2)}€ ogni mese`;
                
                // Add discount row
                addDiscountRow(discount);
                
                applyButton.textContent = 'Applicato!';
                applyButton.style.background = '#28a745';
                discountInput.disabled = true;
            }
        } else if (discountCode) {
            alert('Codice sconto non valido');
        }
    });
}

// Add Discount Row to Totals
function addDiscountRow(discountAmount) {
    const orderTotals = document.querySelector('.order-totals');
    const finalTotalRow = document.querySelector('.final-total');
    
    const discountRow = document.createElement('div');
    discountRow.className = 'total-row';
    discountRow.innerHTML = `
        <span>Sconto</span>
        <span style="color: #28a745;">-${discountAmount.toFixed(2)}€</span>
    `;
    
    orderTotals.insertBefore(discountRow, finalTotalRow);
}

// Form Validation
function initFormValidation() {
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const addressInput = document.getElementById('address');
    const countrySelect = document.getElementById('country');
    const stateInput = document.getElementById('state');
    const cityInput = document.getElementById('city');
    const postalCodeInput = document.getElementById('postalCode');
    
    // Email validation
    emailInput.addEventListener('blur', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const formGroup = emailInput.parentElement;
        
        if (!emailRegex.test(emailInput.value)) {
            formGroup.classList.add('error');
        } else {
            formGroup.classList.remove('error');
        }
    });
    
    // Phone validation
    phoneInput.addEventListener('blur', () => {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(phoneInput.value)) {
            phoneInput.style.borderColor = '#f44336';
        } else {
            phoneInput.style.borderColor = '#e0e0e0';
        }
    });
    
    // Required field validation for all shipping fields
    [firstNameInput, lastNameInput, addressInput, stateInput, cityInput, postalCodeInput].forEach(input => {
        input.addEventListener('blur', () => {
            if (!input.value.trim()) {
                input.style.borderColor = '#f44336';
            } else {
                input.style.borderColor = '#e0e0e0';
            }
        });
    });
    
    // Country select validation
    countrySelect.addEventListener('change', () => {
        if (!countrySelect.value) {
            countrySelect.style.borderColor = '#f44336';
        } else {
            countrySelect.style.borderColor = '#e0e0e0';
        }
    });
    
    // Postal code validation based on country
    postalCodeInput.addEventListener('blur', () => {
        const country = countrySelect.value;
        const postalCode = postalCodeInput.value.trim();
        
        if (!postalCode) {
            postalCodeInput.style.borderColor = '#f44336';
            return;
        }
        
        let isValid = true;
        switch(country) {
            case 'CA':
                // Canadian postal code format: A1A 1A1
                isValid = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(postalCode);
                break;
            case 'US':
                // US ZIP code format: 12345 or 12345-6789
                isValid = /^\d{5}(-\d{4})?$/.test(postalCode);
                break;
            case 'IT':
                // Italian postal code format: 12345
                isValid = /^\d{5}$/.test(postalCode);
                break;
            default:
                isValid = postalCode.length >= 3;
        }
        
        postalCodeInput.style.borderColor = isValid ? '#e0e0e0' : '#f44336';
    });
}

// Payment Button Interactions
function initPaymentButtons() {
    const paymentButtons = document.querySelectorAll('.payment-btn');
    
    paymentButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            paymentButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            // Simulate payment processing
            setTimeout(() => {
                alert('Reindirizzamento al sistema di pagamento...');
            }, 500);
        });
    });
}

// Payment Method Selection
function initPaymentMethodSelection() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const cardDetails = document.querySelector('.card-details');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', () => {
            if (method.value === 'card') {
                cardDetails.style.display = 'block';
            } else {
                cardDetails.style.display = 'none';
            }
        });
    });
    
    // Initially show card details since card is selected by default
    cardDetails.style.display = 'block';
}

// Card Number Formatting
function initCardNumberFormatting() {
    const cardNumberInput = document.getElementById('cardNumber');
    
    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        
        if (formattedValue.length > 19) {
            formattedValue = formattedValue.substring(0, 19);
        }
        
        e.target.value = formattedValue;
    });
}

// Expiry Date Formatting
function initExpiryDateFormatting() {
    const expiryDateInput = document.getElementById('expiryDate');
    
    expiryDateInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        
        e.target.value = value;
    });
}

// Security Code Validation
function initSecurityCodeValidation() {
    const securityCodeInput = document.getElementById('securityCode');
    
    securityCodeInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 4) {
            value = value.substring(0, 4);
        }
        
        e.target.value = value;
    });
}

// Upsell Functionality
function initUpsellFunctionality() {
    const orderProtectionCheckbox = document.getElementById('orderProtection');
    const surpriseGiftCheckbox = document.getElementById('surpriseGift');
    
    orderProtectionCheckbox.addEventListener('change', () => {
        if (orderProtectionCheckbox.checked) {
            addUpsellToOrder('Protezione ordine', 3.99);
        } else {
            removeUpsellFromOrder('Protezione ordine');
        }
    });
    
    surpriseGiftCheckbox.addEventListener('change', () => {
        if (surpriseGiftCheckbox.checked) {
            addUpsellToOrder('Regalo a sorpresa', 9.99);
        } else {
            removeUpsellFromOrder('Regalo a sorpresa');
        }
    });
}

// Add Upsell to Order
function addUpsellToOrder(name, price) {
    const orderTotals = document.querySelector('.order-totals');
    const finalTotalRow = document.querySelector('.final-total');
    
    // Check if upsell already exists
    const existingUpsell = document.querySelector(`[data-upsell="${name}"]`);
    if (existingUpsell) return;
    
    const upsellRow = document.createElement('div');
    upsellRow.className = 'total-row';
    upsellRow.setAttribute('data-upsell', name);
    upsellRow.innerHTML = `
        <span>${name}</span>
        <span>${price.toFixed(2)}€</span>
    `;
    
    orderTotals.insertBefore(upsellRow, finalTotalRow);
    updateFinalTotal();
}

// Remove Upsell from Order
function removeUpsellFromOrder(name) {
    const upsellRow = document.querySelector(`[data-upsell="${name}"]`);
    if (upsellRow) {
        upsellRow.remove();
        updateFinalTotal();
    }
}

// Update Final Total
function updateFinalTotal() {
    const subtotalElement = document.querySelector('.total-row:not(.compare):not(.final-total) span:last-child');
    const finalTotalElement = document.querySelector('.final-total span:last-child');
    const recurringTotalElement = document.querySelector('.recurring-total strong');
    
    if (subtotalElement && finalTotalElement && recurringTotalElement) {
        const subtotal = parseFloat(subtotalElement.textContent.replace('€', ''));
        const upsells = document.querySelectorAll('[data-upsell]');
        
        let upsellTotal = 0;
        upsells.forEach(upsell => {
            const price = parseFloat(upsell.querySelector('span:last-child').textContent.replace('€', ''));
            upsellTotal += price;
        });
        
        const finalTotal = subtotal + upsellTotal;
        
        finalTotalElement.textContent = `${finalTotal.toFixed(2)}€`;
        recurringTotalElement.textContent = `${finalTotal.toFixed(2)}€ ogni mese`;
        
        // Also update order summary section
        updateOrderSummary();
    }
}

// Complete Purchase Button
function initCompletePurchaseButton() {
    const completePurchaseBtn = document.querySelector('.complete-purchase-btn');
    
    completePurchaseBtn.addEventListener('click', () => {
        // Validate required fields
        const requiredFields = [
            'phone', 'email', 'firstName', 'lastName', 'address', 
            'country', 'state', 'city', 'postalCode'
        ];
        
        let isValid = true;
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                field.style.borderColor = '#f44336';
                isValid = false;
            }
        });
        
        // Validate card details if card payment is selected
        const cardPayment = document.querySelector('input[name="paymentMethod"]:checked');
        if (cardPayment && cardPayment.value === 'card') {
            const cardNumber = document.getElementById('cardNumber').value;
            const expiryDate = document.getElementById('expiryDate').value;
            const securityCode = document.getElementById('securityCode').value;
            
            if (!cardNumber || !expiryDate || !securityCode) {
                alert('Si prega di compilare tutti i dettagli della carta');
                isValid = false;
            }
        }
        
        if (isValid) {
            // Simulate order processing
            completePurchaseBtn.textContent = 'ELABORAZIONE...';
            completePurchaseBtn.disabled = true;
            
            setTimeout(() => {
                alert('Ordine completato con successo! Grazie per il tuo acquisto.');
                completePurchaseBtn.textContent = 'COMPLETA L\'ACQUISTO';
                completePurchaseBtn.disabled = false;
            }, 2000);
        } else {
            alert('Si prega di compilare tutti i campi obbligatori');
        }
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    startCountdown();
    initQuantityControls();
    initDiscountCode();
    initFormValidation();
    initPaymentButtons();
    initPaymentMethodSelection();
    initCardNumberFormatting();
    initExpiryDateFormatting();
    initSecurityCodeValidation();
    initUpsellFunctionality();
    initCompletePurchaseButton();
    
    // Add some visual feedback for form interactions
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.borderColor = '#007bff';
        });
        
        input.addEventListener('blur', () => {
            if (!input.value && input.type !== 'checkbox') {
                input.style.borderColor = '#e0e0e0';
            }
        });
    });
});

// CSS for active payment button state is now handled in styles.css
