// Fawaterk API Configuration
const FAWATERK_API_KEY = '06f17d620cab63288f181440a40472c717b117ac55226864c5';
const FAWATERK_BASE_URL = 'https://staging.fawaterk.com/api/v2';
const WHATSAPP_NUMBER = '201557403075'; // Without + sign

// Language System
const html = document.documentElement;
let currentLang = 'ar'; // Default to Arabic

function switchLanguage(lang) {
    currentLang = lang;
    
    // Update HTML attributes
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    // Update all elements with data-en and data-ar attributes
    document.querySelectorAll('[data-en][data-ar]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            // Handle different element types
            if (element.tagName === 'OPTION') {
                element.textContent = text;
            } else if (element.hasAttribute('placeholder')) {
                element.setAttribute('placeholder', text);
            } else if (element.tagName === 'INPUT' || element.tagName === 'BUTTON') {
                if (element.hasAttribute('value')) {
                    element.value = text;
                } else {
                    element.textContent = text;
                }
            } else {
                element.textContent = text;
            }
        }
    });
    
    // Save preference
    localStorage.setItem('language', lang);
}

// Initialize language on load
window.addEventListener('load', function() {
    const savedLang = localStorage.getItem('language') || 'ar';
    switchLanguage(savedLang);
});

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
        name: {en: 'Regular', ar: 'عادي'},
        price: 600,
        features: [
            {en: '✓ Customized diet plan', ar: '✓ نظام غذائي مخصص'},
            {en: '✓ Training program', ar: '✓ برنامج تدريبي'},
            {en: '✓ Weekly follow-up', ar: '✓ متابعة أسبوعية'},
            {en: '✓ 48-hour delivery', ar: '✓ تسليم خلال 48 ساعة'}
        ]
    },
    advanced: {
        name: {en: 'Advanced', ar: 'متقدم'},
        price: 1000,
        features: [
            {en: '✓ Customized diet plan', ar: '✓ نظام غذائي مخصص'},
            {en: '✓ Training program', ar: '✓ برنامج تدريبي'},
            {en: '✓ Daily follow-up', ar: '✓ متابعة يومية'},
            {en: '✓ 48-hour delivery', ar: '✓ تسليم خلال 48 ساعة'},
            {en: '✓ Priority response', ar: '✓ أولوية في الرد'},
            {en: '✓ Weekly video call', ar: '✓ مكالمة فيديو أسبوعية'}
        ]
    },
    vip: {
        name: {en: 'VIP', ar: 'VIP'},
        price: 1500,
        features: [
            {en: '✓ All Advanced features', ar: '✓ جميع مميزات المتقدم'},
            {en: '✓ 24-hour delivery', ar: '✓ تسليم خلال 24 ساعة'},
            {en: '✓ Premium support', ar: '✓ دعم مميز'},
            {en: '✓ Exclusive content', ar: '✓ محتوى حصري'}
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
        summaryPlan.textContent = plan.name[currentLang];
        const currency = currentLang === 'ar' ? 'جنيه' : 'EGP';
        summarySubtotal.innerHTML = `${plan.price} <span data-en="EGP" data-ar="جنيه">${currency}</span>`;
        summaryTotal.innerHTML = `${plan.price} <span data-en="EGP" data-ar="جنيه">${currency}</span>`;
        modalAmount.innerHTML = `${plan.price} <span data-en="EGP" data-ar="جنيه">${currency}</span>`;
        modalAmountWallet.innerHTML = `${plan.price} <span data-en="EGP" data-ar="جنيه">${currency}</span>`;
        
        // Update features list
        summaryFeatures.innerHTML = plan.features.map(feature => 
            `<li data-en="${feature.en}" data-ar="${feature.ar}">${feature[currentLang]}</li>`
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
        const copyText = this.querySelector('.copy-text');
        const originalText = copyText.textContent;
        copyText.textContent = currentLang === 'ar' ? 'تم النسخ' : 'Copied';
        
        setTimeout(() => {
            this.classList.remove('copied');
            copyText.textContent = originalText;
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
            const copyText = this.querySelector('.copy-text');
            copyText.textContent = currentLang === 'ar' ? 'تم النسخ!' : 'Copied!';
            setTimeout(() => {
                copyText.textContent = currentLang === 'ar' ? 'نسخ' : 'Copy';
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
    completeCheckoutBtn.textContent = currentLang === 'ar' ? 'جاري المعالجة...' : 'Processing...';
    
    // Check selected payment method
    const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    if (selectedPayment === 'fawry') {
        // Process with Fawaterk
        processFawaterkPayment();
    } else if (selectedPayment === 'instapay') {
        // Show QR modal for Instapay/Wallet
        completeCheckoutBtn.disabled = false;
        completeCheckoutBtn.textContent = currentLang === 'ar' ? 'إتمام الشراء' : 'Complete Purchase';
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

// Confirm Payment Button - WhatsApp Integration
confirmPaymentBtn.addEventListener('click', function() {
    // Get selected plan info
    const selectedPlan = document.querySelector('input[name="plan"]:checked').value;
    const plan = planData[selectedPlan];
    const customerName = document.getElementById('fullName').value;
    const customerPhone = document.getElementById('phone').value;
    
    // Create WhatsApp message
    const message = currentLang === 'ar' 
        ? `مرحباً، أنا ${customerName}%0A%0Aقمت بالدفع للخطة: ${plan.name.ar}%0Aالمبلغ: ${plan.price} جنيه%0Aرقم الهاتف: ${customerPhone}%0A%0Aسأقوم بإرسال لقطة شاشة تأكيد الدفع.`
        : `Hello, I'm ${customerName}%0A%0AI have completed payment for: ${plan.name.en} Plan%0AAmount: ${plan.price} EGP%0APhone: ${customerPhone}%0A%0AI will send the payment confirmation screenshot.`;
    
    // Open WhatsApp
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappURL, '_blank');
    
    // Close modal after a short delay
    setTimeout(() => {
        qrModal.classList.remove('show');
    }, 500);
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
                    name: `Hamzauy Coaching - ${plan.name.en} Plan`,
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
        const errorMsg = currentLang === 'ar'
            ? `فشلت معالجة الدفع. يرجى المحاولة مرة أخرى أو الاتصال بالدعم.\n\nالخطأ: ${error.message}`
            : `Payment processing failed. Please try again or contact support.\n\nError: ${error.message}`;
        alert(errorMsg);
        
        // Re-enable button
        completeCheckoutBtn.disabled = false;
        completeCheckoutBtn.textContent = currentLang === 'ar' ? 'إتمام الشراء' : 'Complete Purchase';
    }
}

// Dark Mode Support - Default is light mode
// Only enable if explicitly set in localStorage
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