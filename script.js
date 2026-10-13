document.addEventListener('DOMContentLoaded', () => {
  const slideThumb = document.getElementById('slideThumb');
  const slideTrack = document.getElementById('slideTrack');
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const flagsContainer = document.getElementById('flagsContainer');
  const animalsParade = document.getElementById('animalsParade');

  // Fact Modals
  const factModal = document.getElementById('factModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const closeFactBtn = document.getElementById('closeFactBtn');

  // Timeline Elements
  const timelineModal = document.getElementById('timelineModal');
  const timelineToggleBtn = document.getElementById('timelineToggleBtn');
  const closeTimelineBtn = document.getElementById('closeTimelineBtn');

  // Secret Sun & Auth Elements
  const secretSunBtn = document.getElementById('secretSunBtn');
  const secretAuthModal = document.getElementById('secretAuthModal');
  const closeAuthBtn = document.getElementById('closeAuthBtn');
  const passInput = document.getElementById('passInput');
  const submitPassBtn = document.getElementById('submitPassBtn');
  const passError = document.getElementById('passError');

  // Friend Page Modal
  const friendPageModal = document.getElementById('friendPageModal');
  const closeFriendPageBtn = document.getElementById('closeFriendPageBtn');

  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let maxSlide = 0;
  let hasOpened = false;

  function updateMaxSlide() {
    maxSlide = slideTrack.clientWidth - slideThumb.clientWidth - 10;
  }
  updateMaxSlide();
  window.addEventListener('resize', updateMaxSlide);

  // --- SLIDER DRAG MECHANICS ---
  function onStart(e) {
    if (hasOpened) return;
    isDragging = true;
    startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    slideThumb.style.transition = 'none';
  }

  function onMove(e) {
    if (!isDragging || hasOpened) return;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - startX;
    currentX = Math.max(0, Math.min(deltaX, maxSlide));
    
    slideThumb.style.transform = `translateX(${currentX}px)`;

    if (currentX >= maxSlide * 0.85) {
      triggerEnvelopeOpen();
    }
  }

  function onEnd() {
    if (!isDragging || hasOpened) return;
    isDragging = false;
    slideThumb.style.transition = 'transform 0.3s ease';
    slideThumb.style.transform = 'translateX(0px)';
  }

  slideThumb.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);

  slideThumb.addEventListener('touchstart', onStart, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('touchend', onEnd);

  // --- TRIGGER ENVELOPE OPEN ---
  function triggerEnvelopeOpen() {
    hasOpened = true;
    isDragging = false;
    envelopeWrapper.classList.add('open');

    launchConfetti();
    spawnPeruFlags();

    setTimeout(() => {
      animalsParade.classList.add('walk');
    }, 400);
  }

  // --- FACT CARDS CLICK HANDLERS ---
  const factCards = document.querySelectorAll('.fact-card');
  factCards.forEach(card => {
    card.addEventListener('click', () => {
      modalTitle.innerText = card.getAttribute('data-title');
      modalDesc.innerText = card.getAttribute('data-desc');
      factModal.classList.add('active');
    });
  });

  closeFactBtn.addEventListener('click', () => factModal.classList.remove('active'));

  // --- TIMELINE MODAL HANDLERS ---
  timelineToggleBtn.addEventListener('click', () => timelineModal.classList.add('active'));
  closeTimelineBtn.addEventListener('click', () => timelineModal.classList.remove('active'));

  // --- SECRET SUN & PUZZLE AUTHENTICATION HANDLERS ---
  secretSunBtn.addEventListener('click', () => {
    secretAuthModal.classList.add('active');
    passInput.focus();
  });

  closeAuthBtn.addEventListener('click', () => {
    secretAuthModal.classList.remove('active');
    passError.classList.remove('visible');
  });

  function checkPassword() {
    const enteredPass = passInput.value.trim().toUpperCase().replace(/\s+/g, '');
    
    // Correct Password: PERUESCLAVE
    if (enteredPass === 'PERUESCLAVE') {
      secretAuthModal.classList.remove('active');
      passError.classList.remove('visible');
      passInput.value = '';
      
      // Open Friend Page Modal with extra confetti!
      friendPageModal.classList.add('active');
      launchConfetti();
      spawnPeruFlags();
    } else {
      passError.classList.add('visible');
    }
  }

  submitPassBtn.addEventListener('click', checkPassword);
  passInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkPassword();
  });

  closeFriendPageBtn.addEventListener('click', () => {
    friendPageModal.classList.remove('active');
  });

  // --- CONFETTI CANNON ---
  function launchConfetti() {
    if (typeof confetti === 'undefined') return;
    const colors = ['#d9383a', '#ffffff', '#d9383a', '#ffffff', '#f2b705'];

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: colors
    });

    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: colors
      });
    }, 200);
  }

  // --- FLOATING PERUVIAN FLAGS ---
  function spawnPeruFlags() {
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const flag = document.createElement('div');
        flag.className = 'peru-flag-particle';
        
        flag.style.left = `${Math.random() * 90 + 5}%`;
        flag.style.animationDuration = `${3 + Math.random() * 2.5}s`;

        flagsContainer.appendChild(flag);

        setTimeout(() => flag.remove(), 6000);
      }, i * 120);
    }
  }
});