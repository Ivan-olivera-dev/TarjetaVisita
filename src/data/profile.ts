export type Language = 'es' | 'en';

export const DEFAULT_LANGUAGE: Language = 'en';

export type CoreTechnology =
  | 'Node.js'
  | 'Python'
  | 'Docker'
  | 'Linux'
  | 'Bash'
  | 'Java';

export const CORE_TECHNOLOGIES: readonly CoreTechnology[] = [
  'Node.js',
  'Python',
  'Docker',
  'Linux',
  'Bash',
  'Java',
] as const;

export const LANGUAGES_BADGE = 'ES · EN · VAL (Fluent)' as const;

export interface AuthorizedContactProfile {
  name: 'Iván Olivera González';
  fullName: 'Iván Olivera González';
  firstName: 'Iván';
  lastName: 'Olivera González';
  role: 'Software Engineer & Systems Specialist';
  company: 'Yuvod';
  companyRole: 'Software Engineer @ Yuvod';
  email: 'ivanoliveradev@gmail.com';
  mailtoUrl: 'mailto:ivanoliveradev@gmail.com';
  portfolioUrl: 'https://ivanolivera.dev';
  cardUrl: 'https://card.ivanolivera.dev';
  nfcUrl: 'https://card.ivanolivera.dev/?ref=nfc';
  nfcDestinationUrl: 'https://card.ivanolivera.dev/?ref=nfc';
  linkedinUrl: 'https://www.linkedin.com/in/ivan-olivera-gonzalez/';
  githubUrl: 'https://github.com/Ivan-olivera-dev';
  city: 'Valencia';
  country: 'España';
  locationLabel: 'Valencia, España';
  languagesBadge: typeof LANGUAGES_BADGE;
  stack: readonly CoreTechnology[];
  spokenLanguages: readonly ['Valenciano', 'English', 'Español'];
}

export const AUTHORIZED_PROFILE: AuthorizedContactProfile = {
  name: 'Iván Olivera González',
  fullName: 'Iván Olivera González',
  firstName: 'Iván',
  lastName: 'Olivera González',
  role: 'Software Engineer & Systems Specialist',
  company: 'Yuvod',
  companyRole: 'Software Engineer @ Yuvod',
  email: 'ivanoliveradev@gmail.com',
  mailtoUrl: 'mailto:ivanoliveradev@gmail.com',
  portfolioUrl: 'https://ivanolivera.dev',
  cardUrl: 'https://card.ivanolivera.dev',
  nfcUrl: 'https://card.ivanolivera.dev/?ref=nfc',
  nfcDestinationUrl: 'https://card.ivanolivera.dev/?ref=nfc',
  linkedinUrl: 'https://www.linkedin.com/in/ivan-olivera-gonzalez/',
  githubUrl: 'https://github.com/Ivan-olivera-dev',
  city: 'Valencia',
  country: 'España',
  locationLabel: 'Valencia, España',
  languagesBadge: LANGUAGES_BADGE,
  stack: CORE_TECHNOLOGIES,
  spokenLanguages: ['Valenciano', 'English', 'Español'] as const,
};

export interface ExecutiveFocusPillar {
  id: 'integrations' | 'automation' | 'infrastructure';
  label: string;
  detail: string;
}

export type LegacyTechnology = CoreTechnology | 'TypeScript' | 'React' | 'Kotlin';

export type SpecialtyId = 'backend' | 'cloud' | 'automation' | 'mobile';

export type CanonicalSpecialtyTitle =
  | 'Backend Architecture'
  | 'Cloud & DevOps'
  | 'Process Automation & AI'
  | 'Mobile Development';

export interface SpecialtyArea {
  id: SpecialtyId;
  canonicalTitle: CanonicalSpecialtyTitle;
  title: string;
  description: string;
}

export interface TechCategory {
  id: 'backend-systems' | 'cloud-devops' | 'frontend-mobile';
  label: string;
  items: readonly LegacyTechnology[];
}

export type HighlightId =
  | 'docker-sentinel'
  | 'playaperello'
  | 'competitive-programming'
  | 'first-android-app';

