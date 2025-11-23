document.addEventListener("DOMContentLoaded", function () {

    const items = document.querySelectorAll('.container');
    let isTicking = false;
    const root = document.documentElement;
    const timeline = document.querySelector('.timeline'); // Riferimento alla timeline

    /* --- LOGICA 1: CONTROLLO SCROLL E VISIBILITÀ (Card Timeline) --- */

    const checkVisibility = () => {
        const viewportHeight = window.innerHeight;
        const SCROLL_THRESHOLD_ENTER = viewportHeight * 0.90;

        items.forEach(element => {
            const rect = element.getBoundingClientRect();

            // Logica 1: Uscita dal Basso (Reset animazione)
            if (rect.bottom > viewportHeight) {
                if (element.classList.contains('visible')) {
                    element.classList.remove('visible');
                }
                return;
            }

            // Logica 2: Uscita dal Alto (Ignora, mantieni l'animazione)
            if (rect.bottom < 0) {
                return;
            }

            // Logica 3: Entrata (Animazione)
            if (rect.top < SCROLL_THRESHOLD_ENTER && rect.bottom > 0) {
                if (!element.classList.contains('visible')) {
                    element.classList.add('visible');
                }
            }
        });
    };

    const handleScroll = () => {
        if (!isTicking) {
            window.requestAnimationFrame(() => {
                checkVisibility();
                isTicking = false;
            });
            isTicking = true;
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Esegui una volta all'inizio per mostrare gli elementi visibili


    /* --- LOGICA 2: ANIMAZIONE SFONDO AL MOVIMENTO DEL MOUSE/TOUCH (Globale) --- */

    const modal = document.getElementById('banner-modal');

    // Funzione per calcolare/ricalcolare la larghezza del viewport
    let currentWidth = window.innerWidth;
    const setWidth = () => {
        currentWidth = window.innerWidth;
    };

    // Ricalcola la larghezza all'inizio e ad ogni ridimensionamento
    setWidth();
    window.addEventListener('resize', setWidth);

    const updateGradientPosition = (x) => {
        // Calcola la posizione percentuale del mouse/touch (0 a 100%)
        const percentage = (x / currentWidth) * 100;
        // Calcolo della posizione (spostamento -50% a -150% del background-size)
        const backgroundX = -(percentage * 2) + 100;

        root.style.setProperty('--global-gradient-position-x', `${backgroundX}%`);
    };

    // Funzione per gestire il movimento su tutto il documento
    const handleGlobalMouseMove = (e) => {
        // Esegui il movimento SOLO se la modale NON è aperta
        if (modal && !modal.classList.contains('open')) {
            updateGradientPosition(e.clientX);
        } else if (!modal) {
            // Fallback se la modale non è definita
            updateGradientPosition(e.clientX);
        }
    };

    // Funzione per gestire il movimento touch su tutto il documento
    const handleGlobalTouchMove = (e) => {
        if (e.touches.length > 0 && modal && !modal.classList.contains('open')) {
            updateGradientPosition(e.touches[0].clientX);
        }
    };

    // Event listener sul DOCUMENTO INTERO (o body)
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('touchmove', handleGlobalTouchMove);

    // Reset quando il mouse lascia il documento
    document.addEventListener('mouseleave', () => {
        root.style.setProperty('--global-gradient-position-x', `0%`);
    });


    /* --- LOGICA 3: GESTIONE SKILLS DRAWER (Soft/Technical) --- */

    const technicalToggle = document.getElementById('technical-skills-toggle');
    const softToggle = document.getElementById('soft-skills-toggle');
    const technicalDrawer = document.getElementById('technical-skills-drawer');
    const softDrawer = document.getElementById('soft-skills-drawer');

    // Variabili per memorizzare la classe ICONA INIZIALE di ciascun toggle
    const TECHNICAL_ICON_CLASS = technicalToggle ? technicalToggle.querySelector('i').className : 'fas fa-toolbox';
    const SOFT_ICON_CLASS = softToggle ? softToggle.querySelector('i').className : 'fas fa-heart';


    // Funzione generica per la logica di apertura/chiusura (Parametri iconClass e toggleText non usati)
    const toggleDrawer = (drawerToOpen, toggleToRotate, iconClass, toggleText, drawerToClose, otherToggle) => {
        const isOpen = drawerToOpen.classList.contains('open');

        // Chiudi l'altro drawer se è aperto
        if (drawerToClose.classList.contains('open')) {
            drawerToClose.classList.remove('open');
            otherToggle.classList.remove('rotated', 'opened');

            const otherIcon = otherToggle.querySelector('i');

            // Ripristina l'icona corretta usando le costanti iniziali
            if (otherToggle === technicalToggle) {
                otherIcon.className = TECHNICAL_ICON_CLASS;
            } else if (otherToggle === softToggle) {
                otherIcon.className = SOFT_ICON_CLASS;
            }

        }

        // Apri/Chiudi il drawer richiesto
        drawerToOpen.classList.toggle('open', !isOpen);
        toggleToRotate.classList.toggle('rotated', !isOpen);
        toggleToRotate.classList.toggle('opened', !isOpen);

        // Timeline blur quando aperto (solo se è un'apertura)
        timeline.classList.toggle('blur', !isOpen);

        // Aggiorna solo l'icona (IL TESTO RIMANE)
        const icon = toggleToRotate.querySelector('i');
        if (!isOpen) {
            icon.className = 'fas fa-chevron-up'; // Icona Chiudi
        } else {
            // Ripristina l'icona iniziale del toggle corrente se si sta chiudendo
            if (toggleToRotate === technicalToggle) {
                icon.className = TECHNICAL_ICON_CLASS;
            } else if (toggleToRotate === softToggle) {
                icon.className = SOFT_ICON_CLASS;
            }
        }

;
    };

    // Event Listener per Competenze Tecniche
    if (technicalToggle && technicalDrawer && softDrawer && softToggle) {
        technicalToggle.addEventListener('click', () => {
            // I parametri iconClass e toggleText non sono più usati
            toggleDrawer(technicalDrawer, technicalToggle, 'fas fa-toolbox', ' Competenze Tecniche', softDrawer, softToggle);
        });
    }

    // Event Listener per Soft Skills
    if (softToggle && softDrawer && technicalDrawer && technicalToggle) {
        softToggle.addEventListener('click', () => {
            // I parametri iconClass e toggleText non sono più usati
            toggleDrawer(softDrawer, softToggle, 'fas fa-heart', ' Soft Skills', technicalDrawer, technicalToggle);
        });
    }

    // Chiudi al click al di fuori dei drawer
    document.addEventListener('click', (e) => {
        // Controlla che i riferimenti esistano
        if (!technicalDrawer || !softDrawer || !technicalToggle || !softToggle || !timeline) return;

        const isClickInsideTechDrawer = technicalDrawer.contains(e.target);
        const isClickInsideSoftDrawer = softDrawer.contains(e.target);
        const isClickOnToggle = technicalToggle.contains(e.target) || softToggle.contains(e.target);

        if (!isClickInsideTechDrawer && !isClickInsideSoftDrawer && !isClickOnToggle && (technicalDrawer.classList.contains('open') || softDrawer.classList.contains('open'))) {

            // Chiude Tecniche
            technicalDrawer.classList.remove('open');
            technicalToggle.classList.remove('rotated', 'opened');
            // Ripristina l'icona corretta usando le costanti iniziali
            technicalToggle.querySelector('i').className = TECHNICAL_ICON_CLASS;
            // Chiude Soft
            softDrawer.classList.remove('open');
            softToggle.classList.remove('rotated', 'opened');
            // Ripristina l'icona corretta usando le costanti iniziali
            softToggle.querySelector('i').className = SOFT_ICON_CLASS;
            timeline.classList.remove('blur');
        }
    });


    /* --- LOGICA 4: GESTIONE MODALE DINAMICA (Pop-up per Banner e PDF) --- */

    // Seleziona TUTTI i link con la classe open-modal-link
    const openModalLinks = document.querySelectorAll('.open-modal-link');
    // La variabile `modal` è già definita sopra in Logica 2
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalIframe = document.getElementById('banner-iframe');
    const reloadBtn = document.getElementById('reload-iframe-btn'); // Riferimento al pulsante reload
    const body = document.body;

    // Funzione per chiudere la modale
    const closeModal = () => {
        modal.classList.remove('open');
        body.style.overflow = '';
        modalIframe.src = '';
        // NUOVO: Rimuovi le classi quando chiudi
        modalIframe.classList.remove('fullsize', 'centered');
    };

    // Aggiunge l'event listener a TUTTI i link che aprono la modale
    openModalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const srcUrl = link.getAttribute('data-src');

            if (srcUrl && modalIframe) {

                // 1. Imposta l'URL dell'iframe
                modalIframe.src = srcUrl;

                // 2. NUOVO: Aggiungi classe in base al tipo di contenuto
                if (srcUrl.includes('.pdf') || srcUrl.includes('/preview')) {
                    modalIframe.classList.add('fullsize');
                    modalIframe.classList.remove('centered');
                } else {
                    modalIframe.classList.add('centered');
                    modalIframe.classList.remove('fullsize');
                }

                // 3. Apri la modale
                modal.classList.add('open');
                body.style.overflow = 'hidden';
            } else {
                console.error("URL mancante o Iframe non trovato");
            }
        });
    });

    // Event listeners per i controlli della modale
    if (modal) {
        // Chiudi al click sul pulsante 'X'
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }

        // Logica per il pulsante Ricarica
        if (reloadBtn && modalIframe) {
            reloadBtn.addEventListener('click', () => {
                // Riassegna il src a se stesso per forzare il reload
                modalIframe.src = modalIframe.src;
            });
        }

        // Chiudi al click sull'overlay (sfondo scuro)
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                closeModal();
            }
        });

        // Chiudi alla pressione del tasto ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) {
                closeModal();
            }
        });
    }


    /* --- LOGICA 5: INTERAZIONE GRADIENTE MODALE --- */

    const modalContent = document.querySelector('.modal-content');

    if (modalContent) {
        let contentWidth = modalContent.clientWidth;

        // Ricalcola la larghezza del contenuto della modale quando la finestra viene ridimensionata
        const setContentWidth = () => {
            if (modal.classList.contains('open')) {
                contentWidth = modalContent.clientWidth;
            }
        };
        window.addEventListener('resize', setContentWidth);

        const updateModalGradient = (x) => {
            if (contentWidth === 0) return; // Evita divisione per zero se non è visibile

            // Calcola la posizione del mouse rispetto al lato sinistro del modal-content
            const rect = modalContent.getBoundingClientRect();
            const relativeX = x - rect.left;

            const percentage = (relativeX / contentWidth) * 100;

            // La logica di spostamento è la stessa
            const backgroundX = -(percentage * 2) + 100;

            // AGGIORNA LA VARIABILE DEDICATA ALLA MODALE
            root.style.setProperty('--modal-gradient-position-x', `${backgroundX}%`);
        };

        // Aggiorna la larghezza quando la modale si apre per la prima volta
        modal.addEventListener('transitionend', () => {
            if (modal.classList.contains('open')) {
                setContentWidth();
            }
        }, { once: true });


        // Attiva il movimento solo sul contenuto della modale
        modalContent.addEventListener('mousemove', (e) => {
            updateModalGradient(e.clientX);
        });

        modalContent.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                updateModalGradient(e.touches[0].clientX);
            }
        });

        // Resetta quando il mouse esce dall'area modale
        modalContent.addEventListener('mouseleave', () => {
            root.style.setProperty('--modal-gradient-position-x', `50%`);
        });
    }


}); // Fine DOMContentLoaded