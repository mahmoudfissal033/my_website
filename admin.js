/* ============================================================
   admin.js  -  لوحة المدير
   تسجيل دخول + تعديل كل النصوص والصور + بطاقات المعرض مع معاينة
   ورابط جوجل درايف لكل بطاقة. الحفظ يذهب لـ Supabase فورًا.
   ============================================================ */

import {
  initStore, isSupabaseConfigured, subscribe, saveData, uploadImage,
  onAuthChanged, signIn, signOut, currentUid, adminUid, currentEmail, updateAccount
} from "./store.js";
import { escapeHtml, rich } from "./render.js";

const DEFAULT_DATA = window.DEFAULT_DATA;
const SCHEMA = window.SITE_SCHEMA;

const $ = (id) => document.getElementById(id);
const clone = (obj) => JSON.parse(JSON.stringify(obj));

let working = clone(DEFAULT_DATA);
let canEdit = false;
let currentGroup = SCHEMA[0].id;
let lastLocalEdit = 0;
let saveTimer = null;
let remoteSeen = false;
let remoteEmpty = false;
let initializedRemote = false;

/* ===== أدوات مساعدة ===== */
function getPath(obj, path) {
  return String(path).split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function setPath(obj, path, value) {
  const keys = String(path).split(".");
  const last = keys.pop();
  let node = obj;
  keys.forEach((k) => {
    if (!node[k] || typeof node[k] !== "object") node[k] = {};
    node = node[k];
  });
  node[last] = value;
}

function mergeDefaults(base, extra) {
  if (!extra || typeof extra !== "object") return base;
  const out = Array.isArray(base) ? base.slice() : Object.assign({}, base);
  Object.keys(extra).forEach((key) => {
    const b = out[key];
    const e = extra[key];
    if (e && typeof e === "object" && !Array.isArray(e) && b && typeof b === "object" && !Array.isArray(b)) {
      out[key] = mergeDefaults(b, e);
    } else {
      out[key] = e;
    }
  });
  return out;
}

function cssSafe(value) {
  return String(value || "").replace(/['"\\]/g, "");
}

function uiText(key) {
  const ui = (working && working.adminUi) || {};
  return ui[key] != null ? ui[key] : (DEFAULT_DATA.adminUi[key] || "");
}

/* تطبيق نصوص لوحة المدير على كل عنصر معلم بـ data-admin-text */
function applyAdminTexts(data) {
  const ui = (data && data.adminUi) || {};
  document.querySelectorAll("[data-admin-text]").forEach((node) => {
    const key = node.dataset.adminText;
    const value = ui[key] != null ? ui[key] : (DEFAULT_DATA.adminUi[key] || "");
    if (node.dataset.adminRich !== undefined) node.innerHTML = rich(value);
    else if (node.dataset.adminMultiline !== undefined) node.innerHTML = escapeHtml(value).replace(/\n/g, "<br>");
    else node.textContent = value;
  });
}

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html != null) node.innerHTML = html;
  return node;
}

function button(label, className, onClick) {
  const b = el("button", className || "admin-btn small", '<i class="fas fa-trash"></i>');
  b.type = "button";
  b.innerHTML = label;
  b.addEventListener("click", onClick);
  return b;
}

function iconButton(icon, title, onClick, danger) {
  const b = el("button", "admin-btn small" + (danger ? " danger" : ""), '<i class="' + icon + '"></i>');
  b.type = "button";
  b.title = title;
  b.addEventListener("click", onClick);
  return b;
}

function setStatus(text, state) {
  const s = $("adminStatus");
  s.textContent = text;
  s.className = "admin-status" + (state ? " " + state : "");
}

function markLocalEdit() {
  lastLocalEdit = Date.now();
  scheduleSave();
}

function scheduleSave() {
  if (!canEdit) return;
  setStatus("جاري الحفظ...", "saving");
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => flushSave(), 700);
}

async function flushSave() {
  if (!canEdit) return;
  clearTimeout(saveTimer);
  try {
    await saveData(working);
    setStatus("تم الحفظ ✓", "saved");
  } catch (err) {
    console.error(err);
    setStatus("فشل الحفظ - راجع الإعدادات", "error");
  }
}

