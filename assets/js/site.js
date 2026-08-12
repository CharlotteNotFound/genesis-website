(function () {
  const iconArrow = '<svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18"><path d="M4 10h11M11 6l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function headerMarkup() {
    return `
      <a class="skip-link" href="#main-content">Skip to content</a>
      <header class="site-header" data-header-shell>
        <div class="container header-inner">
          <a class="brand" href="/" aria-label="Genesis home">
            <img src="/assets/images/genesis-mark.png" alt="" width="42" height="42">
            <span><strong>GENESIS</strong><small>Ceilings &amp; Facades</small></span>
          </a>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">
            <span class="sr-only">Open navigation</span><span></span><span></span>
          </button>
          <nav class="primary-nav" id="primary-nav" aria-label="Primary navigation">
            <a href="/" data-nav="home">Home</a>
            <a href="/products/" data-nav="products">Products</a>
            <a href="/projects/" data-nav="projects">Projects</a>
            <a href="/about/" data-nav="about">About</a>
            <a href="/contact/" data-nav="contact">Contact</a>
          </nav>
          <a class="header-cta" href="/contact/?inquiry=project">Start a project ${iconArrow}</a>
        </div>
      </header>`;
  }

  function footerMarkup() {
    return `
      <footer class="site-footer">
        <div class="container footer-grid">
          <div class="footer-brand">
            <a class="brand brand--light" href="/">
              <img src="/assets/images/genesis-mark.png" alt="" width="50" height="50">
              <span><strong>GENESIS</strong><small>Ceilings &amp; Facades</small></span>
            </a>
            <p>Aluminum ceiling and facade systems engineered for architectural clarity, reliable installation, and lasting material performance.</p>
          </div>
          <div>
            <p class="footer-label">Navigate</p>
            <a href="/products/">Products</a><a href="/projects/">Projects</a><a href="/about/">About Genesis</a><a href="/contact/">Contact</a>
          </div>
          <div>
            <p class="footer-label">Product families</p>
            <a href="/products/?family=Ceiling%20Systems">Ceiling systems</a><a href="/products/?family=Facade%20Systems">Facade systems</a><a href="/products/?category=Composite%20Panels">Composite panels</a>
          </div>
          <div>
            <p class="footer-label">Contact</p>
            <span class="footer-contact-line">+86 150 7783 3565</span><span class="footer-contact-line">leo@leacharm.com</span><p>Hehai West Road, Xinbei District<br>Changzhou, China</p><a class="footer-request-link" href="/contact/">Send a request ${iconArrow}</a>
          </div>
        </div>
        <div class="container footer-bottom"><span>© <span data-year></span> Genesis Technology Co.</span><span>Building easier, worldwide.</span></div>
      </footer>`;
  }

  document.querySelectorAll("[data-site-header]").forEach((node) => { node.innerHTML = headerMarkup(); });
  document.querySelectorAll("[data-site-footer]").forEach((node) => { node.innerHTML = footerMarkup(); });
  document.querySelectorAll("[data-year]").forEach((node) => { node.textContent = new Date().getFullYear(); });

  const page = document.body.dataset.page;
  const active = page === "product" ? "products" : page;
  const activeLink = document.querySelector(`[data-nav="${active}"]`);
  if (activeLink) activeLink.setAttribute("aria-current", "page");

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      const label = toggle.querySelector(".sr-only");
      if (label) label.textContent = expanded ? "Open navigation" : "Close navigation";
      nav.classList.toggle("is-open", !expanded);
      document.body.classList.toggle("nav-open", !expanded);
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      const label = toggle.querySelector(".sr-only");
      if (label) label.textContent = "Open navigation";
      nav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    }));
  }

  const header = document.querySelector("[data-header-shell]");
  if (header) {
    const setHeaderState = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
    setHeaderState();
    window.addEventListener("scroll", setHeaderState, { passive: true });
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
  } else {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
  }
})();
