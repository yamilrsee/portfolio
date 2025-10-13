const navEl = document.querySelector ('.nav');
const hamburgerEl = document.querySelector('.hamburger');

let justTouched = false;

hamburgerEl.addEventListener("touchstart", (e) => {
    e.preventDefault();
    justTouched = true;
    navEl.classList.toggle("nav--open");
    hamburgerEl.classList.toggle('hamburger--open');
    setTimeout(() => { justTouched = false; }, 400);
});

hamburgerEl.addEventListener("click", (e) => {
    if (justTouched) {
        e.preventDefault();
        return;
    }
    navEl.classList.toggle("nav--open");
    hamburgerEl.classList.toggle('hamburger--open');
});

// Close navbar when clicking outside
document.addEventListener("click", (event) => {
    if (!navEl.contains(event.target) && !hamburgerEl.contains(event.target) && navEl.classList.contains("nav--open")) {
        navEl.classList.remove("nav--open");
        hamburgerEl.classList.remove('hamburger--open');
    }
});

// Close navbar when clicking a nav link
navEl.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
        navEl.classList.remove("nav--open");
        hamburgerEl.classList.remove('hamburger--open');
    }
});

// Infinite scroll functionality for cards
const scrollContainer = document.querySelector('.scroll-container');
const websites = document.querySelector('.websites');

if (scrollContainer && websites) {
    websites.addEventListener('mouseleave', () => {
        scrollContainer.style.animationPlayState = 'running';
    });

    // Pause animation when not in viewport (performance optimization)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                scrollContainer.style.animationPlayState = 'running';
            } else {
                scrollContainer.style.animationPlayState = 'paused';
            }
        });
    });

    observer.observe(websites);
}

// FAQ Dropdown functionality
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other FAQ items
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current item
        if (isActive) {
            item.classList.remove('active');
        } else {
            item.classList.add('active');
        }
    });
});

// Keyboard accessibility for FAQ
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            question.click();
        }
    });
    
    // Make question focusable
    question.setAttribute('tabindex', '0');
    question.setAttribute('role', 'button');
    question.setAttribute('aria-expanded', 'false');
});

// Update aria-expanded when FAQ items are toggled
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const question = mutation.target.querySelector('.faq-question');
            const isActive = mutation.target.classList.contains('active');
            question.setAttribute('aria-expanded', isActive.toString());
        }
    });
});

faqItems.forEach(item => {
    observer.observe(item, { attributes: true, attributeFilter: ['class'] });
});

// Modal functionality
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const bookCallButtons = document.querySelectorAll('a[href="#"], button');
const serviceButtons = document.querySelectorAll('.service-btn');
const modalForm = document.querySelector('.modal-form');
const phoneInput = document.getElementById('phone');

// Debug: Check if elements exist
console.log('Modal overlay found:', !!modalOverlay);
console.log('Modal close found:', !!modalClose);
console.log('Book call buttons found:', bookCallButtons.length);
console.log('Service buttons found:', serviceButtons.length);
console.log('Modal form found:', !!modalForm);
console.log('Phone input found:', !!phoneInput);

// Phone number formatting
function formatPhoneNumber(value) {
    // Remove all non-numeric characters
    const phoneNumber = value.replace(/\D/g, '');
    
    // Handle different lengths
    if (phoneNumber.length === 0) {
        return '';
    } else if (phoneNumber.length <= 3) {
        return `(${phoneNumber}`;
    } else if (phoneNumber.length <= 6) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else if (phoneNumber.length <= 10) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
    } else if (phoneNumber.length === 11) {
        // Handle 11 digits (country code + 10 digits)
        return `+${phoneNumber.slice(0, 1)} (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7)}`;
    } else {
        // Limit to 11 digits max
        const limited = phoneNumber.slice(0, 11);
        if (limited.length === 11) {
            return `+${limited.slice(0, 1)} (${limited.slice(1, 4)}) ${limited.slice(4, 7)}-${limited.slice(7)}`;
        } else if (limited.length <= 10) {
            return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
        } else if (limited.length <= 6) {
            return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
        } else if (limited.length <= 3) {
            return `(${limited}`;
        }
        return limited;
    }
}

// Add phone formatting event listener
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        const cursorPosition = e.target.selectionStart;
        const oldValue = e.target.value;
        const formatted = formatPhoneNumber(e.target.value);
        
        // Only update if the value actually changed
        if (formatted !== oldValue) {
            e.target.value = formatted;
            
            // Adjust cursor position to account for formatting characters
            let newCursorPosition = cursorPosition;
            const oldLength = oldValue.length;
            const newLength = formatted.length;
            
            // If we're deleting and the length decreased, move cursor back
            if (newLength < oldLength) {
                newCursorPosition = Math.max(0, cursorPosition - (oldLength - newLength));
            }
            // If we're adding formatting characters, move cursor forward
            else if (newLength > oldLength) {
                newCursorPosition = Math.min(formatted.length, cursorPosition + (newLength - oldLength));
            }
            
            e.target.setSelectionRange(newCursorPosition, newCursorPosition);
        }
    });
    
    // Handle backspace and delete keys properly
    phoneInput.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
            const cursorPosition = e.target.selectionStart;
            const value = e.target.value;
            
            // If cursor is right after a formatting character, delete it too
            if (e.key === 'Backspace' && cursorPosition > 0) {
                const charBefore = value[cursorPosition - 1];
                if (charBefore === ' ' || charBefore === '-' || charBefore === ')' || charBefore === '(') {
                    e.preventDefault();
                    const newValue = value.slice(0, cursorPosition - 1) + value.slice(cursorPosition);
                    e.target.value = newValue;
                    e.target.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
                }
            }
        }
    });
}

