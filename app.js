/**
 * MTECNO - Lógica de la aplicación
 * Gestión del formulario de presupuesto por WhatsApp, catálogo de equipos,
 * navegación móvil y microinteracciones.
 */

(function () {
    "use strict";

    // Número oficial de WhatsApp de Mtecno (formato internacional sin signos ni espacios)
    const WA_PHONE = "5491133508318";

    // Catálogo de equipos y tipos de reparaciones frecuentes
    const SERVICES_DATA = {
        "Celular": [
            "Cambio de módulo / pantalla",
            "Cambio de batería",
            "Pin de carga / puerto USB",
            "Cámara principal o frontal",
            "Altavoz / auricular / micrófono",
            "Equipo mojado (baño químico)",
            "Tapa trasera / marco",
            "Software o desbrickeo",
            "No enciende / diagnóstico general",
            "Otro problema"
        ],
        "Tablet": [
            "Cambio de pantalla táctil o display",
            "Cambio de batería",
            "Pin de carga",
            "Problemas de software o actualización",
            "No enciende / diagnóstico general",
            "Otro problema"
        ],
        "Notebook": [
            "Cambio de pantalla",
            "Reparación o cambio de teclado",
            "Reparación de bisagras o carcasa",
            "Pin de carga / conector DC Jack",
            "Disco SSD o ampliación de memoria RAM",
            "Mantenimiento térmico y limpieza profunda",
            "Cambio de batería interna",
            "Formateo e instalación de Windows",
            "No enciende / falla de placa",
            "Otro problema"
        ],
        "Computadora": [
            "Formateo e instalación de Windows/Office",
            "Instalación de disco SSD ultra rápido",
            "Ampliación de memoria RAM",
            "Limpieza integral y cambio de pasta térmica",
            "Falla de fuente de alimentación o placa madre",
            "Armado de PC a medida o actualización",
            "Eliminación de virus o lentitud extrema",
            "No enciende / no da imagen",
            "Otro problema"
        ],
        "Equipo electrónico": [
            "Diagnóstico general de placa electrónica",
            "Reparación de fuente conmutada",
            "Reemplazo de componentes SMD / soldados",
            "Consola de videojuegos / accesorio",
            "Otro equipo electrónico"
        ],
        "Software": [
            "Instalación limpia de sistema operativo",
            "Eliminación de virus, troyanos y malware",
            "Respaldo seguro de archivos (Backup)",
            "Instalación de programas de trabajo",
            "Optimización de rendimiento general",
            "Otro problema de software"
        ]
    };

    // Referencias a elementos del DOM
    const eqSelect = document.getElementById("eq");
    const repSelect = document.getElementById("rep");
    const quoteForm = document.getElementById("f");
    const brandInput = document.getElementById("marca");
    const modelInput = document.getElementById("modelo");
    const nameInput = document.getElementById("nom");
    const detailInput = document.getElementById("det");
    const submitBtn = document.getElementById("btn-submit");
    const btnText = document.getElementById("btn-text");
    const feedbackBox = document.getElementById("form-feedback");
    const navToggle = document.getElementById("nav-toggle");
    const mainNav = document.getElementById("main-nav");
    const currentYearEl = document.getElementById("current-year");
    const waDirectLink = document.getElementById("wal");

    /**
     * Inicializa los desplegables de equipos y reparaciones
     */
    function initDropdowns() {
        if (!eqSelect || !repSelect) return;

        // Llenar selector de equipos
        eqSelect.innerHTML = Object.keys(SERVICES_DATA)
            .map(item => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`)
            .join("");

        // Llenar reparaciones según el primer equipo seleccionado
        updateRepairs();

        // Escuchar cambios de equipo para actualizar las reparaciones
        eqSelect.addEventListener("change", updateRepairs);
    }

    /**
     * Actualiza la lista de reparaciones según el equipo seleccionado
     */
    function updateRepairs() {
        if (!eqSelect || !repSelect) return;
        const selectedEq = eqSelect.value;
        const repairs = SERVICES_DATA[selectedEq] || ["Diagnóstico general", "Otro"];

        repSelect.innerHTML = repairs
            .map(r => `<option value="${escapeHtml(r)}">${escapeHtml(r)}</option>`)
            .join("");
    }

    /**
     * Escapa caracteres HTML para prevenir inyecciones visuales
     */
    function escapeHtml(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /**
     * Enlaza botones rápidos de las tarjetas de servicios con el formulario
     */
    function initServiceCardButtons() {
        const cardButtons = document.querySelectorAll("[data-select-eq]");
        cardButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const targetEq = btn.getAttribute("data-select-eq");
                if (targetEq && SERVICES_DATA[targetEq] && eqSelect) {
                    eqSelect.value = targetEq;
                    updateRepairs();

                    // Scroll suave hacia la sección de presupuesto
                    const quoteSection = document.getElementById("presupuesto");
                    if (quoteSection) {
                        quoteSection.scrollIntoView({ behavior: "smooth", block: "start" });
                    }

                    // Foco en el campo de marca para agilizar la carga
                    setTimeout(() => {
                        if (brandInput) brandInput.focus();
                    }, 400);
                }
            });
        });
    }

    /**
     * Muestra mensaje de error en un campo del formulario
     */
    function showFieldError(input, errorElId) {
        input.classList.add("input-error");
        const errorEl = document.getElementById(errorElId);
        if (errorEl) errorEl.style.display = "block";
    }

    /**
     * Limpia errores de un campo específico
     */
    function clearFieldError(input, errorElId) {
        input.classList.remove("input-error");
        const errorEl = document.getElementById(errorElId);
        if (errorEl) errorEl.style.display = "none";
    }

    /**
     * Escucha eventos de tipeo para limpiar estados de error en tiempo real
     */
    function initValidationListeners() {
        if (brandInput) {
            brandInput.addEventListener("input", () => clearFieldError(brandInput, "err-marca"));
        }
        if (modelInput) {
            modelInput.addEventListener("input", () => clearFieldError(modelInput, "err-modelo"));
        }
        if (nameInput) {
            nameInput.addEventListener("input", () => clearFieldError(nameInput, "err-nom"));
        }
    }

    /**
     * Procesa y valida el envío del formulario de presupuesto
     */
    function handleQuoteSubmit(e) {
        e.preventDefault();

        // Limpiar errores previos
        let hasErrors = false;
        clearFieldError(brandInput, "err-marca");
        clearFieldError(modelInput, "err-modelo");
        clearFieldError(nameInput, "err-nom");

        const brand = brandInput.value.trim();
        const model = modelInput.value.trim();
        const name = nameInput.value.trim();
        const equipment = eqSelect.value;
        const repair = repSelect.value;
        const detail = detailInput.value.trim();

        // Validar campos requeridos
        if (!brand) {
            showFieldError(brandInput, "err-marca");
            hasErrors = true;
        }
        if (!model) {
            showFieldError(modelInput, "err-modelo");
            hasErrors = true;
        }
        if (!name) {
            showFieldError(nameInput, "err-nom");
            hasErrors = true;
        }

        if (hasErrors) {
            if (feedbackBox) {
                feedbackBox.className = "form-feedback feedback-error";
                feedbackBox.textContent = "Por favor, completá los campos obligatorios marcados con (*).";
                feedbackBox.style.display = "block";
            }
            return;
        }

        // Armar mensaje profesional y formateado para WhatsApp
        let message = `👋 Hola Mtecno, mi nombre es *${name}*.\nQuiero solicitar un presupuesto:\n\n` +
            `📱 *Equipo:* ${equipment}\n` +
            `🏷️ *Marca:* ${brand}\n` +
            `🔍 *Modelo:* ${model}\n` +
            `🔧 *Reparación:* ${repair}`;

        if (detail) {
            message += `\n📝 *Falla / Síntomas:* ${detail}`;
        }

        message += `\n\nQuedo a la espera de su respuesta. ¡Muchas gracias!`;

        const waUrl = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(message)}`;

        // Mostrar estado de carga en el botón
        if (submitBtn) {
            submitBtn.disabled = true;
            if (btnText) btnText.textContent = "Abriendo WhatsApp...";
        }

        if (feedbackBox) {
            feedbackBox.className = "form-feedback feedback-success";
            feedbackBox.innerHTML = `¡Listo ${escapeHtml(name)}! Te estamos redirigiendo a WhatsApp... Si no se abre automáticamente, <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="link-wa-fallback">hacé clic acá</a>.`;
            feedbackBox.style.display = "block";
        }

        // Abrir WhatsApp de forma segura
        const newWindow = window.open(waUrl, "_blank", "noopener,noreferrer");

        // Fallback en navegadores móviles si bloquean ventanas emergentes
        if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
            window.location.href = waUrl;
        }

        // Restaurar estado del botón después de unos segundos
        setTimeout(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                if (btnText) btnText.textContent = "Solicitar presupuesto por WhatsApp";
            }
        }, 4000);
    }

    /**
     * Control del menú de navegación móvil
     */
    function initMobileNav() {
        if (!navToggle || !mainNav) return;

        function toggleMenu() {
            const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
            navToggle.setAttribute("aria-expanded", !isExpanded);
            navToggle.classList.toggle("is-active");
            mainNav.classList.toggle("is-open");
            document.body.classList.toggle("nav-locked", !isExpanded);
        }

        function closeMenu() {
            navToggle.setAttribute("aria-expanded", "false");
            navToggle.classList.remove("is-active");
            mainNav.classList.remove("is-open");
            document.body.classList.remove("nav-locked");
        }

        navToggle.addEventListener("click", toggleMenu);

        // Cerrar menú al hacer clic en cualquier enlace
        const navLinks = mainNav.querySelectorAll(".nav-link, .btn-nav-wa");
        navLinks.forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        // Cerrar al presionar tecla Escape
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && mainNav.classList.contains("is-open")) {
                closeMenu();
            }
        });
    }

    /**
     * Actualiza el año actual en el pie de página
     */
    function initCurrentYear() {
        if (currentYearEl) {
            currentYearEl.textContent = new Date().getFullYear();
        }
    }

    /**
     * Asegura enlaces directos de WhatsApp en contacto
     */
    function initContactLinks() {
        if (waDirectLink) {
            waDirectLink.href = `https://wa.me/${WA_PHONE}`;
            waDirectLink.target = "_blank";
            waDirectLink.rel = "noopener noreferrer";
        }
    }

    // Inicialización al cargar el DOM
    document.addEventListener("DOMContentLoaded", () => {
        initDropdowns();
        initServiceCardButtons();
        initValidationListeners();
        initMobileNav();
        initCurrentYear();
        initContactLinks();

        if (quoteForm) {
            quoteForm.addEventListener("submit", handleQuoteSubmit);
        }
    });

})();