export type CanonicalHighlightTitle =
  | 'Docker Sentinel'
  | 'playaperello.es'
  | 'Competitive Programming'
  | 'First Android App';

export type HighlightImageKey = 'docker-sentinel' | 'playaperello' | 'hp' | 'app';

export interface ProjectHighlight {
  id: HighlightId;
  canonicalTitle: CanonicalHighlightTitle;
  title: string;
  subtitle: string;
  description: string;
  imageKey: HighlightImageKey;
  url: string | null;
}

export interface ExperienceRole {
  id: 'yuvod-swe' | 'yuvod-sysadmin';
  company: 'Yuvod';
  role: 'Software Engineer' | 'Systems Administrator';
  employmentType: string;
  period: string;
  location: string;
  description: string;
  accent: 'emerald';
}

export interface EducationItem {
  id: 'ceedcv-daw' | 'ies-el-grao-smr';
  institution: 'CEEDCV' | 'IES El Grao';
  degree: string;
  shortLabel: 'CEEDCV DAW' | 'IES El Grao SMR';
  period: string;
  category: 'education';
  accent: 'blue';
}

export type CanonicalCertificationTitle =
  | 'AWS Cloud Quest: Cloud Practitioner'
  | 'CCNA 1 - CISCO'
  | 'Multi-Agent Systems with CrewAI - DeepLearning.AI'
  | 'IA & Emprendimiento - Cámara Valencia';

export interface CertificationItem {
  id:
    | 'aws-cloud-practitioner'
    | 'ccna-1-cisco'
    | 'crewai-deeplearning'
    | 'ia-camara-valencia';
  canonicalTitle: CanonicalCertificationTitle;
  title: string;
  shortLabel: string;
  issuer: string;
  category: 'certification';
  accent: 'purple';
}

export interface CredentialItem {
  id: string;
  title: string;
  subtitle: string;
  shortLabel: string;
  category: 'education' | 'certification';
  accent: 'blue' | 'purple';
}

export interface TranslationDictionary {
  header: {
    monogram: string;
    statusLabel: string;
    languageSelectorAria: string;
    switchToEsAria: string;
    switchToEnAria: string;
  };
  hero: {
    badge: string;
    fullName: string;
    role: 'Software Engineer & Systems Specialist';
    location: string;
    availability: string;
    stackLabel: string;
    languagesBadge: typeof LANGUAGES_BADGE;
    bio: string;
    languagesLabel: string;
    spokenLanguages: readonly string[];
    interactiveHint: string;
    cardAriaLabel: string;
  };
  actions: {
    saveContact: string;
    saveContactSubtitle: string;
    saveContactAria: string;
    directContact: string;
    directContactAria: string;
    email: string;
    emailAria: string;
    qrCode: string;
    qrCodeAria: string;
    qrAria: string;
    portfolio: string;
    portfolioAria: string;
    linkedin: string;
    linkedinAria: string;
    github: string;
    githubAria: string;
  };
  snapshot: {
    eyebrow: string;
    company: 'Yuvod';
    roleBadge: string;
    headline: string;
    summary: string;
    pillars: readonly ExecutiveFocusPillar[];
    portfolioCtaLabel: string;
    portfolioCtaAria: string;
  };
  sections: {
    specialtiesTitle: string;
    specialtiesSubtitle: string;
    techStackTitle: string;
    highlightsTitle: string;
    highlightsSubtitle: string;
    viewProject: string;
    experienceTitle: string;
    workHistoryTitle: string;
    educationTitle: string;
    certificationsTitle: string;
  };
  specialties: readonly SpecialtyArea[];
  techCategories: readonly TechCategory[];
  highlights: readonly ProjectHighlight[];
  experience: readonly ExperienceRole[];
  education: readonly EducationItem[];
  certifications: readonly CertificationItem[];
  credentials: readonly CredentialItem[];
  contactModal: {
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitButton: string;
    submittingButton: string;
    successTitle: string;
    successMessage: string;
    errorTitle: string;
    errorMessage: string;
    validationError: string;
    fallbackEmailLabel: string;
    closeAria: string;
  };
  qrModal: {
    title: string;
    subtitle: string;
    qrAlt: string;
    copyButton: string;
    copiedButton: string;
    shareButton: string;
    shareTitle: string;
    shareText: string;
    manualCopyHint: string;
    closeAria: string;
  };
  footer: {
    copyright: string;
    nfcTagline: string;
    dockAria: string;
  };
}