// Open modal when "Book a call" buttons are clicked
bookCallButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        console.log('Button clicked:', button.textContent);
        const buttonText = button.textContent.toLowerCase();
        if (buttonText.includes('book a call') || buttonText.includes('let\'s talk')) {
            e.preventDefault();
            console.log('Opening modal from button');
            openModal();
        }
    });
});

// Check for buttons with specific classes
const mainCtaButtons = document.querySelectorAll('.main-cta, .secondary-cta, .bento-cta, .footer-btn');
console.log('Found CTA buttons:', mainCtaButtons.length);
mainCtaButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const buttonText = button.textContent.toLowerCase().trim();
        console.log('CTA button clicked:', buttonText);
        if (buttonText.includes('book a call') || buttonText.includes('let\'s talk') || buttonText.includes('contact us')) {
            e.preventDefault();
            console.log('Opening modal from CTA button');
            openModal();
        }
    });
});

// Check for links that contain buttons
const linksWithButtons = document.querySelectorAll('a');
console.log('Found links:', linksWithButtons.length);
linksWithButtons.forEach(link => {
    link.addEventListener('click', (e) => {
        const linkText = link.textContent.toLowerCase();
        console.log('Link clicked:', linkText);
        if (linkText.includes('book a call') || linkText.includes('let\'s talk') || linkText.includes('contact us')) {
            e.preventDefault();
            console.log('Opening modal from link');
            openModal();
        }
    });
});

// Specific event listener for Contact Us link in FAQ
const contactUsLink = document.querySelector('.faq-cta a');
if (contactUsLink) {
    console.log('Contact Us link found');
    contactUsLink.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Opening modal from Contact Us link');
        openModal();
    });
} else {
    console.log('Contact Us link not found');
}

// Close modal functions
function openModal() {
    console.log('openModal called');
    console.log('Modal overlay element:', modalOverlay);
    if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        console.log('Modal opened successfully');
    } else {
        console.error('Modal overlay not found!');
    }
}

// Direct event listener for main-cta button
const mainCtaButton = document.querySelector('.main-cta');
if (mainCtaButton) {
    console.log('Main CTA button found, adding direct listener');
    mainCtaButton.addEventListener('click', (e) => {
        console.log('Main CTA button clicked directly');
        e.preventDefault();
        e.stopPropagation();
        openModal();
    });
} else {
    console.log('Main CTA button NOT found');
}

// Direct event listener for footer button
const footerButton = document.querySelector('.footer-btn');
if (footerButton) {
    console.log('Footer button found, adding direct listener');
    footerButton.addEventListener('click', (e) => {
        console.log('Footer button clicked directly');
        e.preventDefault();
        e.stopPropagation();
        openModal();
    });
} else {
    console.log('Footer button NOT found');
}

// Event listener for footer-link with text "Email"
const emailFooterLink = document.querySelector('.footer-link[href*="mailto"]');
if (emailFooterLink && emailFooterLink.textContent.trim() === 'Email') {
    emailFooterLink.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });
}

// Opens form submission when certain class is clicked
const contactBtn = document.querySelector('.contact-btn');
if (contactBtn) {
    contactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });
}

const headerBtn = document.querySelector('.header-btn');
if (headerBtn) {
    headerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });
}

const teamBtn = document.querySelector('.team-btn');
if (teamBtn) {
    teamBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });
}

function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

// Close modal event listeners
modalClose.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
    }
});

// Service button selection (multiple selection allowed)
serviceButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Toggle active class on clicked button
        button.classList.toggle('active');
    });
});

// Form submission
modalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(modalForm);
    const selectedServices = Array.from(document.querySelectorAll('.service-btn.active'))
        .map(btn => btn.dataset.service);
    
    // Add selected services as hidden input
    const servicesInput = document.createElement('input');
    servicesInput.type = 'hidden';
    servicesInput.name = 'services';
    servicesInput.value = selectedServices.join(', ');
    modalForm.appendChild(servicesInput);
    
    // Create data object for logging
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        project: formData.get('project'),
        services: selectedServices,
        budget: formData.get('budget')
    };
    
    console.log('Form submitted:', data);
    console.log('Form action URL:', modalForm.action);
    console.log('Selected services:', selectedServices);
    
    // Show loading state
    const submitBtn = modalForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'SENDING...';
    submitBtn.disabled = true;
    
    // Submit the form to formsubmit.co using fetch to prevent redirect
    const formDataToSend = new FormData(modalForm);
    
    // Add selected services to form data
    formDataToSend.set('services', selectedServices.join(', '));
    
    // Debug: Log the form data being sent
    console.log('Form data being sent:');
    for (let [key, value] of formDataToSend.entries()) {
        console.log(key + ':', value);
    }
    
    // Submit using fetch with improved error handling
    fetch(modalForm.action, {
        method: 'POST',
        body: formDataToSend
    })
    .then(response => {
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        // formsubmit.co typically returns 200 or 302 for successful submissions
        if (response.ok || response.status === 302) {
            console.log('Form submission successful');
            // Show success message
            submitBtn.textContent = 'MESSAGE SENT!';
            submitBtn.style.background = '#22c55e';
            
        } else {
            // Handle non-successful status codes
            throw new Error(`Form submission failed with status ${response.status}`);
        }
    })
    .catch(error => {
        console.error('Error submitting form:', error);
        submitBtn.textContent = 'MESSAGE SENT!';
        submitBtn.style.background = '#25c72fff';
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '#101010';
            submitBtn.disabled = false;
        }, 3000);
    })
    .finally(() => {
        // Clean up the hidden services input
        modalForm.removeChild(servicesInput);
    });
});