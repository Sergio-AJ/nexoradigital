class ServiceManager {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Formulario de crear servicio
        const serviceForm = document.getElementById('serviceForm');
        if (serviceForm) {
            serviceForm.addEventListener('submit', this.handleServiceCreation.bind(this));
        }

        // Cargar servicios al inicializar
        this.loadServices();
    }

    async loadServices() {
        try {
            const response = await fetch('obtener-servicios.php');
            const services = await response.json();
            this.displayServices(services);
        } catch (error) {
            console.error('Error al cargar servicios:', error);
        }
    }

    displayServices(services) {
        const container = document.getElementById('servicesContainer');
        if (!container) return;

        if (services.length === 0) {
            container.innerHTML = '<p>No hay servicios disponibles.</p>';
            return;
        }

        const servicesHTML = services.map(service => `
            <div class="service-card">
                <h3>${this.escapeHtml(service.nombre)}</h3>
                <p><strong>Departamento:</strong> ${this.escapeHtml(service.departamento)}</p>
                <p><strong>Estado:</strong> <span class="status-${service.estado}">${service.estado}</span></p>
                <p><strong>Fecha inicio:</strong> ${this.formatDate(service.fecha_inicio)}</p>
                <p><strong>Fecha fin:</strong> ${this.formatDate(service.fecha_fin)}</p>
                <button onclick="serviceManager.contractService(${service.ID_Servicio})" class="btn-contract">
                    Contratar Servicio
                </button>
            </div>
        `).join('');

        container.innerHTML = servicesHTML;
    }

    async contractService(serviceId) {
        if (!confirm('¿Estás seguro de que quieres contratar este servicio?')) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append('service_id', serviceId);

            const response = await fetch('contratar-servicio.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.text();
            alert(result);
            
            // Recargar servicios si la contratación fue exitosa
            if (result.includes('exitoso')) {
                this.loadServices();
            }
        } catch (error) {
            alert('Error al contratar el servicio');
        }
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    }
}