const esEducation: readonly EducationItem[] = [
  {
    id: 'ceedcv-daw',
    institution: 'CEEDCV',
    degree: 'Desarrollo de Aplicaciones Web (DAW)',
    shortLabel: 'CEEDCV DAW',
    period: '2026 - Actualidad',
    category: 'education',
    accent: 'blue',
  },
  {
    id: 'ies-el-grao-smr',
    institution: 'IES El Grao',
    degree: 'Sistemas Microinformáticos y Redes (SMR)',
    shortLabel: 'IES El Grao SMR',
    period: 'Sept 2024 - Jun 2026',
    category: 'education',
    accent: 'blue',
  },
];

const esCertifications: readonly CertificationItem[] = [
  {
    id: 'aws-cloud-practitioner',
    canonicalTitle: 'AWS Cloud Quest: Cloud Practitioner',
    title: 'AWS Cloud Quest: Cloud Practitioner',
    shortLabel: 'AWS Cloud Quest Practitioner',
    issuer: 'Amazon Web Services (AWS)',
    category: 'certification',
    accent: 'purple',
  },
  {
    id: 'ccna-1-cisco',
    canonicalTitle: 'CCNA 1 - CISCO',
    title: 'CCNA 1 — CISCO',
    shortLabel: 'CCNA 1 - CISCO',
    issuer: 'Cisco Networking Academy',
    category: 'certification',
    accent: 'purple',
  },
  {
    id: 'crewai-deeplearning',
    canonicalTitle: 'Multi-Agent Systems with CrewAI - DeepLearning.AI',
    title: 'Sistemas Multi-Agente con CrewAI — DeepLearning.AI',
    shortLabel: 'Multi-Agent Systems with CrewAI - DeepLearning.AI',
    issuer: 'DeepLearning.AI',
    category: 'certification',
    accent: 'purple',
  },
  {
    id: 'ia-camara-valencia',
    canonicalTitle: 'IA & Emprendimiento - Cámara Valencia',
    title: 'IA & Emprendimiento — Cámara Valencia',
    shortLabel: 'IA & Emprendimiento - Cámara Valencia',
    issuer: 'Cámara Valencia',
    category: 'certification',
    accent: 'purple',
  },
];

const enEducation: readonly EducationItem[] = [
  {
    id: 'ceedcv-daw',
    institution: 'CEEDCV',
    degree: 'Web Application Development (DAW) — Desarrollo de Aplicaciones Web',
    shortLabel: 'CEEDCV DAW',
    period: '2026 - Present',
    category: 'education',
    accent: 'blue',
  },
  {
    id: 'ies-el-grao-smr',
    institution: 'IES El Grao',
    degree: 'Microcomputer Systems & Networks (SMR) — Sistemas Microinformáticos y Redes',
    shortLabel: 'IES El Grao SMR',
    period: 'Sept 2024 - Jun 2026',
    category: 'education',
    accent: 'blue',
  },
];

