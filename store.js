/* ============================================================
   store.js  -  طبقة الوصول للبيانات (Supabase)
   - الزائر: قراءة فقط (لا يوجد أي كود كتابة في صفحة الزائر).
   - المدير: كتابة بعد تسجيل الدخول، وتتحقق سياسات RLS من UID المدير.
   - إذا لم يتم إعداد Supabase بعد: وضع محلي تجريبي عبر localStorage.
   ============================================================ */

const CFG = window.SUPABASE_CONFIG || {};
const LOCAL_KEY = "mahmoud_portfolio_data_v1";
const TABLE = "site_content";
const ROW_ID = "main";
const BUCKET = "portfolio-images";

const looksUnconfigured = (v) => !v || /PASTE|YOUR_|xxxx|example/i.test(String(v));

export const isSupabaseConfigured =
  !looksUnconfigured(CFG.url) &&
  !looksUnconfigured(CFG.anonKey);

let supabase = null;
let initPromise = null;
let currentUser = null;

function notifyAuth(callback) {
  callback(currentUser);
}

export function initStore() {
  if (!initPromise) {
    initPromise = (async () => {
      if (!isSupabaseConfigured) return { mode: "local" };
      try {
        const mod = await import("https://esm.sh/@supabase/supabase-js@2.49.4");
        supabase = mod.createClient(CFG.url, CFG.anonKey, {
          auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
        });
        const { data } = await supabase.auth.getSession();
        currentUser = data && data.session ? data.session.user : null;
        supabase.auth.onAuthStateChange((_event, session) => {
          currentUser = session ? session.user : null;
        });
        return { mode: "supabase" };
      } catch (err) {
        console.error("Supabase init error:", err);
        supabase = null;
        return { mode: "local", error: err && err.message };
      }
    })();
  }
  return initPromise;
}

/* قراءة مباشرة + اشتراك في أي تغيير (تحديث فوري) */
export function subscribe(callback) {
  if (supabase) {
    let active = true;
    const emit = async () => {
      const { data, error } = await supabase
        .from(TABLE)
        .select("data")
        .eq("id", ROW_ID)
        .maybeSingle();
      if (!active) return;
      if (error) {
        console.error("Supabase read error:", error);
        callback(null);
        return;
      }
      callback(data ? data.data : null);
    };

    emit();

    const channel = supabase
      .channel("site-content-" + Math.random().toString(36).slice(2))
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: TABLE, filter: `id=eq.${ROW_ID}` },
        (payload) => {
          if (!active) return;
          const row = payload.new || payload.old || null;
          callback(row && row.data ? row.data : (payload.eventType === "DELETE" ? null : undefined));
          // للـ DELETE أو الحالات غير المتوقعة، أعد القراءة لضمان الدقة
          if (payload.eventType === "DELETE" || !row || !row.data) emit();
        }
      )
      .subscribe();

    return () => {
      active = false;
      try { supabase.removeChannel(channel); } catch (_) { /* تجاهل */ }
    };
  }

  // الوضع المحلي: قراءة فورية + مزامنة بين تبويبات نفس المتصفح
  const read = () => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      callback(raw ? JSON.parse(raw) : null);
    } catch (_) {
      callback(null);
    }
  };
  read();
  const onStorage = (e) => { if (e.key === LOCAL_KEY) read(); };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

export async function saveData(data) {
  if (supabase) {
    const payload = { id: ROW_ID, data, updated_at: new Date().toISOString() };
    const { error } = await supabase.from(TABLE).upsert(payload, { onConflict: "id" });
    if (error) throw error;
    return;
  }
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
}

/* رفع صورة إلى Supabase Storage وإرجاع الرابط العام.
   في الوضع المحلي نرجع data URL كبديل. */
export async function uploadImage(file) {
  if (!file) throw new Error("لم يتم اختيار ملف");
  if (supabase) {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "31536000",
      upsert: false,
      contentType: file.type || "image/jpeg"
    });
    if (error) throw error;
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  // وضع محلي: data URL
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("تعذّر قراءة الصورة"));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

export function onAuthChanged(callback) {
  if (supabase) {
    notifyAuth(callback);
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      currentUser = session ? session.user : null;
      callback(currentUser);
    });
    return () => {
      try { sub.subscription.unsubscribe(); } catch (_) { /* تجاهل */ }
    };
  }
  callback(null);
  return () => {};
}

export async function signIn(email, password) {
  if (!supabase) throw new Error("Supabase غير مُعدّ");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  currentUser = data.user;
  return data;
}

export async function signOut() {
  if (supabase) {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    currentUser = null;
  }
}

export function currentEmail() {
  return currentUser ? (currentUser.email || "") : "";
}

/* حفظ إعدادات الحساب: البريد و/أو كلمة المرور */
export async function updateAccount({ email, password } = {}) {
  if (!supabase || !currentUser) throw new Error("لا يوجد حساب مدير مسجّل الدخول");
  const attrs = {};
  const nextEmail = email && email.trim() ? email.trim() : currentUser.email;
  if (nextEmail && nextEmail !== currentUser.email) attrs.email = nextEmail;
  if (password) attrs.password = password;
  if (!Object.keys(attrs).length) return false;
  const { data, error } = await supabase.auth.updateUser(attrs);
  if (error) throw error;
  currentUser = data.user || currentUser;
  return true;
}

export function currentUid() {
  return currentUser ? currentUser.id : null;
}

export function adminUid() {
  return window.ADMIN_UID || "";
}
