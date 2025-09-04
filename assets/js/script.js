const ATTENDANCE_CONFIG = {
    validCodes: ['SI2025', 'SISTEMAS2025'],
    excelUrl: 'https://docs.google.com/spreadsheets/d/1WQ4HWhgxy5VIyP_l3ylDl-Ka1pSjB8XeiIF6opmDXjM/edit?usp=sharing'
};

const FUNNY_MESSAGES = [
    "🤔 Parece que estás buscando el aula equivocada... ¿No será que querías ir a Educación Física?",
    "🎭 ¡Creatividad level 100! Pero este no es el código correcto. ¿Seguro que no te confundiste de semestre?",
    "🕵️ Detectamos un intento de hackeo... o simplemente te equivocaste de código. Preferimos pensar lo segundo 😅",
    "🎪 ¡Buen intento! Pero este código no abre las puertas del conocimiento en Sistemas de Información.",
    "🤖 Error 404: Código no encontrado. ¿Será que estás en la clase correcta?",
    "📚 Ese código parece de otro planeta... ¿No será que vienes del futuro?",
    "🎯 ¡Casi! Pero 'casi' no cuenta en sistemas. Intenta con el código correcto esta vez.",
    "🧩 Código incorrecto detectado. Pista: No es tu número de cédula ni tu fecha de nacimiento 😄",
    "🎲 ¡Dados cargados! Ese código no va a funcionar. ¿Probamos con el correcto?",
    "🌟 ¡Qué originalidad! Pero necesitamos el código mágico para abrir el portal de la asistencia."
];

const COURSE_MODULES = [
    {
        id: 1,
        number: 1,
        title: "Conceptos Fundamentales",
        topics: [
            "Definición de Sistemas de Información",
            "Tipos de Sistema de Información",
            "Pirámide Organizacional, Tecnologías de la información y SI",
            "Ciclo de vida de un Sistema de Información"
        ]
    },
    {
        id: 2,
        number: 2,
        title: "Sistemas Empresariales",
        topics: [
            "Sistemas de información de marketing: Gestión de relaciones con clientes (CRM)",
            "Planificación de Recursos Empresariales (ERP)",
            "Sistemas de apoyo a toma de decisiones: Sistemas de información gerencial, inteligencia de negocios",
            "Conceptos de BigData, Computación en la nube, Data Mining, Datawarehouse"
        ]
    },
    {
        id: 3,
        number: 3,
        title: "Análisis de Sistemas",
        topics: [
            "Identificación de procesos asociados",
            "Levantamiento de Requerimientos",
            "Metodologías de análisis de requerimientos",
            "Estudio de factibilidad",
            "Análisis costo-beneficio"
        ]
    },
    {
        id: 4,
        number: 4,
        title: "Diseño de Sistemas",
        topics: [
            "Especificaciones de diseño: Entradas/Salidas",
            "Procedimientos de captura y recolección de datos",
            "Modelo de datos",
            "Frontend (Mockups) del sistema de información",
            "Arquitectura de los Sistemas de Información",
            "Evaluación del diseño"
        ]
    },
    {
        id: 5,
        number: 5,
        title: "Desarrollo de Prototipos",
        topics: [
            "Revisión de metodologías de desarrollo",
            "Aplicación de metodologías de desarrollo",
            "Implementación de prototipo",
            "Evaluación del prototipo"
        ]
    }
];

let attemptCount = 0;
let lastAttemptTime = 0;
const MAX_ATTEMPTS = 5;
const COOLDOWN_PERIOD = 30000;

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    renderModules();
    initializeEventListeners();
    initializeAnimations();
}

function renderModules() {
    const container = document.getElementById('modulesContainer');
    if (!container) return;

    container.innerHTML = '';

    COURSE_MODULES.forEach((module, index) => {
        const moduleCard = createModuleCard(module, index);
        container.appendChild(moduleCard);
    });
}

function createModuleCard(module, index) {
    const card = document.createElement('div');
    card.className = 'module-card slide-up';
    card.style.animationDelay = `${index * 0.1}s`;
    card.onclick = () => toggleModule(card);

    const topicsHTML = module.topics.map(topic => `<li>${topic}</li>`).join('');

    card.innerHTML = `
        <div class="module-header">
            <span class="module-number">${module.number}</span>
            <h3 class="module-title">${module.title}</h3>
        </div>
        <ul class="subtopics">
            ${topicsHTML}
        </ul>
    `;

    return card;
}

function toggleModule(card) {
    document.querySelectorAll('.module-card').forEach(c => c.classList.remove('active'));
    
    card.classList.add('active');
}

