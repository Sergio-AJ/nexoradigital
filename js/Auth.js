class AuthManager {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Formulario de registro
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', this.handleRegister.bind(this));
        }

        // Formulario de login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }

        // Botón de logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', this.handleLogout.bind(this));
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const password = formData.get('contraseña');
        const confirmPassword = formData.get('confirmar_contraseña');

        // Validación de contraseñas
        if (password !== confirmPassword) {
            this.showMessage('Las contraseñas no coinciden', 'error');
            return;
        }

        try {
            const response = await fetch('registro.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.text();
            
            if (result.includes('exitoso')) {
                this.showMessage('Registro exitoso. Redirigiendo...', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                this.showMessage(result, 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);

        try {
            const response = await fetch('inicio-sesion.php', {
                method: 'POST',
                body: formData
            });

            if (response.redirected) {
                window.location.href = response.url;
            } else {
                const result = await response.text();
                this.showMessage(result, 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
        }
    }

    handleLogout() {
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            window.location.href = 'logout.php';
        }
    }

    showMessage(message, type) {
        const messageDiv = document.getElementById('message') || this.createMessageDiv();
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';

        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }

    createMessageDiv() {
        const div = document.createElement('div');
        div.id = 'message';
        div.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px;
            border-radius: 5px;
            z-index: 1000;
            max-width: 300px;
        `;
        document.body.appendChild(div);
        return div;
    }
}
