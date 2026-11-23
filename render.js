/* ============================================================
   render.js  -  يحوّل بيانات المدير إلى نفس HTML/التنسيق الموجود أصلاً
   صفحة الزائر لا تحتوي على أي أزرار تحرير أو كود كتابة.
   ============================================================ */

export function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const RICH_CLASSES = {
  orange: "text-orange",
  highlight: "hero-name-highlight",
  "title-accent": "title-accent",
  "accent-text": "accent-text",
  "ah-t": "ah-t",
  "ah-g": "ah-g",
  "ah-p": "ah-p",
  "footer-name": "footer-name",
  gradient: "" // سبان عادي: تنسيق التدرج يأتي من CSS الحالي (h2 span)
};

/* يسمح للمدير بكتابة نصوص ملوّنة بصيغة [[orange:كلمة]] بدون HTML */
export function rich(value) {
  let out = escapeHtml(value);
  out = out.replace(/\[\[([\w-]+):([\s\S]*?)\]\]/g, (full, key, inner) => {
    if (!(key in RICH_CLASSES)) return inner;
    const cls = RICH_CLASSES[key];
    return cls ? '<span class="' + cls + '">' + inner + "</span>" : "<span>" + inner + "</span>";
  });
  return out;
}

function safeUrl(value) {
  const v = String(value == null ? "" : value).trim();
  return v || "#";
}