/* ===== ضغط الصور قبل تخزينها ===== */
function compressImage(file, maxSize = 1400, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        const scale = Math.min(1, maxSize / Math.max(w, h));
        w = Math.max(1, Math.round(w * scale));
        h = Math.max(1, Math.round(h * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (file.type !== "image/png") {
          ctx.fillStyle = "#0a0a1a";
          ctx.fillRect(0, 0, w, h);
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL(file.type === "image/png" ? "image/png" : "image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/* ===== بناء الحقول ===== */
function buildControl(path, field, opts = {}) {
  if (field.type === "image") return buildImageControl(path, field, opts);

  const value = getPath(working, path) == null ? "" : getPath(working, path);

  if (field.type === "textarea" || field.type === "rich") {
    const ta = el("textarea", "admin-input");
    ta.value = value;
    ta.rows = field.type === "rich" ? 3 : 4;
    ta.addEventListener("input", () => {
      setPath(working, path, ta.value);
      markLocalEdit();
      if (opts.onAny) opts.onAny();
      if (String(path).startsWith("adminUi.")) applyAdminTexts(working);
    });
    return ta;
  }

  const input = el("input", "admin-input");
  input.type = field.type === "url" ? "url" : "text";
  input.value = value;
  input.placeholder = field.placeholder || "";
  if (field.type === "url") input.dir = "ltr";
  input.addEventListener("input", () => {
    setPath(working, path, input.value);
    markLocalEdit();
    if (opts.onAny) opts.onAny();
    if (String(path).startsWith("adminUi.")) applyAdminTexts(working);
  });
  return input;
}

function buildImageControl(path, field, opts = {}) {
  const wrap = el("div", "admin-image");
  const preview = el("div", "admin-image-preview");
  const controls = el("div", "admin-image-controls");

  const fileLabel = el("label", "admin-file-label", '<i class="fas fa-upload"></i> رفع من جهازك');
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileLabel.appendChild(fileInput);

  const urlInput = el("input", "admin-input");
  urlInput.type = "url";
  urlInput.dir = "ltr";
  urlInput.placeholder = "أو الصق رابط صورة https://...";

  const clearBtn = button('<i class="fas fa-eraser"></i> مسح', "admin-btn small danger", () => {
    setPath(working, path, "");
    urlInput.value = "";
    fileInput.value = "";
    refresh();
    markLocalEdit();
    if (opts.onAny) opts.onAny();
  });

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    setStatus("جاري رفع الصورة...", "saving");
    try {
      // ضغط الصورة محليًا ثم رفعها إلى Supabase Storage (أو data URL في الوضع المحلي)
      const compressedDataUrl = await compressImage(file);
      const blob = await (await fetch(compressedDataUrl)).blob();
      const ext = file.type === "image/png" ? "png" : "jpg";
      const uploadFile = new File([blob], `image.${ext}`, { type: blob.type || file.type });
      const imageUrl = await uploadImage(uploadFile);
      setPath(working, path, imageUrl);
      urlInput.value = "";
      refresh();
      markLocalEdit();
      if (opts.onAny) opts.onAny();
    } catch (err) {
      console.error(err);
      setStatus("تعذّر رفع الصورة - تأكد من إعداد Supabase Storage", "error");
    }
  });

  urlInput.addEventListener("input", () => {
    setPath(working, path, urlInput.value.trim());
    refresh();
    markLocalEdit();
    if (opts.onAny) opts.onAny();
  });

  function refresh() {
    const value = getPath(working, path) || "";
    if (value) {
      preview.style.backgroundImage = 'url("' + cssSafe(value) + '")';
      preview.innerHTML = "";
      if (!value.startsWith("data:") && document.activeElement !== urlInput) urlInput.value = value;
    } else {
      preview.style.backgroundImage = "";
      preview.innerHTML = '<i class="fas fa-image"></i>&nbsp; لا توجد صورة';
    }
  }

  controls.append(fileLabel, urlInput, clearBtn);
  wrap.append(preview, controls);
  refresh();
  return wrap;
}

function buildSimpleList(field) {
  const list = () => getPath(working, field.path) || [];
  const box = el("div", "admin-list");

  function redraw() {
    box.innerHTML = "";
    list().forEach((value, i) => {
      const row = el("div", "admin-list-row");
      const input = el("input", "admin-input");
      input.value = value;
      input.addEventListener("input", () => {
        list()[i] = input.value;
        markLocalEdit();
      });
      row.append(input, iconButton("fas fa-trash", "حذف", () => {
        list().splice(i, 1);
        markLocalEdit();
        redraw();
      }, true));
      box.appendChild(row);
    });
    const add = button('<i class="fas fa-plus"></i> إضافة ' + field.itemLabel, "admin-add", () => {
      list().push(field.defaultItem || "جديد");
      markLocalEdit();
      redraw();
    });
    box.appendChild(add);
  }

  redraw();
  return box;
}

function buildObjectList(field, isPortfolio) {
  const list = () => getPath(working, field.path) || [];
  const box = el("div", "admin-list");

  function move(i, dir) {
    const arr = list();
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
    markLocalEdit();
    redraw();
  }

  function remove(i) {
    if (!window.confirm("هل تريد حذف هذا العنصر؟")) return;
    list().splice(i, 1);
    markLocalEdit();
    redraw();
  }

  function addItem() {
    const item = {};
    (field.itemFields || []).forEach((sf) => { item[sf.path] = ""; });
    list().push(item);
    markLocalEdit();
    redraw();
  }

  function redraw() {
    box.innerHTML = "";
    list().forEach((item, i) => {
      const card = el("div", "admin-item-card");
      const head = el("div", "admin-item-head");
      const titleNode = el("strong", "", "");
      head.appendChild(titleNode);

      const actions = el("div", "admin-item-actions");
      actions.append(
        iconButton("fas fa-arrow-up", "تحريك للأعلى", () => move(i, -1)),
        iconButton("fas fa-arrow-down", "تحريك للأسفل", () => move(i, 1)),
        iconButton("fas fa-trash", "حذف", () => remove(i), true)
      );
      head.appendChild(actions);

      const body = el("div", "admin-item-body");
      let miniThumb = null;
      let miniBody = null;

      if (isPortfolio) {
        const mini = el("div", "admin-mini");
        miniThumb = el("div", "admin-mini-thumb", '<i class="fas fa-image"></i>');
        miniBody = el("div", "admin-mini-body");
        mini.append(miniThumb, miniBody);
        body.appendChild(mini);
      }

      function refreshHead() {
        const label = item.title || item.label || item.num || "بدون عنوان";
        titleNode.textContent = "#" + (i + 1) + " — " + label;
      }

      function refreshMini() {
        if (!isPortfolio || !miniThumb || !miniBody) return;
        const image = item.image || "";
        if (image) {
          miniThumb.style.backgroundImage = 'url("' + cssSafe(image) + '")';
          miniThumb.innerHTML = "";
        } else {
          miniThumb.style.backgroundImage = "";
          miniThumb.innerHTML = '<i class="fas fa-image"></i>';
        }
        const link = item.driveLink
          ? '<a class="admin-mini-link" href="' + escapeHtml(item.driveLink) + '" target="_blank" rel="noopener noreferrer"><i class="fab fa-google-drive"></i> فتح جوجل درايف</a>'
          : '<span class="admin-mini-link disabled"><i class="fas fa-link-slash"></i> لا يوجد رابط درايف</span>';
        miniBody.innerHTML = "<b>" + escapeHtml(item.title || "بدون عنوان") + "</b>" +
          "<small>" + escapeHtml(item.desc || "") + "</small>" + link;
      }

      (field.itemFields || []).forEach((sf) => {
        const wrapper = el("div", "admin-field" + (sf.type === "textarea" || sf.type === "image" ? " wide" : ""));
        const label = el("label", "admin-label");
        label.textContent = sf.label;
        wrapper.appendChild(label);
        wrapper.appendChild(buildControl(field.path + "." + i + "." + sf.path, sf, {
          onAny: () => { refreshHead(); refreshMini(); }
        }));
        if (sf.note) wrapper.appendChild(el("p", "admin-hint", escapeHtml(sf.note)));
        body.appendChild(wrapper);
      });

      refreshHead();
      refreshMini();
      card.append(head, body);
      box.appendChild(card);
    });

    box.appendChild(button('<i class="fas fa-plus"></i> إضافة ' + field.itemLabel, "admin-add", addItem));
  }

  redraw();
  return box;
}

function buildField(field) {
  const wrapper = el("div", "admin-field");
  const label = el("label", "admin-label");
  label.textContent = field.label;
  wrapper.appendChild(label);

  if (field.type === "simpleList") {
    wrapper.appendChild(buildSimpleList(field));
  } else if (field.type === "objectList") {
    wrapper.appendChild(buildObjectList(field, false));
  } else if (field.type === "portfolioList") {
    wrapper.appendChild(buildObjectList(field, true));
    wrapper.appendChild(el("p", "admin-hint", "كل بطاقة لها صورة معاينة ورابط جوجل درايف؛ الضغط على البطاقة في صفحة الزائر يفتح الرابط مباشرة."));
  } else {
    wrapper.appendChild(buildControl(field.path, field));
    if (field.type === "rich") {
      wrapper.appendChild(el("p", "admin-hint", "لتلوين جزء من النص اكتب: [[orange:الكلمة]] أو [[ah-t:الكلمة]] أو [[highlight:الكلمة]]."));
    }
    if (field.note) wrapper.appendChild(el("p", "admin-hint", escapeHtml(field.note)));
  }
  return wrapper;
}

/* نموذج إعدادات الحساب: بريد + كلمة مرور جديدة + تأكيد */
function buildPasswordForm() {
  const box = el("div", "admin-password-box");
  box.appendChild(el("h3", "", escapeHtml(uiText("passwordBoxTitle"))));
  box.appendChild(el("p", "admin-hint", escapeHtml(uiText("passwordBoxHint"))));

  const form = document.createElement("form");
  const makeField = (id, label, type, extraClass) => {
    const wrap = el("div", "admin-field" + (extraClass ? " " + extraClass : ""));
    const lab = el("label", "admin-label");
    lab.textContent = label;
    lab.htmlFor = id;
    const input = el("input", "admin-input" + (id === "adminEmailField" ? " admin-email-input" : ""));
    input.type = type;
    input.id = id;
    input.autocomplete = "off";
    if (type === "email") {
      input.dir = "ltr";
      input.value = currentEmail();
    }
    wrap.append(lab, input);
    form.appendChild(wrap);
    return input;
  };

  makeField("adminEmailField", uiText("emailLabel"), "email", "wide-email");
  makeField("newPass", uiText("newPasswordLabel"), "password");
  makeField("confPass", uiText("confirmPasswordLabel"), "password");

  const submit = el("button", "admin-btn primary", '<i class="fas fa-save"></i> ' + escapeHtml(uiText("changePasswordButton")));
  submit.type = "submit";
  form.appendChild(submit);

  const msg = el("div", "admin-password-msg");
  form.appendChild(msg);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "";
    msg.className = "admin-password-msg";
    const email = form.querySelector("#adminEmailField").value.trim();
    const next = form.querySelector("#newPass").value;
    const confirm = form.querySelector("#confPass").value;
    const wantsPassword = !!(next || confirm);

    if (wantsPassword && next !== confirm) {
      msg.textContent = uiText("passwordMismatch");
      msg.className = "admin-password-msg error";
      return;
    }
    if (wantsPassword && next.length < 6) {
      msg.textContent = uiText("passwordShort");
      msg.className = "admin-password-msg error";
      return;
    }
    if (!email) {
      msg.textContent = uiText("emailRequired");
      msg.className = "admin-password-msg error";
      return;
    }
    if (!isSupabaseConfigured) {
      msg.textContent = uiText("localModePassword");
      msg.className = "admin-password-msg error";
      return;
    }
    if (!wantsPassword && email === currentEmail()) {
      msg.textContent = uiText("noChanges");
      msg.className = "admin-password-msg error";
      return;
    }

    submit.disabled = true;
    try {
      await updateAccount({ email, password: wantsPassword ? next : "" });
      msg.textContent = uiText("settingsSaved");
      msg.className = "admin-password-msg ok";
      form.querySelector("#newPass").value = "";
      form.querySelector("#confPass").value = "";
    } catch (err) {
      const msgText = (err && err.message ? err.message : "").toLowerCase();
      if (msgText.includes("reauth") || msgText.includes("recent")) msg.textContent = uiText("requiresRelogin");
      else if (msgText.includes("already") && msgText.includes("email")) msg.textContent = uiText("emailInUse");
      else if (msgText.includes("invalid") && msgText.includes("email")) msg.textContent = uiText("emailRequired");
      else if (msgText.includes("weak") || msgText.includes("password")) msg.textContent = uiText("passwordShort");
      else msg.textContent = "تعذّر الحفظ: " + (err && err.message ? err.message : "حاول مرة تانية");
      msg.className = "admin-password-msg error";
    } finally {
      submit.disabled = false;
    }
  });

  box.appendChild(form);
  return box;
}

function renderCurrentGroup() {
  const group = SCHEMA.find((g) => g.id === currentGroup) || SCHEMA[0];
  $("adminGroupTitle").textContent = group.custom === "password" ? uiText("settingsTitle") : group.title;
  const container = $("adminFields");
  container.innerHTML = "";

  if (group.custom === "password") {
    container.appendChild(buildPasswordForm());
    const head = el("div", "admin-texts-head");
    head.appendChild(el("h3", "", escapeHtml(uiText("textsSectionTitle"))));
    head.appendChild(el("p", "admin-hint", escapeHtml(uiText("textsSectionHint"))));
    container.appendChild(head);
  }

  group.fields.forEach((field) => container.appendChild(buildField(field)));
  applyAdminTexts(working);
}

function buildTabs() {
  const tabs = $("adminTabs");
  tabs.innerHTML = "";
  SCHEMA.forEach((group) => {
    const tab = el("button", "admin-tab" + (group.id === currentGroup ? " active" : ""),
      '<i class="' + group.icon + '"></i> ' + escapeHtml(group.title));
    tab.type = "button";
    tab.addEventListener("click", () => {
      currentGroup = group.id;
      tabs.querySelectorAll(".admin-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderCurrentGroup();
    });
    tabs.appendChild(tab);
  });
}

/* ===== الدخول والصلاحية ===== */
function showEditor(show) {
  $("loginScreen").classList.toggle("is-hidden", show);
  $("adminApp").classList.toggle("is-hidden", !show);
  $("logoutBtn").classList.toggle("is-hidden", !show);
  if (!show) {
    $("backupPanel").classList.add("is-hidden");
    $("backupChevron").className = "fas fa-chevron-down";
  }
}

/* ===== نسخة احتياطية / استيراد / استعادة ===== */
function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportBackup() {
  if (!canEdit) { setStatus("سجّل الدخول أولًا", "error"); return; }
  const date = new Date().toISOString().slice(0, 10);
  downloadJson("portfolio-backup-" + date + ".json", working);
  setStatus("تم تنزيل النسخة الاحتياطية ✓", "saved");
}

async function importBackup(file) {
  if (!canEdit) { setStatus("سجّل الدخول أولًا", "error"); return; }
  try {
    const parsed = JSON.parse(await file.text());
    if (!parsed || typeof parsed !== "object" || !parsed.hero || !parsed.portfolio) {
      throw new Error("هذا الملف ليس نسخة احتياطية صالحة لهذا الموقع");
    }
    if (!window.confirm("سيتم استبدال كل المحتوى الحالي بالنسخة المستوردة. هل تريد المتابعة؟")) return;
    working = mergeDefaults(DEFAULT_DATA, parsed);
    lastLocalEdit = Date.now();
    applyAdminTexts(working);
    renderCurrentGroup();
    await flushSave();
    setStatus("تم استيراد النسخة بنجاح ✓", "saved");
  } catch (err) {
    console.error(err);
    setStatus("فشل الاستيراد", "error");
    window.alert("تعذّر استيراد الملف: " + (err && err.message ? err.message : "ملف غير صالح"));
  } finally {
    $("importFile").value = "";
  }
}

async function resetDefault() {
  if (!canEdit) { setStatus("سجّل الدخول أولًا", "error"); return; }
  if (!window.confirm("سيتم حذف كل تعديلاتك والعودة للمحتوى الافتراضي الأصلي. متابعة؟")) return;
  working = clone(DEFAULT_DATA);
  lastLocalEdit = Date.now();
  applyAdminTexts(working);
  renderCurrentGroup();
  await flushSave();
  setStatus("تمت الاستعادة للافتراضي ✓", "saved");
}

function applyRemote(remote) {
  working = remote ? mergeDefaults(DEFAULT_DATA, remote) : clone(DEFAULT_DATA);
  applyAdminTexts(working);
  if (!$("adminApp").classList.contains("is-hidden")) renderCurrentGroup();
}

function setupAuth() {
  if (!isSupabaseConfigured) {
    canEdit = true;
    showEditor(true);
    const banner = $("setupBanner");
    banner.textContent = "وضع تجريبي محلي: Supabase غير مُعدّ بعد. التعديلات تُحفظ في هذا المتصفح فقط. اتبع ملف طريقة_الإعداد.md لتفعيل المزامنة مع الزوار.";
    banner.classList.remove("is-hidden");
    $("logoutBtn").classList.add("is-hidden");
    setStatus("وضع محلي", "saving");
    return;
  }

  const adminId = adminUid();
  if (!adminId || adminId === "PASTE_ADMIN_UID_HERE") {
    const warn = $("setupBanner");
    warn.textContent = "لم تدخل UID حساب المدير في supabase-config.js بعد — لن تُحفظ التعديلات حتى تضيفه وتفعّل سياسات الأمان.";
    warn.classList.remove("is-hidden");
  }

  onAuthChanged((user) => {
    const allowedUid = adminUid();
    const uid = user ? user.id : null;
    const isOwner = !!uid && (!allowedUid || allowedUid === "PASTE_ADMIN_UID_HERE" || uid === allowedUid);
    canEdit = !!isOwner;
    showEditor(!!canEdit);

    if (!canEdit) {
      setStatus("تسجيل الدخول مطلوب");
      if (user) $("loginError").textContent = "هذا الحساب غير مسموح له بالتعديل.";
      return;
    }

    setStatus("تم تسجيل الدخول ✓", "saved");
    if (!initializedRemote && remoteSeen && remoteEmpty) {
      initializedRemote = true;
      flushSave();
    }
  });
}

/* ===== بدء التشغيل ===== */
async function start() {
  buildTabs();
  renderCurrentGroup();

  $("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    $("loginError").textContent = "";
    try {
      await signIn($("adminEmail").value.trim(), $("adminPassword").value);
    } catch (err) {
      $("loginError").textContent = "تعذّر الدخول: " + (err && err.message ? err.message : "تحقق من البريد وكلمة المرور");
    }
  });

  $("logoutBtn").addEventListener("click", async () => {
    try { await signOut(); } catch (_) { /* تجاهل */ }
  });

  $("saveNow").addEventListener("click", () => flushSave());

  $("backupToggle").addEventListener("click", () => {
    const panel = $("backupPanel");
    const hidden = panel.classList.toggle("is-hidden");
    $("backupChevron").className = hidden ? "fas fa-chevron-down" : "fas fa-chevron-up";
  });

  $("exportBtn").addEventListener("click", exportBackup);
  $("importBtn").addEventListener("click", () => $("importFile").click());
  $("importFile").addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) importBackup(file);
  });
  $("resetBtn").addEventListener("click", resetDefault);

  await initStore();

  subscribe((remote) => {
    remoteSeen = true;
    remoteEmpty = !remote;
    // تجاهل التحديث الناتج عن حفظنا حتى لا نعيد رسم النموذج أثناء الكتابة
    if (Date.now() - lastLocalEdit < 1800) return;
    applyRemote(remote);
    if (canEdit && isSupabaseConfigured && remoteEmpty && !initializedRemote) {
      initializedRemote = true;
      flushSave();
    }
  });

  setupAuth();
}

start();
