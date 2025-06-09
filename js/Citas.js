class AppointmentManager {
    constructor() {
        this.initializeEventListeners();
        this.loadAppointments();
    }

    initializeEventListeners() {
        // Formulario de solicitar cita
        const appointmentForm = document.getElementById('appointmentForm');
        if (appointmentForm) {
            appointmentForm.addEventListener('submit', this.handleAppointmentRequest.bind(this));
        }

        // Botón de actualizar citas
        const refreshBtn = document.getElementById('refreshAppointments');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadAppointments());
        }

        // Configurar fecha mínima en el input de fecha
        const dateInput = document.getElementById('fecha');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }
    }

    async handleAppointmentRequest(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        
        // Validación básica
        const nombre = formData.get('nombre').trim();
        const email = formData.get('email').trim();
        const fecha = formData.get('fecha');
        const motivo = formData.get('motivo').trim();

        if (!nombre || !email || !fecha || !motivo) {
            this.showMessage('Todos los campos son obligatorios', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showMessage('Por favor, ingresa un email válido', 'error');
            return;
        }

        try {
            const response = await fetch('pedir-cita.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.text();
            
            if (result.includes('correctamente')) {
                this.showMessage('Cita solicitada correctamente', 'success');
                e.target.reset();
                this.loadAppointments(); // Recargar la lista de citas
            } else {
                this.showMessage(result, 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
        }
    }

    async loadAppointments() {
        try {
            const response = await fetch('obtener-citas.php');
            const appointments = await response.json();
            
            if (appointments.error) {
                this.showMessage(appointments.error, 'error');
                return;
            }

            this.displayAppointments(appointments);
        } catch (error) {
            this.showMessage('Error al cargar las citas', 'error');
        }
    }

    displayAppointments(appointments) {
        const container = document.getElementById('appointmentsContainer');
        if (!container) return;

        if (appointments.length === 0) {
            container.innerHTML = '<p>No hay citas registradas.</p>';
            return;
        }

        const appointmentsHTML = appointments.map(appointment => `
            <div class="appointment-card">
                <h3>${this.escapeHtml(appointment.nombre)}</h3>
                <p><strong>Email:</strong> ${this.escapeHtml(appointment.email)}</p>
                <p><strong>Fecha:</strong> ${this.formatDate(appointment.fecha)}</p>
                <p><strong>Motivo:</strong> ${this.escapeHtml(appointment.motivo)}</p>
                <p><strong>Estado:</strong> <span class="status-${appointment.estado || 'pendiente'}">${appointment.estado || 'Pendiente'}</span></p>
            </div>
        `).join('');

        container.innerHTML = appointmentsHTML;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    showMessage(message, type) {
        // Reutilizar la función de AuthManager o crear una similar
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