// Fawaterk API Configuration
const FAWATERK_API_KEY = '06f17d620cab63288f181440a40472c717b117ac55226864c5';
const FAWATERK_BASE_URL = 'https://staging.fawaterk.com/api/v2';

// Plan Selection and Price Update
const planOptions = document.querySelectorAll('.plan-option');
const summaryPlan = document.getElementById('summaryPlan');
const summarySubtotal = document.getElementById('summarySubtotal');
const summaryTotal = document.getElementById('summaryTotal');
const summaryFeatures = document.getElementById('summaryFeatures');
const modalAmount = document.getElementById('modalAmount');
const modalAmountWallet = document.getElementById('modalAmountWallet');

const planData = {
    regular: {
        name: 'Regular',
        price: 600,
        features: [
            '✓ Customized diet plan',
            '✓ Training program',
            '✓ Weekly follow-up',
            '✓ 48-hour delivery'
        ]
    },
    advanced: {
        name: 'Advanced',
        price: 1000,
        features: [
            '✓ Customized diet plan',
            '✓ Training program',
            '✓ Daily follow-up',
            '✓ 48-hour delivery',
            '✓ Priority response',
            '✓ Weekly video call'
        ]
    },
    vip: {
        name: 'VIP',
        price: 1500,
        features: [
            '✓ All Advanced features',
            '✓ 24-hour delivery',
            '✓ Premium support',
            '✓ Exclusive content'
        ]
    }
};

// Update summary when plan changes
planOptions.forEach(option => {
    const radio = option.querySelector('input[type="radio"]');
    radio.addEventListener('change', function() {
        const planType = this.value;
        const plan = planData[planType];
        
        // Update summary
        summaryPlan.textContent = plan.name;
        summarySubtotal.textContent = `${plan.price} EGP`;
        summaryTotal.textContent = `${plan.price} EGP`;
        modalAmount.textContent = `${plan.price} EGP`;
        modalAmountWallet.textContent = `${plan.price} EGP`;
        
        // Update features list
        summaryFeatures.innerHTML = plan.features.map(feature => 
            `<li>${feature}</li>`
        ).join('');
    });
});

// Phone Number Validation
const phoneInput = document.getElementById('phone');
const phoneGroup = phoneInput.closest('.form-group');
const phoneError = document.getElementById('phoneError');

phoneInput.addEventListener('input', function(e) {
    // Remove any non-digit characters
    let value = e.target.value.replace(/\D/g, '');
    
    // Limit to 11 digits
    if (value.length > 11) {
        value = value.slice(0, 11);
    }
    
    e.target.value = value;
    
    // Validate
    validatePhone();
});

phoneInput.addEventListener('blur', validatePhone);

function validatePhone() {
    const value = phoneInput.value;
    const pattern = /^01[0-9]{9}$/;
    
    phoneGroup.classList.remove('error', 'success');
    
    if (value === '') {
        return true;
    }
    
    if (!pattern.test(value)) {
        phoneGroup.classList.add('error');
        return false;
    } else {
        phoneGroup.classList.add('success');
        return true;
    }
}

// Payment Method Selection
const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
const qrModal = document.getElementById('qrModal');
const modalClose = document.querySelector('.modal-close');
const completeCheckoutBtn = document.getElementById('completeCheckout');
const confirmPaymentBtn = document.getElementById('confirmPayment');

// Payment Tabs Functionality
const paymentTabs = document.querySelectorAll('.payment-tab');
const tabContents = document.querySelectorAll('.payment-tab-content');

paymentTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        const method = this.getAttribute('data-method');
        
        // Update active tab
        paymentTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Update active content
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${method}-content`) {
                content.classList.add('active');
            }
        });
    });
});

// Copy Wallet Number
const copyWalletBtn = document.getElementById('copyWalletBtn');
const walletNumber = document.querySelector('.wallet-number').textContent;

copyWalletBtn.addEventListener('click', async function() {
    try {
        await navigator.clipboard.writeText(walletNumber);
        
        // Visual feedback
        this.classList.add('copied');
        const originalText = this.querySelector('.copy-text').textContent;
        this.querySelector('.copy-text').textContent = 'Copied';
        
        setTimeout(() => {
            this.classList.remove('copied');
            this.querySelector('.copy-text').textContent = originalText;
        }, 2000);
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = walletNumber;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            this.querySelector('.copy-text').textContent = 'Copied!';
            setTimeout(() => {
                this.querySelector('.copy-text').textContent = 'Copy';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
        document.body.removeChild(textArea);
    }
});

// Complete Checkout Button
completeCheckoutBtn.addEventListener('click', function() {
    // Validate form
    const shippingForm = document.getElementById('shippingForm');
    
    // Check phone validation first
    if (!validatePhone()) {
        phoneInput.focus();
        return;
    }
    
    if (!shippingForm.checkValidity()) {
        shippingForm.reportValidity();
        return;
    }
    
    // Disable button and show loading
    completeCheckoutBtn.disabled = true;
    completeCheckoutBtn.textContent = 'Processing...';
    
    // Check selected payment method
    const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    if (selectedPayment === 'fawry') {
        // Process with Fawaterk
        processFawaterkPayment();
    } else if (selectedPayment === 'instapay') {
        // Show QR modal for Instapay/Wallet
        completeCheckoutBtn.disabled = false;
        completeCheckoutBtn.textContent = 'Complete Purchase';
        qrModal.classList.add('show');
        
        // Make sure InstaPay tab is active by default
        paymentTabs[0].click();
    }
});

// Close modal
modalClose.addEventListener('click', function() {
    qrModal.classList.remove('show');
});

// Close modal when clicking outside
qrModal.addEventListener('click', function(e) {
    if (e.target === qrModal) {
        qrModal.classList.remove('show');
    }
});

// ESC key to close modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && qrModal.classList.contains('show')) {
        qrModal.classList.remove('show');
    }
});

// Confirm Payment Button
confirmPaymentBtn.addEventListener('click', function() {
    // Process instapay/wallet payment
    processInstaPayment();
});

// Process Fawaterk Payment
async function processFawaterkPayment() {
    try {
        // Get form data
        const selectedPlan = document.querySelector('input[name="plan"]:checked').value;
        const plan = planData[selectedPlan];
        
        const paymentData = {
            payment_method_id: 1, // 1 for Credit Card
            cartTotal: plan.price,
            currency: "EGP",
            customer: {
                first_name: document.getElementById('fullName').value.split(' ')[0] || 'Customer',
                last_name: document.getElementById('fullName').value.split(' ').slice(1).join(' ') || 'Name',
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                country: document.getElementById('country').value
            },
            cartItems: [
                {
                    name: `Hamzauy Coaching - ${plan.name} Plan`,
                    price: plan.price,
                    quantity: 1
                }
            ],
            redirectionUrls: {
                successUrl: window.location.origin + '/payment-success.html',
                failUrl: window.location.origin + '/payment-failed.html',
                pendingUrl: window.location.origin + '/payment-pending.html'
            }
        };

        // Make API request to Fawaterk
        const response = await fetch(`${FAWATERK_BASE_URL}/invoiceInitPay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${FAWATERK_API_KEY}`
            },
            body: JSON.stringify(paymentData)
        });

        const result = await response.json();

        if (result.status === 'success' && result.data && result.data.payment_url) {
            // Redirect to Fawaterk payment page
            window.location.href = result.data.payment_url;
        } else {
            throw new Error(result.message || 'Payment initialization failed');
        }
        
    } catch (error) {
        console.error('Fawaterk Payment Error:', error);
        alert('Payment processing failed. Please try again or contact support.\n\nError: ' + error.message);
        
        // Re-enable button
        completeCheckoutBtn.disabled = false;
        completeCheckoutBtn.textContent = 'Complete Purchase';
    }
}

// Process Instapay/Wallet Payment
async function processInstaPayment() {
    try {
        // Get form data
        const selectedPlan = document.querySelector('input[name="plan"]:checked').value;
        const plan = planData[selectedPlan];
        
        const paymentData = {
            payment_method_id: 6, // Instapay method ID
            cartTotal: plan.price,
            currency: "EGP",
            customer: {
                first_name: document.getElementById('fullName').value.split(' ')[0] || 'Customer',
                last_name: document.getElementById('fullName').value.split(' ').slice(1).join(' ') || 'Name',
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                country: document.getElementById('country').value
            },
            cartItems: [
                {
                    name: `Hamzauy Coaching - ${plan.name} Plan`,
                    price: plan.price,
                    quantity: 1
                }
            ],
            redirectionUrls: {
                successUrl: window.location.origin + '/payment-success.html',
                failUrl: window.location.origin + '/payment-failed.html',
                pendingUrl: window.location.origin + '/payment-pending.html'
            }
        };

        // Make API request to Fawaterk
        const response = await fetch(`${FAWATERK_BASE_URL}/invoiceInitPay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${FAWATERK_API_KEY}`
            },
            body: JSON.stringify(paymentData)
        });

        const result = await response.json();

        if (result.status === 'success') {
            // Close modal
            qrModal.classList.remove('show');
            
            // Show success message
            alert('Payment request submitted successfully!\n\nYou will receive a confirmation email shortly.');
            
            // Optionally redirect to success page
            setTimeout(() => {
                window.location.href = 'payment-success.html';
            }, 2000);
        } else {
            throw new Error(result.message || 'Payment failed');
        }
        
    } catch (error) {
        console.error('Instapay Payment Error:', error);
        alert('Payment processing failed. Please try again or contact support.\n\nError: ' + error.message);
    }
}

// Dark Mode Support
// Check if dark mode is enabled from main site
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
}

// Initialize with default selected plan
window.addEventListener('load', function() {
    const defaultPlan = document.querySelector('input[name="plan"]:checked');
    if (defaultPlan) {
        defaultPlan.dispatchEvent(new Event('change'));
    }
});