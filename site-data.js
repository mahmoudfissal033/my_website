/* ============================================================
   site-data.js  -  المصدر الافتراضي للمحتوى + تعريف حقول المدير
   يُحمّل في صفحة الزائر وصفحة المدير معًا.
   الصيغة [[orange:نص]] هي صيغة تلوين داخلية، اشرحها في المدير.
   ============================================================ */

window.DEFAULT_DATA = {
  pageTitle: "Mahmoud Faisal | Portfolio",

  brand: {
    initials: "MF",
    name: "Mahmoud Fissal",
    quickTitle: "الوصول السريع"
  },

  nav: {
    home: "الرئيسية",
    about: "من أنا",
    services: "خدماتي",
    portfolio: "معرض أعمالي",
    contact: "تواصل معي"
  },

  hero: {
    title: "[[title-accent:مصمم جرافيك]] ومحتوى تعليمي تفاعلي",
    desc: "أحول الأفكار والتصاميم إلى [[orange:تجربة بصرية]] وتعليمية احترافية تجمع بين [[orange:الإبداع]] والبساطة.",
    subTitle: "معكم [[highlight:محمود فيصل]]",
    intro: "خريج قسم تكنولوجيا التعليم والمعلومات - كلية التربية النوعية - جامعة قنا",
    spec: "متخصص في تصميم السوشيال ميديا، الموشن جرافيك، تصميم البرمجيات التعليمية، المونتاج وصناعة المحتوى، واستخدام الذكاء الاصطناعي في التصميم.",
    boxes: [
      "تصميم السوشيال ميديا",
      "الموشن جرافيك",
      "تصميم الوسائط التعليمية",
      "المونتاج وصناعة المحتوى",
      "الذكاء الاصطناعي في التصميم"
    ],
    btnContact: "تواصل معي",
    btnAbout: "اعرف أكثر",
    image: "MAHMOUD.jpg",
    imageAlt: "Mahmoud Faisal"
  },

  about: {
    sectionTitle: "من [[gradient:أنا]]",
    sectionLead: "نبذة عن [[ah-t:مسيرتي]] و[[ah-g:خبراتي]]",
    title: "مصمم جرافيك [[accent-text:محترف]]",
    p1: "مصمم جرافيك متخصص في ابتكار وتصميم [[ah-t:الهوية البصرية]]، [[ah-g:الإعلانات]]، والمواد الدعائية باستخدام أحدث [[ah-p:الأدوات]]. أركز على تقديم [[ah-g:تصاميم إبداعية]] تجمع بين [[ah-t:الجاذبية البصرية]] والرسالة الواضحة.",
    p2: "أعمل على تحويل الأفكار إلى [[ah-g:أعمال فنية مؤثرة]]، مع الاهتمام بأدق التفاصيل لضمان أفضل [[ah-t:تجربة بصرية]]، ولدي [[ah-p:شغف دائم]] بتعلم كل جديد في عالم التصميم.",
    image: "2525.jpeg",
    imageAlt: "Mahmoud Faisal",
    badgeNum: "+4",
    badgeLabel: "سنوات خبرة",
    stats: [
      { num: "4+", label: "سنوات خبرة" },
      { num: "150+", label: "عميل راضي" },
      { num: "148+", label: "مشروع مكتمل" }
    ]
  },

  services: {
    title: "[[gradient:خدماتي]]",
    lead: "ماذا أقدم لك من خدمات احترافية",
    items: [
      { icon: "fas fa-laptop-code", title: "تصميم برمجيات تعليمية", desc: "تصميم برمجيات تعليمية عالية الجودة بتجربة مستخدم تفاعلية تناسب جميع الفئات." },
      { icon: "fas fa-id-card", title: "تصميم كروت شخصية", desc: "تصميم كروت شخصية احترافية تعبر عن هويتك بأسلوب أنيق وعصري." },
      { icon: "fas fa-award", title: "تصميم شهادات تقدير", desc: "تصميم شهادات تقدير وشكر بلمسات إبداعية تناسب مختلف المناسبات." },
      { icon: "fas fa-utensils", title: "تصميم منيو مطاعم", desc: "تصميم مينوهات مطاعم وكافيهات جذابة تعكس هوية المكان وتشجع على الطلب." },
      { icon: "fas fa-book", title: "تصميم أغلفة كتب", desc: "تصميم أغلفة كتب احترافية تجذب القراء وتعبر عن محتوى الكتاب." },
      { icon: "fas fa-chart-pie", title: "تصميم إنفوجرافيك", desc: "تصميم إنفوجرافيك تعليمي وتوضيحي يحول المعلومات المعقدة إلى رسوم بسيطة." },
      { icon: "fas fa-file-alt", title: "تصميم CV احترافي", desc: "تصميم سيرة ذاتية احترافية تبرز مهاراتك وخبراتك بأفضل صورة." },
      { icon: "fas fa-prescription", title: "تصميم روشتات طبية", desc: "تصميم روشتات طبية منظمة وواضحة تناسب العيادات والمراكز الطبية." },
      { icon: "fas fa-ring", title: "تصميم دعوات زفاف", desc: "تصميم دعوات زفاف ومناسبات أنيقة بتصاميم فريدة تناسب ذوقك." },
      { icon: "fas fa-slideshare", title: "تصميم عروض تقديمية", desc: "تصميم عروض تقديمية احترافية تجعل أفكارك أكثر وضوحاً وتأثيراً." },
      { icon: "fas fa-book-open", title: "تصميم كتب احترافية", desc: "تصميم وتنسيق كتب احترافية مع الاهتمام بالتخطيط والإخراج الفني الكامل." }
    ]
  },

  portfolio: {
    title: "معرض [[gradient:أعمالي]]",
    lead: "نماذج من المشاريع التي قمت بتنفيذها",
    cta: "انقر هنا لمشاهدة المزيد",
    items: [
      { title: "برمجيات تعليمية", desc: "تصميم برمجيات تعليمية عالية الجودة بتجربة مستخدم تفاعلية", image: "", driveLink: "" },
      { title: "كروت شخصية", desc: "تصميم كروت شخصية احترافية تعبر عن هويتك", image: "", driveLink: "" },
      { title: "شهادات تقدير", desc: "تصميم شهادات تقدير وشكر بلمسات إبداعية", image: "", driveLink: "" },
      { title: "مينوهات مطاعم", desc: "تصميم مينوهات مطاعم وكافيهات جذابة", image: "", driveLink: "" },
      { title: "أغلفة كتب", desc: "تصميم أغلفة كتب احترافية تجذب القراء", image: "", driveLink: "" },
      { title: "إنفوجرافيك تعليمي", desc: "تصميم إنفوجرافيك تعليمي وتوضيحي احترافي", image: "", driveLink: "" },
      { title: "سيرة ذاتية", desc: "تصميم سيرة ذاتية احترافية تبرز مهاراتك", image: "", driveLink: "" },
      { title: "روشتات طبية", desc: "تصميم روشتات طبية منظمة للعيادات والمراكز", image: "", driveLink: "" },
      { title: "دعوات زفاف", desc: "تصميم دعوات زفاف ومناسبات أنيقة وفريدة", image: "", driveLink: "" },
      { title: "عروض تقديمية", desc: "تصميم عروض تقديمية احترافية مؤثرة", image: "", driveLink: "" },
      { title: "كتب احترافية", desc: "تصميم وتنسيق كتب مع الإخراج الفني الكامل", image: "", driveLink: "" }
    ]
  },

  contact: {
    title: "[[gradient:تواصل]] معي",
    lead1: "يسعدني سماع رأيك أو فكرة مشروعك القادم",
    lead2: "لا تتردد في التواصل معي لأي استفسار أو فكرة مشروع. أنا هنا لمساعدتك في تحويل أفكارك إلى واقع.",
    formAction: "https://formsubmit.co/mahmoudfissal033@gmail.com",
    items: [
      { icon: "fas fa-envelope", label: "البريد الإلكتروني", value: "mahmoudfissal033@gmail.com", href: "" },
      { icon: "fas fa-phone-alt", label: "رقم الهاتف", value: "01008860716", href: "" },
      { icon: "fab fa-linkedin-in", label: "LinkedIn", value: "mahmoud-faissl", href: "https://www.linkedin.com/in/mahmoud-faissl-9bbb2a295?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
      { icon: "fab fa-facebook-f", label: "Facebook", value: "Mahmoud Faisal", href: "https://www.facebook.com/share/17kSdzEbu6/" },
      { icon: "fab fa-instagram", label: "Instagram", value: "mahmoud_fissal_mohamed", href: "https://www.instagram.com/mahmoud_fissal_mohamed?igsh=MTRkZGphd3U5NDc4Nw==" },
      { icon: "fab fa-whatsapp", label: "WhatsApp & Telegram", value: "01008860716", href: "https://wa.me/201008860716" }
    ]
  },

  footer: {
    text: "جميع الحقوق محفوظة © 2026 [[footer-name:محمود فيصل]]"
  },

  /* نصوص صفحة المدير نفسها — قابلة للتعديل من تبويب إعدادات كلمة المرور */
  adminUi: {
    settingsTitle: "إعدادات كلمة المرور ونصوص لوحة المدير",
    headerBrand: "لوحة تحكم محمود فيصل",
    loginTitle: "لوحة المدير",
    loginDesc: "هذه الصفحة مخصصة لك وحدك.\nالزوار يرون صفحة العرض فقط ولا يمكنهم التعديل.",
    loginEmailLabel: "البريد الإلكتروني",
    loginPasswordLabel: "كلمة المرور",
    loginButton: "دخول المدير",
    previewButton: "معاينة صفحة الزائر",
    saveButton: "حفظ الآن",
    backupTitle: "النسخة الاحتياطية",
    exportButton: "تنزيل نسخة احتياطية",
    importButton: "استيراد نسخة",
    resetButton: "استعادة الافتراضي",
    backupHint: "نزّل نسخة قبل أي تعديل كبير، واستخدم الاستيراد للرجوع لها وقت ما تحب.",
    panelNote: "كل تعديل تحفظه يظهر فورًا في صفحة الزائر",
    footerNote: "لون الكلمات داخل النصوص يُكتب هكذا: [[orange:كلمة ملونة]] — وتبدأ الصفحة بالشكل الافتراضي قبل أول تعديل.",
    passwordBoxTitle: "تغيير كلمة المرور",
    passwordBoxHint: "غيّر البريد و/أو كلمة المرور من هنا. لو Supabase طلب تسجيل دخول حديث، اعمل خروج ثم دخول تاني وجرّب.",
    emailLabel: "البريد الإلكتروني للمدير",
    newPasswordLabel: "كلمة المرور الجديدة",
    confirmPasswordLabel: "تأكيد كلمة المرور الجديدة",
    changePasswordButton: "حفظ الإعدادات",
    settingsSaved: "تم حفظ إعدادات الحساب بنجاح ✓",
    noChanges: "مفيش حاجة اتغيّرت — اكتب بريد أو كلمة مرور جديدة أولًا.",
    emailRequired: "البريد الإلكتروني مطلوب",
    emailInUse: "البريد ده مستخدم بالفعل في حساب تاني",
    requiresRelogin: "Supabase محتاج تسجيل دخول حديث عشان يغيّر بيانات الحساب. اعمل خروج ثم دخول تاني وجرّب.",
    passwordMismatch: "كلمتا المرور الجديدتان مش متطابقتان",
    passwordShort: "كلمة المرور لازم تكون 6 أحرف على الأقل",
    localModePassword: "الوضع المحلي التجريبي مفيش فيه حساب مدير، لازم تعمل إعداد Supabase الأول.",
    textsSectionTitle: "تعديل نصوص صفحة المدير",
    textsSectionHint: "التعديلات دي بتظهر هنا فورًا، ومش بتأثر على صفحة الزائر."
  }
};


/* تعريف حقول لوحة المدير. كل حقل له path داخل كائن DEFAULT_DATA */
window.SITE_SCHEMA = [
  {
    id: "general", title: "معلومات عامة", icon: "fas fa-cog",
    fields: [
      { path: "pageTitle", label: "عنوان الصفحة في المتصفح", type: "text" },
      { path: "brand.initials", label: "الاختصار (مثال: MF)", type: "text" },
      { path: "brand.name", label: "الاسم الظاهر في الشريط", type: "text" },
      { path: "brand.quickTitle", label: "عنوان القائمة الجانبية", type: "text" },
      { path: "nav.home", label: "نص رابط الرئيسية", type: "text" },
      { path: "nav.about", label: "نص رابط من أنا", type: "text" },
      { path: "nav.services", label: "نص رابط خدماتي", type: "text" },
      { path: "nav.portfolio", label: "نص رابط معرض أعمالي", type: "text" },
      { path: "nav.contact", label: "نص رابط تواصل معي", type: "text" }
    ]
  },
  {
    id: "hero", title: "الصفحة الرئيسية", icon: "fas fa-home",
    fields: [
      { path: "hero.title", label: "العنوان الرئيسي", type: "rich" },
      { path: "hero.desc", label: "الوصف", type: "rich" },
      { path: "hero.subTitle", label: "العنوان الفرعي + الاسم", type: "rich" },
      { path: "hero.intro", label: "نبذة المؤهل", type: "textarea" },
      { path: "hero.spec", label: "نبذة التخصص", type: "textarea" },
      { path: "hero.boxes", label: "المربعات التعريفية", type: "simpleList", itemLabel: "مربع", defaultItem: "مهارة جديدة" },
      { path: "hero.btnContact", label: "نص زر تواصل معي", type: "text" },
      { path: "hero.btnAbout", label: "نص زر اعرف أكثر", type: "text" },
      { path: "hero.image", label: "صورة الرئيسية", type: "image", note: "ارفع صورة من جهازك أو الصق رابط صورة." },
      { path: "hero.imageAlt", label: "النص البديل للصورة", type: "text" }
    ]
  },
  {
    id: "about", title: "من أنا", icon: "fas fa-user",
    fields: [
      { path: "about.sectionTitle", label: "عنوان القسم", type: "rich" },
      { path: "about.sectionLead", label: "وصف القسم", type: "rich" },
      { path: "about.title", label: "العنوان الداخلي", type: "rich" },
      { path: "about.p1", label: "الفقرة الأولى", type: "rich" },
      { path: "about.p2", label: "الفقرة الثانية", type: "rich" },
      { path: "about.image", label: "صورة (من أنا)", type: "image" },
      { path: "about.imageAlt", label: "النص البديل للصورة", type: "text" },
      { path: "about.badgeNum", label: "رقم شارة الخبرة", type: "text" },
      { path: "about.badgeLabel", label: "نص شارة الخبرة", type: "text" },
      { path: "about.stats", label: "بطاقات الإحصائيات", type: "objectList", itemLabel: "إحصائية",
        itemFields: [
          { path: "num", label: "الرقم", type: "text" },
          { path: "label", label: "الوصف", type: "text" }
        ] }
    ]
  },
  {
    id: "services", title: "خدماتي", icon: "fas fa-cogs",
    fields: [
      { path: "services.title", label: "عنوان القسم", type: "rich" },
      { path: "services.lead", label: "وصف القسم", type: "text" },
      { path: "services.items", label: "بطاقات الخدمات", type: "objectList", itemLabel: "خدمة",
        itemFields: [
          { path: "icon", label: "أيقونة Font Awesome", type: "text", placeholder: "fas fa-laptop-code", note: "اكتب اسم الأيقونة من موقع Font Awesome" },
          { path: "title", label: "عنوان الخدمة", type: "text" },
          { path: "desc", label: "وصف الخدمة", type: "textarea" }
        ] }
    ]
  },
  {
    id: "portfolio", title: "معرض أعمالي", icon: "fas fa-briefcase",
    fields: [
      { path: "portfolio.title", label: "عنوان القسم", type: "rich" },
      { path: "portfolio.lead", label: "وصف القسم", type: "text" },
      { path: "portfolio.cta", label: "نص زر البطاقة", type: "text" },
      { path: "portfolio.items", label: "بطاقات معرض الأعمال", type: "portfolioList", itemLabel: "بطاقة",
        itemFields: [
          { path: "title", label: "عنوان البطاقة", type: "text" },
          { path: "desc", label: "وصف البطاقة", type: "textarea" },
          { path: "image", label: "صورة البطاقة (معاينة مباشرة)", type: "image" },
          { path: "driveLink", label: "رابط جوجل درايف", type: "url", placeholder: "https://drive.google.com/...", note: "الزائر يفتح هذا الرابط مباشرة عند الضغط على البطاقة." }
        ] }
    ]
  },
  {
    id: "contact", title: "تواصل معي", icon: "fas fa-envelope",
    fields: [
      { path: "contact.title", label: "عنوان القسم", type: "rich" },
      { path: "contact.lead1", label: "الوصف الأول", type: "text" },
      { path: "contact.lead2", label: "الوصف الثاني", type: "textarea" },
      { path: "contact.formAction", label: "رابط إرسال النموذج", type: "url" },
      { path: "contact.items", label: "بيانات التواصل", type: "objectList", itemLabel: "وسيلة تواصل",
        itemFields: [
          { path: "icon", label: "الأيقونة", type: "text" },
          { path: "label", label: "العنوان", type: "text" },
          { path: "value", label: "القيمة الظاهرة", type: "text" },
          { path: "href", label: "الرابط (فارغ = بدون رابط)", type: "url" }
        ] },
      { path: "footer.text", label: "نص التذييل", type: "rich" }
    ]
  },
  {
    id: "settings", title: "إعدادات كلمة المرور", icon: "fas fa-key", custom: "password",
    fields: [
      { path: "adminUi.headerBrand", label: "اسم لوحة المدير في الشريط", type: "text" },
      { path: "adminUi.loginTitle", label: "عنوان شاشة الدخول", type: "text" },
      { path: "adminUi.loginDesc", label: "الجملة تحت عنوان الدخول", type: "textarea", note: "اكتب سطر في كل سطر، هيظهر كسطر جديد." },
      { path: "adminUi.loginEmailLabel", label: "عنوان خانة البريد", type: "text" },
      { path: "adminUi.loginPasswordLabel", label: "عنوان خانة كلمة المرور", type: "text" },
      { path: "adminUi.loginButton", label: "نص زرار الدخول", type: "text" },
      { path: "adminUi.previewButton", label: "نص زرار المعاينة", type: "text" },
      { path: "adminUi.saveButton", label: "نص زرار الحفظ", type: "text" },
      { path: "adminUi.backupTitle", label: "عنوان زرار النسخة الاحتياطية", type: "text" },
      { path: "adminUi.exportButton", label: "نص زرار تنزيل النسخة", type: "text" },
      { path: "adminUi.importButton", label: "نص زرار الاستيراد", type: "text" },
      { path: "adminUi.resetButton", label: "نص زرار الاستعادة", type: "text" },
      { path: "adminUi.backupHint", label: "ملاحظة النسخة الاحتياطية", type: "textarea" },
      { path: "adminUi.panelNote", label: "الملاحظة بجانب عنوان كل قسم", type: "text" },
      { path: "adminUi.footerNote", label: "الملاحظة في أسفل الصفحة", type: "rich" },
      { path: "adminUi.settingsTitle", label: "عنوان صفحة الإعدادات", type: "text" },
      { path: "adminUi.passwordBoxTitle", label: "عنوان صندوق كلمة المرور", type: "text" },
      { path: "adminUi.passwordBoxHint", label: "ملاحظة صندوق كلمة المرور", type: "text" },
      { path: "adminUi.emailLabel", label: "عنوان خانة البريد في الإعدادات", type: "text" },
      { path: "adminUi.changePasswordButton", label: "نص زرار حفظ الإعدادات", type: "text" }
    ]
  }
];
