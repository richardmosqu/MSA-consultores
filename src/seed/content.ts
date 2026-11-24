// Contenido inicial tomado de docs/insumos/MSA_WEBSITE_secciones_y_textos.xlsx (24 nov 2026).
// Solo en español: las versiones EN / PT / IT se cargan después en el panel.

export const intro = {
  firma1:
    'En MSA Consultores creemos que las empresas necesitan más que asesoría: necesitan aliados estratégicos capaces de entender sus retos, fortalecer sus operaciones y acompañar su crecimiento con visión, estructura y confianza.',
  firma2:
    'Con más de 18 años de experiencia, nos hemos consolidado como una firma multidisciplinaria especializada en consultoría fiscal, financiera, legal, compliance y capital humano, brindando soluciones integrales tanto a nivel nacional como internacional.',
}

export const about = {
  historia:
    'MSA Consultores nace con el propósito de ofrecer servicios corporativos de alto nivel, integrando experiencia técnica, visión estratégica y un enfoque orientado a resultados. A lo largo de los años, la firma ha evolucionado hasta convertirse en un aliado empresarial para organizaciones de múltiples industrias, manteniendo siempre el compromiso con la excelencia, el cumplimiento y el desarrollo sostenible.',
  mision:
    'Brindar soluciones estratégicas e integrales que fortalezcan la operación, cumplimiento y crecimiento de nuestros clientes, a través de un equipo multidisciplinario comprometido con la excelencia, la confianza y la innovación empresarial.',
  vision:
    'Ser una firma consultora líder en Panamá y la región, reconocida por su capacidad estratégica, calidad de servicio y visión internacional, impulsando empresas más sólidas, organizadas y preparadas para los retos del futuro.',
  valores: [
    'Integridad y transparencia',
    'Excelencia profesional',
    'Compromiso con el cliente',
    'Innovación y mejora continua',
    'Trabajo en equipo',
    'Confidencialidad y confianza',
    'Desarrollo humano y profesional',
  ],
  presencia:
    'Contamos con operaciones en Ciudad de Panamá y Azuero, además de relaciones comerciales y consultorías desarrolladas en Brasil, Europa y otros mercados internacionales. Nuestro crecimiento refleja una visión empresarial orientada a la expansión, el fortalecimiento regional y la generación de valor estratégico para nuestros clientes.',
  cultura:
    'En MSA promovemos una cultura basada en el aprendizaje continuo, el crecimiento profesional y el trabajo colaborativo. Apostamos por el desarrollo de líderes preparados para responder a los cambios del entorno empresarial, fomentando espacios de capacitación, innovación y evolución constante.',
  filosofia:
    'Creemos en relaciones a largo plazo construidas sobre confianza, cercanía y resultados. Nuestro enfoque combina análisis estratégico, acompañamiento personalizado y una visión preventiva que permita a nuestros clientes tomar decisiones más seguras, eficientes y sostenibles.',
}

export const teamIntro =
  'Nuestro equipo está conformado por profesionales especializados en distintas áreas estratégicas, comprometidos con brindar soluciones integrales y generar valor real para cada cliente. La experiencia, preparación técnica y visión multidisciplinaria de nuestros colaboradores nos permite acompañar organizaciones de distintos sectores y niveles de complejidad.'

export const teamGroups = [
  {
    key: 'presidencia',
    name: 'Presidencia / VP',
    description:
      'Liderazgo estratégico orientado al crecimiento empresarial, fortalecimiento organizacional y desarrollo sostenible de la firma y sus clientes.',
  },
  {
    key: 'gerencias',
    name: 'Gerencias',
    description:
      'Profesionales especializados en la dirección y supervisión de proyectos estratégicos, garantizando cumplimiento, eficiencia y excelencia operativa.',
  },
  {
    key: 'consultores',
    name: 'Consultores',
    description:
      'Equipo multidisciplinario enfocado en análisis, acompañamiento técnico y desarrollo de soluciones adaptadas a las necesidades de cada cliente.',
  },
  {
    key: 'rrhh',
    name: 'RRHH',
    description:
      'Especialistas en gestión de talento, cultura organizacional, cumplimiento laboral y desarrollo estratégico de capital humano.',
  },
  {
    key: 'legal',
    name: 'Legal',
    description:
      'Profesionales enfocados en consultoría corporativa, tributaria y regulatoria, brindando acompañamiento jurídico integral a empresas y organizaciones.',
  },
  {
    key: 'compliance',
    name: 'Compliance',
    description:
      'Equipo orientado a la gestión de riesgos, cumplimiento corporativo y fortalecimiento de procesos internos bajo estándares de control y transparencia.',
  },
  {
    key: 'activos',
    name: 'Activos Productivos',
    description:
      'Especialistas en verificación, control y análisis de activos, enfocados en fortalecer la confiabilidad y eficiencia operativa de las organizaciones.',
  },
  {
    key: 'operaciones',
    name: 'Operaciones',
    description:
      'Especialistas en análisis financieros, fiscales, valuaciones, presupuestos, presentación de informes tributarios ante la DGI, presentación de declaraciones de renta y preparación de estados financieros.',
  },
] as const