const enCertifications: readonly CertificationItem[] = [
  {
    id: 'aws-cloud-practitioner',
    canonicalTitle: 'AWS Cloud Quest: Cloud Practitioner',
    title: 'AWS Cloud Quest: Cloud Practitioner',
    shortLabel: 'AWS Cloud Quest Practitioner',
    issuer: 'Amazon Web Services (AWS)',
    category: 'certification',
    accent: 'purple',
  },
  {
    id: 'ccna-1-cisco',
    canonicalTitle: 'CCNA 1 - CISCO',
    title: 'CCNA 1 — CISCO',
    shortLabel: 'CCNA 1 - CISCO',
    issuer: 'Cisco Networking Academy',
    category: 'certification',
    accent: 'purple',
  },
  {
    id: 'crewai-deeplearning',
    canonicalTitle: 'Multi-Agent Systems with CrewAI - DeepLearning.AI',
    title: 'Multi-Agent Systems with CrewAI — DeepLearning.AI',
    shortLabel: 'Multi-Agent Systems with CrewAI - DeepLearning.AI',
    issuer: 'DeepLearning.AI',
    category: 'certification',
    accent: 'purple',
  },
  {
    id: 'ia-camara-valencia',
    canonicalTitle: 'IA & Emprendimiento - Cámara Valencia',
    title: 'AI & Entrepreneurship (IA & Emprendimiento — Cámara Valencia)',
    shortLabel: 'IA & Emprendimiento - Cámara Valencia',
    issuer: 'Cámara Valencia',
    category: 'certification',
    accent: 'purple',
  },
];

function buildCredentials(
  educationList: readonly EducationItem[],
  certificationList: readonly CertificationItem[]
): readonly CredentialItem[] {
  return [
    ...educationList.map((edu) => ({
      id: edu.id,
      title: `${edu.institution} — ${edu.degree}`,
      subtitle: edu.period,
      shortLabel: edu.shortLabel,
      category: edu.category,
      accent: edu.accent,
    })),
    ...certificationList.map((cert) => ({
      id: cert.id,
      title: cert.title,
      subtitle: cert.issuer,
      shortLabel: cert.shortLabel,
      category: cert.category,
      accent: cert.accent,
    })),
  ];
}

