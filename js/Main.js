document.addEventListener('DOMContentLoaded', function() {
    // Inicializar managers según la página actual
    const currentPage = window.location.pathname.split('/').pop();
    
    // Siempre inicializar AuthManager
    window.authManager = new AuthManager();
    
    // Inicializar otros managers según la página
    if (currentPage.includes('cita') || currentPage.includes('appointment')) {
        window.appointmentManager = new AppointmentManager();
    }
    
    if (currentPage.includes('servicio') || currentPage.includes('service') || currentPage.includes('dashboard')) {
        window.serviceManager = new ServiceManager();
    }
    
    // Agregar estilos CSS básicos para los mensajes
    addMessageStyles();
    
    // Configurar CSRF token si existe
    setupCSRFToken();
    
    // Inicializar componentes adicionales
    initializeFormValidation();
    initializeNavigation();
    initializeTheme();
});

function addMessageStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .message {
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            font-weight: bold;
            transition: opacity 0.3s ease;
        }
        .message.success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .message.error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .message.warning {
            background-color: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
        }
        .message.info {
            background-color: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }
        .appointment-card, .service-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            background-color: #f9f9f9;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .appointment-card:hover, .service-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        .status-pendiente { 
            color: #ffc107; 
            font-weight: bold;
        }
        .status-confirmada { 
            color: #28a745; 
            font-weight: bold;
        }
        .status-cancelada { 
            color: #dc3545; 
            font-weight: bold;
        }
        .status-activo { 
            color: #28a745; 
            font-weight: bold;
        }
        .status-inactivo { 
            color: #dc3545; 
            font-weight: bold;
        }
        .btn-contract, .btn-primary {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .btn-contract:hover, .btn-primary:hover {
            background-color: #0056b3;
        }
        .btn-secondary {
            background-color: #6c757d;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .btn-secondary:hover {
            background-color: #545b62;
        }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .form-group input,
        .form-group textarea,
        .form-group select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }
        .loading {
            opacity: 0.6;
            pointer-events: none;
        }
        .spinner {
            border: 2px solid #f3f3f3;
            border-top: 2px solid #007bff;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            display: inline-block;
            margin-right: 10px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .navbar {
            background-color: #343a40;
            padding: 1rem;
            margin-bottom: 2rem;
        }
        .navbar a {
            color: white;
            text-decoration: none;
            margin-right: 1rem;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            transition: background-color 0.3s ease;
        }
        .navbar a:hover {
            background-color: #495057;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
    `;
    document.head.appendChild(style);
}

function setupCSRFToken() {
    // Buscar token CSRF en meta tags o inputs ocultos
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
                     document.querySelector('input[name="csrf_token"]')?.value;
    
    if (csrfToken) {
        // Agregar token CSRF a todos los formularios que no lo tengan
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            if (!form.querySelector('input[name="csrf_token"]')) {
                const tokenInput = document.createElement('input');
                tokenInput.type = 'hidden';
                tokenInput.name = 'csrf_token';
                tokenInput.value = csrfToken;
                form.appendChild(tokenInput);
            }
        });
    }
}

function initializeFormValidation() {
    // Validación en tiempo real para emails
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateEmail(this);
        });
    });
    
    // Validación para contraseñas
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('input', function() {
            validatePassword(this);
        });
    });
    
    // Validación para fechas
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.addEventListener('change', function() {
            validateDate(this);
        });
    });
    
    // Confirmar contraseña
    const confirmPasswordInput = document.querySelector('input[name="confirmar_contraseña"]');
    const passwordInput = document.querySelector('input[name="contraseña"]');
    
    if (confirmPasswordInput && passwordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            validatePasswordMatch(passwordInput, confirmPasswordInput);
        });
    }
}

function validateEmail(input) {
    const email = input.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    toggleInputValidation(input, isValid, 'Por favor, ingresa un email válido');
    return isValid;
}

function validatePassword(input) {
    const password = input.value;
    const isValid = password.length >= 6;
    
    toggleInputValidation(input, isValid, 'La contraseña debe tener al menos 6 caracteres');
    return isValid;
}

function validateDate(input) {
    const selectedDate = new Date(input.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const isValid = selectedDate >= today;
    
    toggleInputValidation(input, isValid, 'No puedes seleccionar una fecha pasada');
    return isValid;
}

function validatePasswordMatch(passwordInput, confirmPasswordInput) {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const isValid = password === confirmPassword;
    
    toggleInputValidation(confirmPasswordInput, isValid, 'Las contraseñas no coinciden');
    return isValid;
}

function toggleInputValidation(input, isValid, errorMessage) {
    // Remover mensajes de error previos
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    if (isValid) {
        input.style.borderColor = '#28a745';
    } else {
        input.style.borderColor = '#dc3545';
        
        // Agregar mensaje de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = 'color: #dc3545; font-size: 12px; margin-top: 5px;';
        errorDiv.textContent = errorMessage;
        input.parentNode.appendChild(errorDiv);
    }
}

function initializeNavigation() {
    // Destacar página actual en navegación
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.navbar a, nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(currentPage)) {
            link.style.backgroundColor = '#495057';
        }
    });
    
    // Menú móvil toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
    }
}

function initializeTheme() {
    // Detectar preferencia de tema del usuario
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        document.body.setAttribute('data-theme', 'dark');
    }
    
    // Toggle de tema si existe
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Utilidades globales
window.NexoraUtils = {
    // Mostrar spinner de carga
    showLoading: function(element) {
        if (element) {
            element.classList.add('loading');
            const spinner = document.createElement('span');
            spinner.className = 'spinner';
            element.prepend(spinner);
        }
    },
    
    // Ocultar spinner de carga
    hideLoading: function(element) {
        if (element) {
            element.classList.remove('loading');
            const spinner = element.querySelector('.spinner');
            if (spinner) {
                spinner.remove();
            }
        }
    },
    
    // Formatear fecha
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    // Escapar HTML
    escapeHtml: function(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },
    
    // Debounce para optimizar búsquedas
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Validar formulario completo
    validateForm: function(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                toggleInputValidation(input, false, 'Este campo es obligatorio');
                isValid = false;
            } else {
                // Validaciones específicas por tipo
                if (input.type === 'email') {
                    isValid = validateEmail(input) && isValid;
                } else if (input.type === 'password') {
                    isValid = validatePassword(input) && isValid;
                } else if (input.type === 'date') {
                    isValid = validateDate(input) && isValid;
                }
            }
        });
        
        return isValid;
    }
};

// Manejo de errores globales
window.addEventListener('error', function(e) {
    console.error('Error global:', e.error);
    // Opcional: reportar errores a un servicio de logging
});

// Prevenir envío de formularios duplicados
document.addEventListener('submit', function(e) {
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    
    if (submitBtn && !submitBtn.disabled) {
        // Validar formulario antes de enviar
        if (!window.NexoraUtils.validateForm(form)) {
            e.preventDefault();
            return;
        }
        
        // Deshabilitar botón para prevenir doble envío
        setTimeout(() => {
            submitBtn.disabled = true;
            window.NexoraUtils.showLoading(submitBtn);
        }, 0);
        
        // Rehabilitar después de 5 segundos por seguridad
        setTimeout(() => {
            submitBtn.disabled = false;
            window.NexoraUtils.hideLoading(submitBtn);
        }, 5000);
    }
});

console.log('Nexora Digital - Sistema inicializado correctamente');