// Perfiles provisionales tomados de las piezas "Meet our team" de Instagram.
// El bosquejo definitivo de perfiles (fotos y descripciones) lo envía MSA.
export const people = [
  { name: 'Roberto Villarreal', role: 'Gerente de Operaciones', group: 'gerencias', order: 10 },
  { name: 'Militza Carrera', role: 'Compliance Team Leader', group: 'compliance', order: 20 },
  { name: 'Astrid Rivera', role: 'RRHH Team', group: 'rrhh', order: 30 },
  { name: 'Isabella Cedeño', role: 'Financial Analyst', group: 'operaciones', order: 40 },
  { name: 'Génesis Díaz', role: 'Financial Analyst', group: 'operaciones', order: 50 },
] as const

export const servicesIntro =
  'Brindamos soluciones corporativas integrales diseñadas para fortalecer la operación, cumplimiento y crecimiento estratégico de las organizaciones, adaptándonos a las necesidades de cada industria y entorno empresarial.'

export const services = [
  {
    title: 'Fiscal y Tributario',
    slug: 'fiscal-y-tributario',
    icon: 'tax',
    summary:
      'Asesoramos a empresas en planificación fiscal, cumplimiento tributario y estrategias orientadas a minimizar riesgos y optimizar operaciones.',
  },
  {
    title: 'Auditoría',
    slug: 'auditoria',
    icon: 'audit',
    summary:
      'Desarrollamos procesos de auditoría financiera y operativa que fortalecen la transparencia, control y confiabilidad de la información empresarial.',
  },
  {
    title: 'Recursos Humanos',
    slug: 'recursos-humanos',
    icon: 'talent',
    summary:
      'Impulsamos soluciones estratégicas en gestión de talento, cumplimiento laboral, cultura organizacional y desarrollo empresarial.',
  },
  {
    title: 'Legal Corporativo',
    slug: 'legal-corporativo',
    icon: 'legal',
    summary:
      'Brindamos acompañamiento jurídico en materia corporativa, regulatoria y contractual, enfocado en la seguridad y sostenibilidad empresarial.',
  },
  {
    title: 'Compliance',
    slug: 'compliance',
    icon: 'compliance',
    summary:
      'Fortalecemos estructuras de cumplimiento y control interno para garantizar operaciones alineadas a normativas y buenas prácticas corporativas.',
  },
  {
    title: 'Activos Productivos',
    slug: 'activos-productivos',
    icon: 'building',
    summary:
      'Realizamos procesos de validación, control y análisis de activos orientados a mejorar la eficiencia operativa y financiera.',
  },
  {
    title: 'Finanzas y Consultoría Estratégica',
    slug: 'finanzas-y-consultoria-estrategica',
    icon: 'finance',
    summary:
      'Desarrollamos análisis financieros, proyecciones y estrategias orientadas al crecimiento sostenible y fortalecimiento empresarial.',
  },
] as const

export const casesIntro =
  'A lo largo de nuestra trayectoria, hemos acompañado empresas de distintas industrias en procesos de transformación, fortalecimiento organizacional y cumplimiento estratégico, generando soluciones adaptadas a cada necesidad. La confianza de nuestros clientes respalda nuestro compromiso con la excelencia, el acompañamiento estratégico y la generación de resultados sostenibles.'