export const translations: Record<Language, TranslationDictionary> = {
  es: {
    header: {
      monogram: 'I. O.',
      statusLabel: 'Disponible · NFC Activo',
      languageSelectorAria: 'Selector de idioma',
      switchToEsAria: 'Cambiar idioma a Español',
      switchToEnAria: 'Cambiar idioma a Inglés',
    },
    hero: {
      badge: 'TARJETA EJECUTIVA DIGITAL',
      fullName: AUTHORIZED_PROFILE.fullName,
      role: AUTHORIZED_PROFILE.role,
      location: AUTHORIZED_PROFILE.locationLabel,
      availability: 'Disponible en Valencia y remoto',
      stackLabel: 'Stack Principal',
      languagesBadge: LANGUAGES_BADGE,
      bio: 'Desarrollador de Software y Administrador de Sistemas apasionado por la arquitectura de software limpio, la automatización de procesos y la infraestructura escalable. Construyendo soluciones desde los 12 años.',
      languagesLabel: 'Idiomas',
      spokenLanguages: AUTHORIZED_PROFILE.spokenLanguages,
      interactiveHint: 'Desliza o inclina para explorar en 3D',
      cardAriaLabel: 'Tarjeta de presentación interactiva 3D de Iván Olivera González',
    },
    actions: {
      saveContact: 'Guardar Contacto',
      saveContactSubtitle: 'Descargar contacto vCard (.vcf)',
      saveContactAria: 'Guardar contacto de Iván Olivera González en la agenda (vCard .vcf)',
      directContact: 'Contacto Directo',
      directContactAria: 'Abrir formulario de contacto directo',
      email: 'Email',
      emailAria: 'Enviar correo electrónico a ivanoliveradev@gmail.com',
      qrCode: 'Código QR',
      qrCodeAria: 'Mostrar código QR y opciones para compartir tarjeta',
      qrAria: 'Mostrar código QR y opciones para compartir tarjeta',
      portfolio: 'Portfolio Web',
      portfolioAria: 'Abrir portfolio completo en ivanolivera.dev',
      linkedin: 'LinkedIn',
      linkedinAria: 'Abrir perfil oficial de LinkedIn de Iván Olivera González',
      github: 'GitHub',
      githubAria: 'Abrir perfil de GitHub de Iván Olivera González',
    },
    snapshot: {
      eyebrow: 'Foco Ejecutivo Actual',
      company: 'Yuvod',
      roleBadge: 'Software Engineer @ Yuvod',
      headline: 'Ingeniería de Software e Infraestructura en Yuvod',
      summary:
        'Desarrollo de integraciones sobre plataforma existente, automatización de procesos operativos y administración de infraestructura de sistemas en producción.',
      pillars: [
        {
          id: 'integrations',
          label: 'Integraciones Backend',
          detail: 'Evolución e integración de servicios sobre plataforma en producción.',
        },
        {
          id: 'automation',
          label: 'Automatización de Procesos',
          detail: 'Optimización de flujos operativos, scripting y herramientas internas.',
        },
        {
          id: 'infrastructure',
          label: 'Infraestructura de Sistemas',
          detail: 'Despliegue en contenedores Docker, servidores Linux y alta disponibilidad.',
        },
      ],
      portfolioCtaLabel: 'Explorar Portfolio Completo (ivanolivera.dev)',
      portfolioCtaAria: 'Explorar portfolio completo de Iván Olivera González en ivanolivera.dev',
    },
    sections: {
      specialtiesTitle: 'Competencias Clave',
      specialtiesSubtitle: 'Arquitectura de software, infraestructura y automatización',
      techStackTitle: 'Tecnologías Principales',
      highlightsTitle: 'Proyectos e Hitos Destacados',
      highlightsSubtitle: 'Sistemas verificables en producción y logros técnicos',
      viewProject: 'Visitar proyecto',
      experienceTitle: 'Experiencia y Credenciales',
      workHistoryTitle: 'Trayectoria en Yuvod',
      educationTitle: 'Formación Reglada',
      certificationsTitle: 'Certificaciones Técnicas',
    },
    specialties: [
      {
        id: 'backend',
        canonicalTitle: 'Backend Architecture',
        title: 'Arquitectura Backend',
        description:
          'Diseño y mantenimiento de arquitecturas altamente escalables y APIs robustas.',
      },
      {
        id: 'cloud',
        canonicalTitle: 'Cloud & DevOps',
        title: 'Cloud & DevOps',
        description:
          'Aprovisionamiento de infraestructura, contenedores y administración de servidores remotos.',
      },
      {
        id: 'automation',
        canonicalTitle: 'Process Automation & AI',
        title: 'Automatización de Procesos e IA',
        description:
          'Creación de flujos de trabajo inteligentes, sistemas multi-agente e integración de soluciones de IA.',
      },
      {
        id: 'mobile',
        canonicalTitle: 'Mobile Development',
        title: 'Desarrollo Móvil',
        description:
          'Desarrollo de aplicaciones nativas en Android desde cero con alto rendimiento.',
      },
    ],
    techCategories: [
      {
        id: 'backend-systems',
        label: 'Backend & Systems',
        items: ['Python', 'Java', 'Node.js'],
      },
      {
        id: 'cloud-devops',
        label: 'Cloud & DevOps',
        items: ['Docker', 'Linux', 'Bash'],
      },
      {
        id: 'frontend-mobile',
        label: 'Frontend & Mobile',
        items: ['TypeScript', 'React', 'Kotlin'],
      },
    ],
    highlights: [
      {
        id: 'docker-sentinel',
        canonicalTitle: 'Docker Sentinel',
        title: 'Docker Sentinel',
        subtitle: 'Auto-Healing Container Daemon',
        description:
          'Daemon ligero de monitorización y auto-recuperación de contenedores Docker con alertas en tiempo real.',
        imageKey: 'docker-sentinel',
        url: null,
      },
      {
        id: 'playaperello',
        canonicalTitle: 'playaperello.es',
        title: 'playaperello.es',
        subtitle: 'Predicción Marítima en VPS',
        description:
          'Sistema desplegado en servidor privado virtual para la predicción del estado del mar basado en datos meteorológicos locales.',
        imageKey: 'playaperello',
        url: 'https://playaperello.es',
      },
      {
        id: 'competitive-programming',
        canonicalTitle: 'Competitive Programming',
        title: 'Programación Competitiva',
        subtitle: 'Competitive Programming · OICV & HP CodeWars',
        description:
          'Reconocimientos en programación competitiva destacando el Top 15 en OICV y el 4.º puesto en HP CodeWars.',
        imageKey: 'hp',
        url: null,
      },
      {
        id: 'first-android-app',
        canonicalTitle: 'First Android App',
        title: 'Primera App en Android',
        subtitle: 'First Android App · Google Play Store',
        description:
          'Hito temprano de ingeniería con la publicación de su primera aplicación Android en Google Play Store a los 13 años.',
        imageKey: 'app',
        url: null,
      },
    ],
    experience: [
      {
        id: 'yuvod-swe',
        company: 'Yuvod',
        role: 'Software Engineer',
        employmentType: 'Tiempo parcial · Presencial',
        period: 'Feb 2026 - Actualidad',
        location: 'Comunidad Valenciana, España',
        description:
          'Diseño de software, arquitectura de plataforma e ingeniería de sistemas en producción.',
        accent: 'emerald',
      },
      {
        id: 'yuvod-sysadmin',
        company: 'Yuvod',
        role: 'Systems Administrator',
        employmentType: 'Prácticas · Presencial',
        period: 'Feb 2025 - Mar 2025',
        location: 'Comunidad Valenciana, España',
        description:
          'Gestión TI, administración de servidores Linux y automatización de infraestructura.',
        accent: 'emerald',
      },
    ],
    education: esEducation,
    certifications: esCertifications,
    credentials: buildCredentials(esEducation, esCertifications),
    contactModal: {
      title: 'Contacto Directo',
      subtitle: 'Envía un mensaje directo a ivanoliveradev@gmail.com',
      nameLabel: 'Nombre',
      namePlaceholder: 'Tu nombre o empresa',
      emailLabel: 'Email',
      emailPlaceholder: 'tu@correo.com',
      messageLabel: 'Mensaje',
      messagePlaceholder: 'Escribe tu consulta o propuesta profesional...',
      submitButton: 'Enviar Mensaje',
      submittingButton: 'Enviando...',
      successTitle: 'Mensaje enviado con éxito',
      successMessage: 'Gracias por tu mensaje. Te responderé lo antes posible.',
      errorTitle: 'Error al enviar el mensaje',
      errorMessage:
        'No se pudo completar el envío por red. Tus datos se han conservado o puedes escribir directamente por correo electrónico.',
      validationError: 'Por favor, completa nombre, email válido y mensaje sin dejarlos en blanco.',
      fallbackEmailLabel: 'Escribir directamente a ivanoliveradev@gmail.com',
      closeAria: 'Cerrar modal de contacto',
    },
    qrModal: {
      title: 'Código QR y Compartir',
      subtitle: 'Escanea el código o comparte el enlace directo de la tarjeta',
      qrAlt: 'Código QR hacia la tarjeta de visita de Iván Olivera González',
      copyButton: 'Copiar enlace',
      copiedButton: 'Enlace copiado',
      shareButton: 'Compartir tarjeta',
      shareTitle: 'Iván Olivera González — Software Engineer & Systems Specialist',
      shareText: 'Tarjeta de visita digital de Iván Olivera González',
      manualCopyHint: 'También puedes seleccionar y copiar el enlace manualmente.',
      closeAria: 'Cerrar modal de código QR',
    },
    footer: {
      copyright: 'Iván Olivera González. Todos los derechos reservados.',
      nfcTagline: 'Tarjeta Ejecutiva NFC · Valencia, España',
      dockAria: 'Barra de acciones rápidas',
    },
  },
  en: {
    header: {
      monogram: 'I. O.',
      statusLabel: 'Available · NFC Active',
      languageSelectorAria: 'Language selector',
      switchToEsAria: 'Switch language to Spanish',
      switchToEnAria: 'Switch language to English',
    },
    hero: {
      badge: 'EXECUTIVE DIGITAL CARD',
      fullName: AUTHORIZED_PROFILE.fullName,
      role: AUTHORIZED_PROFILE.role,
      location: AUTHORIZED_PROFILE.locationLabel,
      availability: 'Available in Valencia, Spain & Remote',
      stackLabel: 'Core Stack',
      languagesBadge: LANGUAGES_BADGE,
      bio: 'Software Developer and Systems Administrator passionate about clean software architecture, process automation, and scalable infrastructure. Building systems since age 12.',
      languagesLabel: 'Languages',
      spokenLanguages: AUTHORIZED_PROFILE.spokenLanguages,
      interactiveHint: 'Slide or tilt to inspect in 3D',
      cardAriaLabel: 'Interactive 3D business card of Iván Olivera González',
    },
    actions: {
      saveContact: 'Save Contact',
      saveContactSubtitle: 'Download vCard file (.vcf)',
      saveContactAria: 'Save Iván Olivera González contact to address book (vCard .vcf)',
      directContact: 'Direct Contact',
      directContactAria: 'Open direct contact form',
      email: 'Email',
      emailAria: 'Send email to ivanoliveradev@gmail.com',
      qrCode: 'QR Code',
      qrCodeAria: 'Show QR code and card sharing options',
      qrAria: 'Show QR code and card sharing options',
      portfolio: 'Web Portfolio',
      portfolioAria: 'Open full portfolio at ivanolivera.dev',
      linkedin: 'LinkedIn',
      linkedinAria: 'Open Iván Olivera González official LinkedIn profile',
      github: 'GitHub',
      githubAria: 'Open Iván Olivera González GitHub profile',
    },
    snapshot: {
      eyebrow: 'Current Executive Focus',
      company: 'Yuvod',
      roleBadge: 'Software Engineer @ Yuvod',
      headline: 'Software & Systems Engineering at Yuvod',
      summary:
        'Building backend integrations on an existing production platform, automating operational workflows, and managing systems infrastructure.',
      pillars: [
        {
          id: 'integrations',
          label: 'Platform Integrations',
          detail: 'Developing and integrating backend services on an existing platform.',
        },
        {
          id: 'automation',
          label: 'Process Automation',
          detail: 'Streamlining operational workflows, scripting, and internal tooling.',
        },
        {
          id: 'infrastructure',
          label: 'Systems Infrastructure',
          detail: 'Managing Docker containers, Linux servers, and reliable deployments.',
        },
      ],
      portfolioCtaLabel: 'Explore Full Portfolio (ivanolivera.dev)',
      portfolioCtaAria: 'Explore Iván Olivera González full portfolio at ivanolivera.dev',
    },
    sections: {
      specialtiesTitle: 'Core Competencies',
      specialtiesSubtitle: 'Software architecture, infrastructure & automation',
      techStackTitle: 'Core Technologies',
      highlightsTitle: 'Highlights & Achievements',
      highlightsSubtitle: 'Verifiable production systems and technical milestones',
      viewProject: 'Visit project',
      experienceTitle: 'Experience & Credentials',
      workHistoryTitle: 'Career at Yuvod',
      educationTitle: 'Academic Education',
      certificationsTitle: 'Technical Certifications',
    },
    specialties: [
      {
        id: 'backend',
        canonicalTitle: 'Backend Architecture',
        title: 'Backend Architecture',
        description:
          'Designing and maintaining highly scalable architectures and robust APIs.',
      },
      {
        id: 'cloud',
        canonicalTitle: 'Cloud & DevOps',
        title: 'Cloud & DevOps',
        description:
          'Infrastructure provisioning, container orchestration, and remote server management.',
      },
      {
        id: 'automation',
        canonicalTitle: 'Process Automation & AI',
        title: 'Process Automation & AI',
        description:
          'Building smart workflows, multi-agent systems, and integrating AI solutions.',
      },
      {
        id: 'mobile',
        canonicalTitle: 'Mobile Development',
        title: 'Mobile Development',
        description:
          'Developing performant native Android applications from scratch.',
      },
    ],
    techCategories: [
      {
        id: 'backend-systems',
        label: 'Backend & Systems',
        items: ['Python', 'Java', 'Node.js'],
      },
      {
        id: 'cloud-devops',
        label: 'Cloud & DevOps',
        items: ['Docker', 'Linux', 'Bash'],
      },
      {
        id: 'frontend-mobile',
        label: 'Frontend & Mobile',
        items: ['TypeScript', 'React', 'Kotlin'],
      },
    ],
    highlights: [
      {
        id: 'docker-sentinel',
        canonicalTitle: 'Docker Sentinel',
        title: 'Docker Sentinel',
        subtitle: 'Auto-Healing Container Daemon',
        description:
          'A lightweight Docker monitoring and auto-recovery daemon that restarts crashed containers and dispatches real-time alerts.',
        imageKey: 'docker-sentinel',
        url: null,
      },
      {
        id: 'playaperello',
        canonicalTitle: 'playaperello.es',
        title: 'playaperello.es',
        subtitle: 'VPS Sea Forecast System',
        description:
          'VPS-deployed system predicting sea conditions based on local meteorological data.',
        imageKey: 'playaperello',
        url: 'https://playaperello.es',
      },
      {
        id: 'competitive-programming',
        canonicalTitle: 'Competitive Programming',
        title: 'Competitive Programming',
        subtitle: 'OICV & HP CodeWars',
        description:
          'Competitive programming recognitions highlighting Top 15 in OICV and 4th place in HP CodeWars.',
        imageKey: 'hp',
        url: null,
      },
      {
        id: 'first-android-app',
        canonicalTitle: 'First Android App',
        title: 'First Android App',
        subtitle: 'Google Play Store Milestone',
        description:
          'Early engineering milestone publishing first native Android application on the Google Play Store at age 13.',
        imageKey: 'app',
        url: null,
      },
    ],
    experience: [
      {
        id: 'yuvod-swe',
        company: 'Yuvod',
        role: 'Software Engineer',
        employmentType: 'Part-time · On-site',
        period: 'Feb 2026 - Present',
        location: 'Valencia, Spain',
        description:
          'Software design, platform architecture, and production systems engineering.',
        accent: 'emerald',
      },
      {
        id: 'yuvod-sysadmin',
        company: 'Yuvod',
        role: 'Systems Administrator',
        employmentType: 'Internship · On-site',
        period: 'Feb 2025 - Mar 2025',
        location: 'Valencia, Spain',
        description:
          'IT management, Linux server administration, and infrastructure automation.',
        accent: 'emerald',
      },
    ],
    education: enEducation,
    certifications: enCertifications,
    credentials: buildCredentials(enEducation, enCertifications),
    contactModal: {
      title: 'Direct Contact',
      subtitle: 'Send a direct message to ivanoliveradev@gmail.com',
      nameLabel: 'Name',
      namePlaceholder: 'Your name or company',
      emailLabel: 'Email',
      emailPlaceholder: 'you@example.com',
      messageLabel: 'Message',
      messagePlaceholder: 'Write your inquiry or professional proposal...',
      submitButton: 'Send Message',
      submittingButton: 'Sending...',
      successTitle: 'Message sent successfully',
      successMessage: 'Thank you for reaching out. I will get back to you shortly.',
      errorTitle: 'Failed to send message',
      errorMessage:
        'A network error occurred. Your input has been preserved, or you can write directly via email.',
      validationError: 'Please fill in a valid name, email, and non-empty message.',
      fallbackEmailLabel: 'Write directly to ivanoliveradev@gmail.com',
      closeAria: 'Close contact modal',
    },
    qrModal: {
      title: 'QR Code & Share',
      subtitle: 'Scan the QR code or share the direct business card link',
      qrAlt: 'QR Code for Iván Olivera González digital business card',
      copyButton: 'Copy link',
      copiedButton: 'Link copied',
      shareButton: 'Share card',
      shareTitle: 'Iván Olivera González — Software Engineer & Systems Specialist',
      shareText: 'Digital business card of Iván Olivera González',
      manualCopyHint: 'You can also select and copy the link above manually.',
      closeAria: 'Close QR code modal',
    },
    footer: {
      copyright: 'Iván Olivera González. All rights reserved.',
      nfcTagline: 'Executive NFC Card · Valencia, España',
      dockAria: 'Quick actions dock',
    },
  },
};

export function getTranslations(language: Language): TranslationDictionary {
  return translations[language] ?? translations[DEFAULT_LANGUAGE];
}
