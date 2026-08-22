/* ============================================================
   Miracle Advanced Physiotherapy Clinic — Shared Scripts
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Highlight current page in navbar ---------- */
  function highlightActiveNav() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    var links = document.querySelectorAll('.nav-links a');
    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === path) {
        link.classList.add('active');
      }
    });
  }

  /* ---------- Mobile hamburger menu ---------- */
  function initMobileMenu() {
    var hamburger = document.querySelector('.hamburger');
    var navLinks = document.querySelector('.nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      hamburger.textContent = navLinks.classList.contains('open') ? '\u2715' : '\u2630';
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.textContent = '\u2630';
      });
    });
  }

  /* ---------- Footer year ---------- */
  function setYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- Testimonial carousel (vanilla) ---------- */
  function initCarousel() {
    var track = document.querySelector('.carousel-track');
    if (!track) return;
    var slides = track.children;
    var index = 0;
    var prevBtn = document.querySelector('.carousel-prev');
    var nextBtn = document.querySelector('.carousel-next');

    function show() {
      track.style.transform = 'translateX(-' + index * 100 + '%)';
    }
    if (nextBtn) nextBtn.addEventListener('click', function () {
      index = (index + 1) % slides.length;
      show();
    });
    if (prevBtn) prevBtn.addEventListener('click', function () {
      index = (index - 1 + slides.length) % slides.length;
      show();
    });
    // Auto-play
    setInterval(function () {
      index = (index + 1) % slides.length;
      show();
    }, 6000);
  }

  /* ---------- Accordion ---------- */
  function initAccordion() {
    document.querySelectorAll('.accordion-item').forEach(function (item) {
      var head = item.querySelector('.accordion-head');
      if (!head) return;
      head.addEventListener('click', function () {
        var body = item.querySelector('.accordion-body');
        var isOpen = item.classList.contains('open');
        // Close siblings
        item.parentElement.querySelectorAll('.accordion-item.open').forEach(function (other) {
          if (other !== item) {
            other.classList.remove('open');
            other.querySelector('.accordion-body').style.maxHeight = null;
          }
        });
        if (isOpen) {
          item.classList.remove('open');
          body.style.maxHeight = null;
        } else {
          item.classList.add('open');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  }

  /* ---------- FAQ category tabs ---------- */
  function initFaqTabs() {
    var tabs = document.querySelectorAll('.tab-btn[data-cat]');
    if (!tabs.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.tab-btn').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var cat = tab.getAttribute('data-cat');
        document.querySelectorAll('.faq-category').forEach(function (c) {
          c.style.display = (c.getAttribute('data-cat') === cat || cat === 'all') ? 'block' : 'none';
        });
      });
    });
  }

/* ---------- Gallery filters + lightbox ---------- */
  function initGallery() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    var items = document.querySelectorAll('.gallery-item');
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var closeBtn = document.querySelector('.lightbox .close');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        items.forEach(function (item) {
          var show = (filter === 'all' || item.getAttribute('data-cat') === filter);
          item.style.display = show ? '' : 'none';
        });
        // Re-render carousel shown items after filtering
        if (window.__galleryCarousel) window.__galleryCarousel.refresh();
      });
    });

    items.forEach(function (item) {
      item.addEventListener('click', function () {
        var img = item.querySelector('img');
        if (lightbox && lightboxImg && img) {
          lightboxImg.src = img.getAttribute('data-full') || img.src;
          lightbox.classList.add('open');
        }
      });
    });
    if (closeBtn) closeBtn.addEventListener('click', function () { lightbox.classList.remove('open'); });
    if (lightbox) lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) lightbox.classList.remove('open');
    });

    initGalleryCarousel();
  }

  /* ---------- Gallery auto-sliding carousel (3 desktop / 1 mobile) ---------- */
  function initGalleryCarousel() {
    var viewport = document.querySelector('.gallery-viewport');
    var track = document.querySelector('.gallery-grid');
    if (!viewport || !track) return;
    var prevBtn = document.querySelector('.gallery-prev');
    var nextBtn = document.querySelector('.gallery-next');
    var dotsWrap = document.querySelector('.gallery-dots');
    if (!dotsWrap) return;

    var items = track.querySelectorAll('.gallery-item');
    // Only "visible" (filtered) items are slides
    var shown = [];
    items.forEach(function (it, i) { if (it.style.display !== 'none') shown.push(it); });

    var index = 0;
    var perView = 3;
    var timer = null;

    function perViewCount() {
      return window.innerWidth <= 768 ? 1 : 3;
    }

    function maxIndex() {
      return Math.max(0, shown.length - perViewCount());
    }

    function renderDots() {
      dotsWrap.innerHTML = '';
      var n = maxIndex() + 1;
      for (var i = 0; i < n; i++) {
        var d = document.createElement('button');
        d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        if (i === index) d.classList.add('active');
        (function (idx) {
          d.addEventListener('click', function () { go(idx); });
        })(i);
        dotsWrap.appendChild(d);
      }
    }

    function go(i) {
      index = Math.max(0, Math.min(i, maxIndex()));
      track.style.transform = 'translateX(-' + (index * (100 / perViewCount())) + '%)';
      // update dots
      var dots = dotsWrap.querySelectorAll('button');
      dots.forEach(function (d, di) { d.classList.toggle('active', di === index); });
    }

    function next() { go(index + 1); }
    function prev() { go(index - 1); }

    function play() { if (timer) return; timer = setInterval(function () { if (index >= maxIndex()) go(0); else next(); }, 3500); }
    function pause() { if (timer) { clearInterval(timer); timer = null; } }

    if (nextBtn) nextBtn.addEventListener('click', function () { next(); play(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); play(); });

    var carousel = viewport.parentElement;
    carousel.addEventListener('mouseenter', pause);
    carousel.addEventListener('mouseleave', play);
    carousel.addEventListener('touchstart', pause, { passive: true });
    carousel.addEventListener('touchend', play, { passive: true });

    window.addEventListener('resize', function () {
      index = Math.min(index, maxIndex());
      // set per-view width margins
      track.style.transform = 'translateX(-' + (index * (100 / perViewCount())) + '%)';
      renderDots();
    });

    function refresh() {
      items.forEach(function (it) { if (it.style.display !== 'none' && shown.indexOf(it) === -1) shown.push(it); });
      shown = shown.filter(function (it) { return it.style.display !== 'none'; });
      index = Math.min(index, maxIndex());
      renderDots();
      go(index);
    }

    // Expose refresh for filter updates
    window.__galleryCarousel = { refresh: refresh };

    // Initial
    renderDots();
    go(0);
    play();
  }

  /* ---------- Doctor modal ---------- */
  function initDoctorModal() {
    var modal = document.getElementById('doctorModal');
    if (!modal) return;
    var viewBtns = document.querySelectorAll('.view-profile');
    var closeBtn = modal.querySelector('.close');

    viewBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-doctor');
        var profile = document.querySelector('.doctor-profile[data-id="' + id + '"]');
        if (profile) {
          // Clone into modal
          var content = modal.querySelector('.modal-content');
          var existing = modal.querySelector('.doctor-profile');
          if (existing) existing.remove();
          var clone = profile.cloneNode(true);
          content.insertBefore(clone, closeBtn);
          modal.classList.add('open');
        }
      });
    });
    if (closeBtn) closeBtn.addEventListener('click', function () { modal.classList.remove('open'); });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  /* ---------- Form validation ---------- */
  function initForms() {
    document.querySelectorAll('form[data-validate]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var valid = true;
        form.querySelectorAll('[required]').forEach(function (field) {
          var group = field.closest('.form-group');
          if (!field.value.trim()) {
            valid = false;
            if (group) {
              group.classList.add('invalid');
              var err = group.querySelector('.form-error');
              if (err) err.textContent = 'This field is required.';
            }
          } else {
            if (group) {
              group.classList.remove('invalid');
              var err = group.querySelector('.form-error');
              if (err) err.textContent = '';
            }
          }
        });
        // Email validation
        form.querySelectorAll('input[type="email"]').forEach(function (email) {
          var group = email.closest('.form-group');
          var val = email.value.trim();
          if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            valid = false;
            if (group) {
              group.classList.add('invalid');
              var err = group.querySelector('.form-error');
              if (err) err.textContent = 'Please enter a valid email.';
            }
          }
        });
        if (valid) {
          // Show success message (static site). Replace with real backend (e.g. Formspree) here.
          var success = form.parentElement.querySelector('.success-msg');
          if (success) success.classList.add('show');
          form.style.display = 'none';
        }
      });
    });
  }

  /* ---------- Booking step indicator ---------- */
  function initBookingSteps() {
    var steps = document.querySelectorAll('.step');
    var panels = document.querySelectorAll('.booking-panel');
    if (!steps.length) return;
    var current = 0;

    function go(n) {
      steps.forEach(function (s, i) {
        s.classList.remove('active', 'done');
        if (i < n) s.classList.add('done');
        if (i === n) s.classList.add('active');
      });
      panels.forEach(function (p, i) {
        p.style.display = i === n ? 'block' : 'none';
      });
      current = n;
    }

    document.querySelectorAll('[data-next]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var from = parseInt(btn.getAttribute('data-next'), 10);
        var panel = panels[from];
        var valid = true;
        panel.querySelectorAll('[required]').forEach(function (field) {
          var group = field.closest('.form-group');
          if (!field.value.trim()) {
            valid = false;
            if (group) {
              group.classList.add('invalid');
              var err = group.querySelector('.form-error');
              if (err) err.textContent = 'This field is required.';
            }
          } else if (group) {
            group.classList.remove('invalid');
            var clearErr = group.querySelector('.form-error');
            if (clearErr) clearErr.textContent = '';
          }
        });
        if (valid && from < panels.length - 1) go(from + 1);
      });
    });
    document.querySelectorAll('[data-prev]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var from = parseInt(btn.getAttribute('data-prev'), 10);
        if (from > 0) go(from - 1);
      });
    });
    go(0);
  }

  /* ---------- Counter animation ---------- */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    function animate(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var dur = 1500;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        el.textContent = Math.floor(p * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) { if (entry.isIntersecting) { animate(entry.target); obs.unobserve(entry.target); } });
    }, { threshold: .35 });
    counters.forEach(function (counter) { observer.observe(counter); });
  }

  /* ---------- Hero photo placeholder slider ---------- */
  function initHeroSlider() {
    var slider = document.querySelector('.hero-slider');
    if (!slider) return;
    var slides = slider.querySelectorAll('.hero-slide');
    var dots = slider.querySelectorAll('.hero-dots button');
    var current = 0, timer;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) { slide.classList.toggle('active', i === current); });
      dots.forEach(function (dot, i) { dot.classList.toggle('active', i === current); });
    }
    function play() { timer = setInterval(function () { show(current + 1); }, 3000); }
    function pause() { clearInterval(timer); }
    dots.forEach(function (dot, i) { dot.addEventListener('click', function () { show(i); pause(); play(); }); });
    slider.addEventListener('mouseenter', pause); slider.addEventListener('mouseleave', play);
    play();
  }

  /* ---------- Scroll reveal and sticky nav ---------- */
  function initReveal() {
    var targets = document.querySelectorAll('.reveal, .section-head, .stats-strip .stat, .testimonial-card, .team-card, .accordion-item, .gallery-item, .cta-banner');
    targets.forEach(function (el, i) { if (!el.classList.contains('reveal')) el.classList.add('reveal'); el.style.transitionDelay = (i % 8) * 80 + 'ms'; });
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); } });
    }, { threshold: .12 });
    targets.forEach(function (el) { observer.observe(el); });
  }
  function initStickyNav() {
    var nav = document.querySelector('.navbar'); if (!nav) return;
    window.addEventListener('scroll', function () { nav.classList.toggle('scrolled', window.scrollY > 50); }, { passive: true });
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    highlightActiveNav();
    initMobileMenu();
    setYear();
    initCarousel();
    initAccordion();
    initFaqTabs();
    initGallery();
    initDoctorModal();
    initForms();
    initBookingSteps();
    initCounters();
    initHeroSlider();
    initReveal();
    initStickyNav();
  });

})();

