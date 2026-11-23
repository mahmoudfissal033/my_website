/* ============================================================
   visitor.js  -  صفحة الزائر: قراءة البيانات وعرضها فقط.
   لا يحتوي هذا الملف على أي عملية كتابة أو تسجيل دخول.
   البيانات تُجلب مباشرة من Supabase.
   ============================================================ */

import { initStore, subscribe } from "./store.js";
import { applyData, bindServiceCards } from "./render.js";

const DEFAULT_DATA = window.DEFAULT_DATA;

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

async function start() {
  // العرض الافتراضي فورًا: الصفحة تظهر كما هي حتى قبل اكتمال الاتصال
  applyData(DEFAULT_DATA);
  bindServiceCards();

  await initStore();

  subscribe((remote) => {
    const data = remote ? mergeDefaults(DEFAULT_DATA, remote) : DEFAULT_DATA;
    applyData(data);
    bindServiceCards();
  });
}

start();