function cssUrl(value) {
  return String(value == null ? "" : value).replace(/['"\\]/g, "");
}

function setText(root, selector, value) {
  const el = root.querySelector(selector);
  if (el) el.textContent = value == null ? "" : String(value);
}

function setHtml(root, selector, html) {
  const el = root.querySelector(selector);
  if (el) el.innerHTML = html;
}

const NAV_ICONS = [
  "fas fa-home", "fas fa-user", "fas fa-cogs", "fas fa-briefcase", "fas fa-envelope"
];

export function applyData(data, root = document) {
  if (!data) return;
  const d = data;

  if (root === document) document.title = d.pageTitle || "Portfolio";

  /* ===== الشريط والقائمة الجانبية ===== */
  setText(root, ".nav-brand .logo-icon", d.brand && d.brand.initials);
  setText(root, ".nav-brand span", d.brand && d.brand.name);
  setText(root, ".quick-sidebar-logo", d.brand && d.brand.initials);
  setText(root, ".quick-sidebar-header > span:not(.quick-sidebar-logo)", d.brand && d.brand.quickTitle);

  const navKeys = ["home", "about", "services", "portfolio", "contact"];
  const navValues = navKeys.map((k) => (d.nav && d.nav[k]) || "");
  root.querySelectorAll(".nav-links a").forEach((a, i) => {
    if (navValues[i] !== undefined) a.textContent = navValues[i];
  });
  root.querySelectorAll(".quick-sidebar-links a").forEach((a, i) => {
    if (navValues[i] === undefined) return;
    a.innerHTML = '<i class="' + NAV_ICONS[i] + '"></i> ' + escapeHtml(navValues[i]);
  });

  /* ===== الرئيسية ===== */
  const h = d.hero || {};
  setHtml(root, "#hero .hero-main-title", rich(h.title));
  setHtml(root, "#hero .hero-desc", rich(h.desc));
  setHtml(root, "#hero .hero-sub-title", rich(h.subTitle));
  setText(root, "#hero .hero-intro", h.intro);
  setText(root, "#hero .hero-spec", h.spec);

  const boxClasses = ["box-blue", "box-yellow", "box-teal", "box-orange", "box-white"];
  setHtml(root, "#hero .hero-boxes", (h.boxes || []).map((box, i) =>
    '<span class="spec-box ' + boxClasses[i % boxClasses.length] + '">' + escapeHtml(box) + "</span>"
  ).join(""));

  const heroButtons = root.querySelectorAll("#hero .hero-buttons a");
  if (heroButtons[0]) heroButtons[0].innerHTML = '<i class="fas fa-paper-plane"></i> ' + escapeHtml(h.btnContact);
  if (heroButtons[1]) heroButtons[1].innerHTML = '<i class="fas fa-info-circle"></i> ' + escapeHtml(h.btnAbout);

  const heroImg = root.querySelector("#hero .image-wrapper img");
  if (heroImg) {
    heroImg.setAttribute("src", h.image || "MAHMOUD.jpg");
    heroImg.setAttribute("alt", h.imageAlt || "");
  }

  /* ===== من أنا ===== */
  const a = d.about || {};
  setHtml(root, "#about .section-header h2", rich(a.sectionTitle));
  setHtml(root, "#about .section-header p", rich(a.sectionLead));
  setHtml(root, "#about .hero-title", rich(a.title));
  const aboutParas = root.querySelectorAll("#about .about-text > p.hero-sub");
  if (aboutParas[0]) aboutParas[0].innerHTML = rich(a.p1);
  if (aboutParas[1]) aboutParas[1].innerHTML = rich(a.p2);

  const aboutImg = root.querySelector(".about-img-wrapper img");
  if (aboutImg) {
    aboutImg.setAttribute("src", a.image || "2525.jpeg");
    aboutImg.setAttribute("alt", a.imageAlt || "");
  }
  setText(root, ".experience-badge .num", a.badgeNum);
  setText(root, ".experience-badge .label", a.badgeLabel);

  setHtml(root, ".about-stats", (a.stats || []).map((s) =>
    '<div class="stat-card"><div class="stat-num">' + escapeHtml(s.num) +
    '</div><div class="stat-label">' + escapeHtml(s.label) + "</div></div>"
  ).join(""));

  /* ===== الخدمات ===== */
  const s = d.services || {};
  setHtml(root, "#services .section-header h2", rich(s.title));
  setText(root, "#services .section-header p", s.lead);
  const serviceDelays = [1, 2, 3, 4, 5, 5, 1, 2, 3, 4, 5];
  setHtml(root, ".services-grid", (s.items || []).map((item, i) =>
    '<div class="service-card reveal reveal-delay-' + (serviceDelays[i % serviceDelays.length]) + '">' +
      '<div class="icon-box"><i class="' + escapeHtml(item.icon) + '"></i></div>' +
      "<h3>" + escapeHtml(item.title) + "</h3>" +
      "<p>" + escapeHtml(item.desc) + "</p>" +
    "</div>"
  ).join(""));

  /* ===== معرض الأعمال ===== */
  const p = d.portfolio || {};
  setHtml(root, "#portfolio .section-header h2", rich(p.title));
  setText(root, "#portfolio .section-header p", p.lead);
  setHtml(root, ".portfolio-grid", (p.items || []).map((item, i) => {
    const image = item.image || "";
    const thumbStyle = image ? ' style="background-image:url(\'' + cssUrl(image) + '\')"' : "";
    const href = safeUrl(item.driveLink);
    return '<a href="' + escapeHtml(href) + '" target="_blank" rel="noopener noreferrer" ' +
      'class="portfolio-item reveal reveal-delay-' + ((i % 5) + 1) + '">' +
      '<div class="portfolio-thumb' + (image ? " has-image" : "") + '"' + thumbStyle + "></div>" +
      '<div class="portfolio-overlay">' +
        "<h4>" + escapeHtml(item.title) + "</h4>" +
        "<p>" + escapeHtml(item.desc) + "</p>" +
        '<span class="portfolio-btn"><i class="fas fa-eye"></i> ' + escapeHtml(p.cta) + "</span>" +
      "</div></a>";
  }).join(""));

  /* ===== التواصل ===== */
  const c = d.contact || {};
  setHtml(root, "#contact .section-header h2", rich(c.title));
  const contactLeads = root.querySelectorAll("#contact .section-header p");
  if (contactLeads[0]) contactLeads[0].textContent = c.lead1 || "";
  if (contactLeads[1]) contactLeads[1].textContent = c.lead2 || "";

  setHtml(root, ".contact-info", (c.items || []).map((item, i) => {
    const value = item.href
      ? '<a href="' + escapeHtml(item.href) + '" target="_blank" rel="noopener noreferrer" ' +
        'style="color:var(--primary);text-decoration:none;">' + escapeHtml(item.value) + "</a>"
      : escapeHtml(item.value);
    return '<div class="contact-item">' +
      '<div class="contact-icon"><i class="' + escapeHtml(item.icon) + '"></i></div>' +
      '<div class="contact-detail"><h4>' + escapeHtml(item.label) + "</h4><p>" + value + "</p></div>" +
      "</div>";
  }).join(""));

  const form = root.querySelector("#contactForm");
  if (form && c.formAction) form.setAttribute("action", c.formAction);

  /* ===== التذييل ===== */
  setHtml(root, "footer p", rich(d.footer && d.footer.text));
  const socialIcons = ["fab fa-facebook-f", "fab fa-instagram", "fab fa-linkedin-in", "fab fa-whatsapp"];
  const socials = socialIcons.map((icon) => (c.items || []).find((it) => it.icon === icon && it.href)).filter(Boolean);
  setHtml(root, "footer .social-links", socials.map((it) =>
    '<a href="' + escapeHtml(it.href) + '" aria-label="' + escapeHtml(it.label) +
    '" target="_blank" rel="noopener noreferrer"><i class="' + escapeHtml(it.icon) + '"></i></a>'
  ).join(""));
}

/* نربط بطاقات الخدمات بعد إعادة بنائها (نفس سلوك الصفحة الأصلية) */
export function bindServiceCards(root = document) {
  const items = root.querySelectorAll(".portfolio-item");
  root.querySelectorAll(".service-card").forEach((card, i) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      const target = items[i];
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.style.outline = "3px solid var(--primary)";
      target.style.outlineOffset = "4px";
      setTimeout(() => { target.style.outline = "none"; }, 2000);
    });
  });
}
