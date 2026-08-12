(function () {
  const products = window.GENESIS_PRODUCTS || [];
  const projects = window.GENESIS_PROJECTS || [];
  const arrow = '<svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18"><path d="M4 10h11M11 6l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function productCard(product) {
    return `<article class="product-card reveal" data-family="${product.family}" data-category="${product.category}" data-name="${product.name.toLowerCase()}">
      <a class="product-card__image" href="/products/${product.slug}/" aria-label="View ${product.name}">
        <img src="/assets/images/products/${product.slug}.webp" alt="${product.name} product and installed application" width="600" height="380" loading="lazy">
        <span>${product.id}</span>
      </a>
      <div class="product-card__body">
        <p class="eyebrow">${product.category}</p>
        <h3><a href="/products/${product.slug}/">${product.name}</a></h3>
        <p>${product.summary}</p>
        <a class="text-link" href="/products/${product.slug}/">Technical details ${arrow}</a>
      </div>
    </article>`;
  }

  function activateReveals(scope) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      scope.querySelectorAll(".reveal").forEach((node) => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    scope.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
  }

  const grid = document.querySelector("[data-product-grid]");
  if (grid) {
    const search = document.querySelector("[data-product-search]");
    const filters = [...document.querySelectorAll("[data-filter]")];
    const count = document.querySelector("[data-product-count]");
    const params = new URLSearchParams(window.location.search);
    let selected = params.get("family") || params.get("category") || "All";
    const matchingFilter = filters.find((button) => button.dataset.filter === selected);
    if (!matchingFilter) selected = "All";

    function render() {
      const query = (search?.value || "").trim().toLowerCase();
      const matches = products.filter((product) => {
        const filterMatch = selected === "All" || product.family === selected || product.category === selected;
        const searchMatch = !query || `${product.name} ${product.category} ${product.summary}`.toLowerCase().includes(query);
        return filterMatch && searchMatch;
      });
      grid.innerHTML = matches.map(productCard).join("");
      if (count) count.textContent = `${matches.length} product${matches.length === 1 ? "" : "s"}`;
      filters.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.filter === selected)));
      activateReveals(grid);
    }
    filters.forEach((button) => button.addEventListener("click", () => { selected = button.dataset.filter; render(); }));
    search?.addEventListener("input", render);
    render();
  }

  const featured = document.querySelector("[data-featured-products]");
  if (featured) {
    const slugs = ["clip-in-ceiling", "u-shaped-baffle-ceiling", "open-cell-ceiling", "perforated-aluminum-panel", "single-curved-aluminum-panel", "aluminum-honeycomb-panel"];
    featured.innerHTML = slugs.map((slug) => productCard(products.find((product) => product.slug === slug))).join("");
    activateReveals(featured);
  }

  const projectGrid = document.querySelector("[data-project-grid]");
  if (projectGrid) {
    const limit = Number(projectGrid.dataset.limit || projects.length);
    const caseStudies = projectGrid.dataset.projectLayout === "case-studies";
    projectGrid.innerHTML = projects.slice(0, limit).map((project, index) => caseStudies ? `<article class="project-case reveal">
      <div class="project-case__layout">
        <div class="project-case__primary">
          <div class="project-case__story"><p class="eyebrow">Featured ${String(index + 1).padStart(2, "0")} · ${project.type}</p><h2>${project.title}</h2></div>
          <figure class="project-case__image"><img src="${project.image}" srcset="${project.imageSmall} 840w, ${project.image} 1400w" sizes="(max-width: 760px) calc(100vw - 40px), 68vw" alt="${project.alt}" width="1400" height="1050" loading="lazy"></figure>
        </div>
        <div class="project-case__secondary">
          <aside class="project-case__fact-card"><p class="eyebrow">Project facts</p><dl aria-label="${project.title} project facts">${project.facts.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}</dl></aside>
          <div class="project-case__description"><p class="eyebrow">Project description</p><p>${project.description}</p><p>${project.productNote}</p></div>
        </div>
      </div>
    </article>` : `<article class="project-preview reveal">
      <figure class="project-preview__image"><img src="${project.imageSmall}" srcset="${project.imageSmall} 840w, ${project.image} 1400w" sizes="(max-width: 760px) calc(100vw - 40px), 31vw" alt="${project.alt}" width="840" height="630" loading="lazy"></figure>
      <div class="project-preview__copy"><p class="eyebrow">${String(index + 1).padStart(2, "0")} · ${project.type}</p><h3>${project.title}</h3></div>
    </article>`).join("");
    activateReveals(projectGrid);
  }

  const detail = document.querySelector("[data-product-detail]");
  if (detail) {
    const slug = document.body.dataset.product || window.location.pathname.split("/").filter(Boolean).pop();
    const product = products.find((item) => item.slug === slug);
    if (!product) {
      detail.innerHTML = '<section class="not-found container"><p class="eyebrow">Product not found</p><h1>This product page is unavailable.</h1><a class="button button--primary" href="/products/">Return to products</a></section>';
    } else {
      document.title = `${product.name} | Genesis Ceilings & Facades`;
      const productNumber = Number(product.id);
      const portraitProductCrop = productNumber >= 17 && productNumber <= 29;
      const productCropWidth = 1733;
      const productCropHeight = portraitProductCrop ? 1253 : 720;
      const related = products.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 3);
      const relatedFallback = related.length >= 3 ? related : [...related, ...products.filter((item) => item.family === product.family && item.slug !== product.slug && !related.includes(item)).slice(0, 3 - related.length)];
      detail.innerHTML = `
        <section class="product-hero">
          <div class="container">
            <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/products/">Products</a><span>/</span><span aria-current="page">${product.name}</span></nav>
            <div class="product-hero__grid">
              <div class="product-hero__copy reveal"><p class="eyebrow">Catalog ${product.id} · ${product.category}</p><h1>${product.name}</h1><p class="lede">${product.summary}</p>
                <div class="button-row"><a class="button button--primary" href="/contact/?inquiry=product-data&amp;product=${encodeURIComponent(product.name)}">Request product data ${arrow}</a><a class="button button--secondary" href="/projects/">View applications</a></div>
              </div>
              <figure class="product-hero__media reveal">
                <img src="/assets/images/product-details/${product.slug}.webp" srcset="/assets/images/product-details/${product.slug}-960.webp 960w, /assets/images/product-details/${product.slug}.webp 1733w" sizes="(max-width: 1050px) calc(100vw - 40px), 58vw" alt="${product.name} product and installed application from the Genesis catalog" width="${productCropWidth}" height="${productCropHeight}" fetchpriority="high">
                <figcaption><span>Product and application reference · Series ${product.id}</span></figcaption>
              </figure>
            </div>
          </div>
        </section>
        <section class="section product-overview"><div class="container product-overview__grid">
          <div class="section-heading reveal"><p class="eyebrow">System overview</p><h2>Designed as a complete architectural system.</h2><p>Dimensions and finishes below reproduce the available catalog information. Final fabrication, tolerances, substructure, and finish selection should be confirmed against the project specification.</p></div>
          <div class="benefit-list reveal">${product.benefits.map((item, index) => `<div><span>${String(index + 1).padStart(2, "0")}</span><p>${item}</p></div>`).join("")}</div>
        </div></section>
        <section class="section section--muted"><div class="container technical-grid">
          <div class="reveal"><p class="eyebrow">Catalog dimensions</p><h2>Technical range</h2><div class="table-wrap"><table><thead><tr>${product.specColumns.map((item) => `<th scope="col">${item}</th>`).join("")}</tr></thead><tbody>${product.specRows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div>
          <div class="spec-aside reveal"><div><p class="eyebrow">Surface options</p><ul class="check-list">${product.finishes.map((item) => `<li>${item}</li>`).join("")}</ul></div><div><p class="eyebrow">Typical applications</p><ul class="tag-list">${product.applications.map((item) => `<li>${item}</li>`).join("")}</ul></div></div>
        </div></section>
        ${product.technical ? `<section class="section"><div class="container installation-grid"><div class="section-heading reveal"><p class="eyebrow">Installation logic</p><h2>Coordinated carrier and suspension.</h2><p>The catalog installation diagram shows the relationship between the visible metal elements, carrier profiles, clips, suspension rods, and primary support grid.</p><p class="microcopy">Diagrams are indicative. Project-specific engineering and coordination remain required.</p></div><figure class="technical-figure reveal"><img src="/assets/images/technical-details/${product.slug}.webp" srcset="/assets/images/technical-details/${product.slug}-960.webp 960w, /assets/images/technical-details/${product.slug}.webp 1733w" sizes="(max-width: 1050px) calc(100vw - 40px), 64vw" alt="${product.name} catalog dimensions and complete installation diagram" width="1733" height="1840" loading="lazy"><figcaption>Catalog dimensions and installation reference · Series ${product.id}</figcaption></figure></div></section>` : ""}
        <section class="section related-section"><div class="container"><div class="section-heading section-heading--row"><div><p class="eyebrow">Continue exploring</p><h2>Related systems</h2></div><a class="text-link" href="/products/">All products ${arrow}</a></div><div class="product-grid product-grid--three">${relatedFallback.map(productCard).join("")}</div></div></section>
        <section class="cta-band"><div class="container cta-band__inner"><div><p class="eyebrow">Specify Genesis</p><h2>Need samples, shop drawings, or a custom module?</h2></div><a class="button button--light" href="/contact/?inquiry=technical-support&amp;product=${encodeURIComponent(product.name)}">Talk to our team ${arrow}</a></div></section>`;
      activateReveals(detail);
    }
  }
})();