function initializeEventListeners() {
    const attendanceInput = document.getElementById('attendanceCode');
    if (attendanceInput) {
        attendanceInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                checkAttendance();
            }
        });

        attendanceInput.addEventListener('input', function(event) {
            const value = event.target.value;
            const sanitized = value.replace(/[^A-Za-z0-9]/g, '');
            if (sanitized !== value) {
                event.target.value = sanitized;
            }
        });
    }

    window.onclick = function(event) {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            closeModal();
        }
    };
}

function checkAttendance() {
    const input = document.getElementById('attendanceCode');
    const code = input.value.trim();
    
    if (!code) {
        showModal("⚠️ Campo vacío", "Debe ingresar un código de acceso para continuar.");
        return;
    }

    if (!checkRateLimit()) {
        const remainingTime = Math.ceil((COOLDOWN_PERIOD - (Date.now() - lastAttemptTime)) / 1000);
        showModal(
            "⏰ Demasiados intentos", 
            `Por favor espera ${remainingTime} segundos antes de intentar nuevamente.`
        );
        return;
    }

    if (isValidCode(code)) {
        handleValidCode(input);
    } else {
        handleInvalidCode(input);
    }
}

function isValidCode(code) {
    return ATTENDANCE_CONFIG.validCodes.some(validCode => 
        validCode.toLowerCase() === code.toLowerCase()
    );
}

function handleValidCode(input) {
    input.value = '';
    showModal(
        "✅ ¡Código correcto!", 
        "Redirigiendo al registro de asistencia...",
        2000
    );
    
    setTimeout(() => {
        window.open(ATTENDANCE_CONFIG.excelUrl, '_blank');
        closeModal();
    }, 1500);
}

function handleInvalidCode(input) {
    attemptCount++;
    lastAttemptTime = Date.now();
    
    input.classList.add('error');
    input.style.animation = 'shake 0.5s';
    
    const randomMessage = FUNNY_MESSAGES[Math.floor(Math.random() * FUNNY_MESSAGES.length)];
    showModal("🚫 ¡Ups! Código incorrecto", randomMessage);
    
    setTimeout(() => {
        input.value = '';
        input.classList.remove('error');
        input.style.animation = '';
        input.focus();
    }, 500);
}

function checkRateLimit() {
    const now = Date.now();
    const timeSinceLastAttempt = now - lastAttemptTime;

    if (timeSinceLastAttempt > COOLDOWN_PERIOD) {
        attemptCount = 0;
    }

    return attemptCount < MAX_ATTEMPTS;
}

function showModal(title, message, autoCloseTime = null) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.style.display = 'block';
    
    if (autoCloseTime) {
        setTimeout(() => {
            closeModal();
        }, autoCloseTime);
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

function initializeAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.fade-in, .slide-up').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

function updateValidCodes(newCodes) {
    if (Array.isArray(newCodes)) {
        ATTENDANCE_CONFIG.validCodes = newCodes;
        console.log('Códigos de asistencia actualizados:', newCodes);
    }
}

function updateExcelUrl(newUrl) {
    if (typeof newUrl === 'string' && newUrl.length > 0) {
        ATTENDANCE_CONFIG.excelUrl = newUrl;
        console.log('URL del Excel actualizada:', newUrl);
    }
}

function getAttendanceStats() {
    return {
        attempts: attemptCount,
        lastAttempt: lastAttemptTime ? new Date(lastAttemptTime).toLocaleString() : null,
        cooldownActive: attemptCount >= MAX_ATTEMPTS && (Date.now() - lastAttemptTime) < COOLDOWN_PERIOD,
        remainingCooldown: attemptCount >= MAX_ATTEMPTS ? 
            Math.max(0, COOLDOWN_PERIOD - (Date.now() - lastAttemptTime)) / 1000 : 0
    };
}

function resetAttempts() {
    attemptCount = 0;
    lastAttemptTime = 0;
    console.log('Intentos de asistencia reseteados');
}

function sanitizeInput(input) {
    return input.replace(/[^A-Za-z0-9]/g, '').substring(0, 15);
}

function logMessage(message, type = 'info') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`);
}

window.onerror = function(message, source, lineno, colno, error) {
    console.error('Error global capturado:', {
        message,
        source,
        line: lineno,
        column: colno,
        error
    });
    return false;
};

function enableDebugMode() {
    window.debugMode = true;
    console.log('Modo debug activado');
    console.log('Configuración actual:', ATTENDANCE_CONFIG);
    console.log('Módulos disponibles:', COURSE_MODULES.length);
    console.log('Comandos disponibles: updateValidCodes(), updateExcelUrl(), getAttendanceStats(), resetAttempts()');
}

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    enableDebugMode();
}