/* ---------- Home-services location form (Leaflet draggable pin) ---------- */
(function () {
  var form = document.getElementById('homeServiceForm');
  if (!form) return;
  var latInput = document.getElementById('patientLat'), lngInput = document.getElementById('patientLng');
  var mapEl = document.getElementById('patientMap');
  var success = document.getElementById('homeServiceSuccess');
  var dirLink = document.getElementById('dirLink');
  if (!latInput || !lngInput || !mapEl || !success || typeof L === 'undefined') return;

  // Clinic default: Banashankari 6th Stage, Bengaluru
  var CLINIC = { lat: 12.8926, lng: 77.5490 };
  var map = L.map(mapEl).setView([CLINIC.lat, CLINIC.lng], 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Clinic marker
  L.marker([CLINIC.lat, CLINIC.lng]).addTo(map).bindPopup('Miracle Advanced Physiotherapy Clinic');

  // Draggable patient pin
  var pin = L.marker([latInput.value || CLINIC.lat, lngInput.value || CLINIC.lng], { draggable: true })
    .addTo(map)
    .bindPopup('Your Home Location — drag me!');

  function pinPosition() {
    var pos = pin.getLatLng();
    latInput.value = pos.lat.toFixed(6);
    lngInput.value = pos.lng.toFixed(6);
  }

  function showPin(coords) {
    pin.setLatLng(coords);
    map.setView(coords, pinPosition() && map.getZoom() < 15 ? 15 : map.getZoom());
    pinPosition();
  }

  pin.on('dragend', pinPosition);

  // Click on map relocates the pin (so the patient can drop it precisely)
  map.on('click', function (e) {
    pin.setLatLng(e.latlng);
    pinPosition();
  });

  // Use current location
  document.getElementById('useLocation').addEventListener('click', function () {
    if (!navigator.geolocation) { alert('Geolocation is not supported by this browser.'); return; }
    navigator.geolocation.getCurrentPosition(function (position) {
      showPin([position.coords.latitude, position.coords.longitude]);
    }, function () {
      alert('We could not access your location. Drag the pin on the map to set it manually.');
    }, { enableHighAccuracy: true, timeout: 10000 });
  });

  // Submit: save to localStorage, show success + navigate link
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    pinPosition();
    if (!latInput.value || !lngInput.value) { alert('Please drop a pin on the map to mark your location.'); return; }

    var record = {
      name: form.querySelector('#patientName').value.trim(),
      date: form.querySelector('#visitDate').value,
      time: form.querySelector('#visitTime').value,
      issue: form.querySelector('#issue').value.trim(),
      lat: latInput.value,
      lng: lngInput.value
    };

    // Save to localStorage under mapHomeServiceRequests
    var saved = [];
    try { saved = JSON.parse(localStorage.getItem('mapHomeServiceRequests') || '[]'); } catch (e) { saved = []; }
    saved.push(record);
    localStorage.setItem('mapHomeServiceRequests', JSON.stringify(saved));

    // Google Maps directions to the pin
    dirLink.href = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(latInput.value + ',' + lngInput.value);
    dirLink.target = '_blank';

    form.style.display = 'none';
    success.classList.add('show');
  });

  // Initialize pin values
  pinPosition();
}());