export const testimonials = [
  {
    quote:
      'Nuestra relación con MSA Consultores mantiene un impacto positivo en la operación, en donde siempre prevalece el interés de la empresa y sus beneficiarios. Es una empresa proactiva que se mantiene informada día a día con los cambios en leyes y decretos para así dar una mejor asesoría.',
    author: 'Sofía Márquez',
    company: 'Thrifty Car Rental y afiliadas',
  },
  {
    quote:
      'Cuando MSA llegó a Concretex llegó un socio, una empresa que está para apoyarnos en lo que sea. Ahora las reuniones las espero con ansias y mi pensamiento sobre auditores externos dio un giro de 180°. Es realmente increíble trabajar con el equipo de MSA, los recomendaría con los ojos cerrados.',
    author: 'Rogelio Romero',
    company: 'Concretex, S.A.',
  },
]

export const culture = {
  kickoffs:
    'Semestralmente, realizamos encuentros corporativos con la participación de todo nuestro equipo, orientados al análisis y discusión de nuevas leyes, cambios regulatorios y casos de interés relevantes para nuestra práctica profesional. Estos espacios fomentan el intercambio de conocimientos, el debate técnico y la actualización continua de nuestros colaboradores, garantizando una visión alineada frente a los desafíos y oportunidades del entorno empresarial.\n\nAsimismo, aprovechamos estas reuniones para compartir los objetivos estratégicos de la firma, fortalecer nuestra cultura organizacional y comunicar las expectativas que nos permitirán seguir brindando un servicio de excelencia a nuestros clientes.',
  items: [
    {
      title: 'Capacitaciones',
      icon: 'audit',
      text: 'Promovemos el aprendizaje continuo mediante entrenamientos, workshops y actualizaciones técnicas nacionales e internacionales.',
    },
    {
      title: 'Eventos',
      icon: 'calendar',
      text: 'Impulsamos actividades corporativas que fortalecen la integración, liderazgo y conexión entre equipos.',
    },
    {
      title: 'Actividades internas',
      icon: 'talent',
      text: 'Generamos espacios que fomentan el bienestar, la colaboración y el sentido de pertenencia dentro de la organización.',
    },
    {
      title: 'Crecimiento del equipo',
      icon: 'finance',
      text: 'Apostamos por el desarrollo profesional de nuestros colaboradores, impulsando oportunidades de crecimiento y liderazgo.',
    },
    {
      title: 'Experiencias corporativas',
      icon: 'building',
      text: 'Construimos experiencias que reflejan nuestra cultura, visión empresarial y compromiso con la excelencia.',
    },
  ],
}

export const contact = {
  intro:
    'Estamos preparados para acompañarte en los retos estratégicos de tu empresa. Nuestro equipo multidisciplinario está disponible para brindarte asesoría especializada según las necesidades de tu organización.',
  officeName: 'Oficina principal — Ciudad de Panamá',
  address: 'Área Bancaria, Panamá\nP.H. Oceania Torre 2000, Piso 23, Oficina 23A',
  phones: ['+507 265-8227', '+507 6613-2498'],
  email: 'compliance@msaconsultores.com',
  // Por confirmar con MSA: asumimos que el celular es el WhatsApp de la firma.
  whatsapp: '50766132498',
  instagram: 'https://www.instagram.com/msaconsultores/',
  offices: [
    { name: 'Unidad Azuero', status: 'active', text: 'Atención y consultoría estratégica para empresas de la región de Azuero.' },
    {
      name: 'David, Chiriquí',
      status: 'soon',
      text: 'Continuamos expandiendo nuestra presencia para brindar un acompañamiento más cercano a nuestros clientes en el interior del país.',
    },
    {
      name: 'Consultoría Internacional',
      status: 'international',
      text: 'Relaciones comerciales y consultorías desarrolladas en Brasil, Europa y distintos mercados internacionales.',
    },
  ],
  departments: [
    { name: 'Presidencia Estratégica', shortName: 'Presidencia', icon: 'building', showOnHome: true },
    { name: 'Fiscal y Tributario', shortName: 'Fiscal', icon: 'tax', showOnHome: true },
    { name: 'Recursos Humanos', shortName: 'RRHH', icon: 'talent', showOnHome: true },
    { name: 'Legal Corporativo', shortName: 'Legal', icon: 'legal', showOnHome: true },
    { name: 'Finanzas y Auditoría', shortName: 'Finanzas', icon: 'finance', showOnHome: true },
    { name: 'Compliance', shortName: 'Compliance', icon: 'compliance', showOnHome: false },
  ],
}
