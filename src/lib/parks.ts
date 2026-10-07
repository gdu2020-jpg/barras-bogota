export type Localidad =
  | "Usaquén"
  | "Chapinero"
  | "Santa Fe"
  | "San Cristóbal"
  | "Tunjuelito"
  | "Bosa"
  | "Kennedy"
  | "Fontibón"
  | "Engativá"
  | "Suba"
  | "Barrios Unidos"
  | "Teusaquillo"
  | "Los Mártires"
  | "Antonio Nariño"
  | "Puente Aranda"
  | "Rafael Uribe Uribe";

export type StationKind = "calistenia" | "mixto" | "biosaludable";

export type EquipmentId =
  | "barras-altas"
  | "barras-medias"
  | "barras-bajas"
  | "paralelas"
  | "anillas"
  | "espaldera"
  | "dips"
  | "bancos"
  | "pesas"
  | "jaula"
  | "maquinas";

export type Lighting = "buena" | "regular" | "escasa";
export type Surface = "caucho" | "concreto" | "arena" | "mixto";
export type Crowd = "baja" | "media" | "alta";
export type Level = "inicio" | "intermedio" | "avanzado" | "todos";
export type Safety = "alta" | "media" | "precaucion";

export interface Scores {
  barras: number;
  variedad: number;
  comunidad: number;
  iluminacion: number;
  superficie: number;
  acceso: number;
}

export interface Park {
  id: string;
  name: string;
  shortName: string;
  city: string;
  localidad: string;
  address: string;
  lat: number;
  lng: number;
  kind: StationKind;
  image: string;
  score: number;
  scores: Scores;
  equipment: EquipmentId[];
  lighting: Lighting;
  surface: Surface;
  crowd: Crowd;
  hours: string;
  transmilenio: string[];
  bestFor: string[];
  level: Level;
  safety: Safety;
  summary: string;
  tips: string[];
  source: "curated" | "community";
  featured?: boolean;
}


export const EQUIPMENT_LABEL: Record<EquipmentId, string> = {
  "barras-altas": "Barras altas",
  "barras-medias": "Barras medias",
  "barras-bajas": "Barras bajas",
  paralelas: "Paralelas",
  anillas: "Anillas",
  espaldera: "Espaldera",
  dips: "Fondos",
  bancos: "Bancos",
  pesas: "Pesas fijas",
  jaula: "Jaula / rig",
  maquinas: "Máquinas",
};

export const KIND_LABEL: Record<StationKind, string> = {
  calistenia: "Calistenia",
  mixto: "Mixto",
  biosaludable: "Biosaludable",
};

export const LOCALIDADES: Localidad[] = [
  "Usaquén",
  "Chapinero",
  "Suba",
  "Engativá",
  "Barrios Unidos",
  "Teusaquillo",
  "Fontibón",
  "Kennedy",
  "Bosa",
  "Tunjuelito",
  "Puente Aranda",
  "Los Mártires",
  "Antonio Nariño",
  "Rafael Uribe Uribe",
  "San Cristóbal",
  "Santa Fe",
];

function indice(s: Scores): number {
  const raw =
    s.barras * 0.34 +
    s.variedad * 0.18 +
    s.comunidad * 0.16 +
    s.iluminacion * 0.1 +
    s.superficie * 0.12 +
    s.acceso * 0.1;
  return Math.round(raw * 10) / 10;
}

export const CITIES = [
  "Bogotá",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Cartagena",
  "Bucaramanga",
  "Pereira",
  "Manizales",
  "Cúcuta",
  "Ibagué",
  "Santa Marta",
  "Villavicencio",
  "Pasto",
  "Armenia",
  "Neiva",
] as const;

function park(
  p: Omit<Park, "score" | "city" | "source"> & {
    city?: string;
    source?: Park["source"];
  },
): Park {
  return {
    city: "Bogotá",
    source: "curated",
    ...p,
    score: indice(p.scores),
  };
}


export const PARKS: Park[] = [
  park({
    id: "boyaca-127",
    name: "Gimnasio Av. Boyacá con 127",
    shortName: "Boyacá 127",
    localidad: "Suba",
    address: "Avenida Boyacá con Calle 127, bajo los puentes",
    lat: 4.7114,
    lng: -74.074,
    kind: "mixto",
    image: "/parks/overpass.jpg",
    scores: {
      barras: 9.6,
      variedad: 9.8,
      comunidad: 9.5,
      iluminacion: 8.8,
      superficie: 9.4,
      acceso: 9.2,
    },
    equipment: [
      "barras-altas",
      "barras-medias",
      "paralelas",
      "dips",
      "bancos",
      "pesas",
      "maquinas",
      "jaula",
    ],
    lighting: "buena",
    surface: "caucho",
    crowd: "alta",
    hours: "Abierto 24 h · mejor luz 6:00–9:00 y 17:00–20:00",
    transmilenio: ["Suba — Av. Boyacá", "Pepe Sierra"],
    bestFor: ["comunidad", "pesas", "full body", "noche"],
    level: "todos",
    safety: "alta",
    featured: true,
    summary:
      "La estación más completa de la ciudad. El IDU armó un gimnasio real bajo el puente: zona de calistenia, musculación con pesas encadenadas, cardio y códigos QR en cada aparato. Es el spot que más se recomienda hoy en la escena.",
    tips: [
      "Llega temprano el fin de semana: se llena rápido.",
      "Las pesas van de 10 a 45 lb, fijas a la base.",
      "Hay bicicleteros y mesas si vas en grupo.",
    ],
  }),
  park({
    id: "virrey",
    name: "Parque El Virrey",
    shortName: "El Virrey",
    localidad: "Chapinero",
    address: "Calle 88, entre Carrera 7 y Autopista Norte",
    lat: 4.67424,
    lng: -74.0563,
    kind: "calistenia",
    image: "/parks/eucalyptus.jpg",
    scores: {
      barras: 9.2,
      variedad: 8.4,
      comunidad: 9.7,
      iluminacion: 8.2,
      superficie: 8.6,
      acceso: 9.4,
    },
    equipment: [
      "barras-altas",
      "barras-medias",
      "barras-bajas",
      "paralelas",
      "espaldera",
      "bancos",
    ],
    lighting: "buena",
    surface: "mixto",
    crowd: "alta",
    hours: "Parque 24 h · estaciones más activas 6:00–8:30 y 17:30–19:30",
    transmilenio: ["Virrey", "Calle 85"],
    bestFor: ["comunidad", "muscle-up", "principiantes", "encuentro"],
    level: "todos",
    safety: "alta",
    featured: true,
    summary:
      "El punto de encuentro clásico de la calistenia en Bogotá. Parque lineal con eucaliptos, varias alturas de barra y una comunidad que entrena todos los días. Menos máquinas que Boyacá 127, más cultura de calle.",
    tips: [
      "La zona amplia está entre Carrera 15 y la Autopista.",
      "Hay estaciones repartidas a lo largo del parque: camina hasta la que tenga barras altas.",
      "Domingo en ciclovía el parque se satura; mejor sábado temprano.",
    ],
  }),
  park({
    id: "rincon",
    name: "Gimnasio Av. El Rincón",
    shortName: "El Rincón",
    localidad: "Suba",
    address: "Avenida El Rincón, bajo puentes",
    lat: 4.7325,
    lng: -74.089,
    kind: "mixto",
    image: "/parks/overpass.jpg",
    scores: {
      barras: 9.1,
      variedad: 9.0,
      comunidad: 8.2,
      iluminacion: 8.4,
      superficie: 9.0,
      acceso: 8.3,
    },
    equipment: [
      "barras-altas",
      "barras-medias",
      "paralelas",
      "dips",
      "pesas",
      "maquinas",
    ],
    lighting: "buena",
    surface: "caucho",
    crowd: "media",
    hours: "Libre · cubierto parcial por el puente",
    transmilenio: ["21 Ángeles", "Suba Av. Boyacá"],
    bestFor: ["barras", "lluvia", "pesas"],
    level: "intermedio",
    safety: "alta",
    featured: true,
    summary:
      "Ocho barras de calistenia y diecinueve máquinas complementarias, instaladas por el IDU bajo los puentes de El Rincón. Menos famoso que la 127, casi el mismo nivel de estación.",
    tips: [
      "El techo del puente cubre buena parte del módulo: útil en lluvia.",
      "Combínalo con Boyacá 127 si haces una ruta norte.",
    ],
  }),
  park({
    id: "nacional",
    name: "Campus Universidad Nacional",
    shortName: "La Nacho",
    localidad: "Teusaquillo",
    address: "Carrera 30 con Calle 45, campus central",
    lat: 4.6378,
    lng: -74.0839,
    kind: "calistenia",
    image: "/parks/eucalyptus.jpg",
    scores: {
      barras: 8.9,
      variedad: 8.2,
      comunidad: 9.3,
      iluminacion: 7.6,
      superficie: 8.0,
      acceso: 8.8,
    },
    equipment: [
      "barras-altas",
      "barras-medias",
      "paralelas",
      "espaldera",
      "dips",
      "bancos",
    ],
    lighting: "regular",
    surface: "concreto",
    crowd: "alta",
    hours: "Campus diurno · mejor entre semana 7:00–9:00 y 12:00–14:00",
    transmilenio: ["Universidades", "Calle 45"],
    bestFor: ["comunidad", "skills", "estudiantes"],
    level: "avanzado",
    safety: "media",
    summary:
      "Uno de los spots no oficiales más fuertes de la ciudad. La comunidad universitaria mantiene un nivel alto: muscle-ups, statics y rutinas largas. No es parque IDRD; entra como peatón por las porterías del campus.",
    tips: [
      "Respeta el campus: no es un parque público al uso.",
      "La zona deportiva al occidente concentra las barras.",
      "Fines de semana hay menos gente y menos control de acceso.",
    ],
  }),
  park({
    id: "sirena",
    name: "Módulo Av. La Sirena",
    shortName: "La Sirena",
    localidad: "Usaquén",
    address: "Avenida La Sirena (Calle 153)",
    lat: 4.739,
    lng: -74.071,
    kind: "calistenia",
    image: "/parks/rings.jpg",
    scores: {
      barras: 9.0,
      variedad: 8.6,
      comunidad: 7.8,
      iluminacion: 8.0,
      superficie: 8.8,
      acceso: 8.4,
    },
    equipment: ["barras-altas", "barras-medias", "anillas", "paralelas", "dips"],
    lighting: "buena",
    surface: "caucho",
    crowd: "media",
    hours: "Libre · módulo compacto",
    transmilenio: ["Calle 146", "Pepe Sierra"],
    bestFor: ["anillas", "skills", "compacto"],
    level: "intermedio",
    safety: "alta",
    featured: true,
    summary:
      "Módulo compacto de barras y anillas sobre la Avenida La Sirena. Pista corta y densa: si entrenas con anillas en Bogotá, este es de los pocos sitios públicos donde no tienes que llevar las tuyas.",
    tips: [
      "Las anillas se ocupan rápido; lleva las propias por si acaso.",
      "El módulo es pequeño: mal sitio para grupos grandes.",
    ],
  }),
  park({
    id: "tunal",
    name: "Parque Metropolitano El Tunal",
    shortName: "El Tunal",
    localidad: "Tunjuelito",
    address: "Calle 48B Sur # 22A-70",
    lat: 4.572,
    lng: -74.1319,
    kind: "mixto",
    image: "/parks/box.jpg",
    scores: {
      barras: 8.4,
      variedad: 9.2,
      comunidad: 8.4,
      iluminacion: 8.5,
      superficie: 8.6,
      acceso: 8.8,
    },
    equipment: [
      "barras-altas",
      "paralelas",
      "jaula",
      "pesas",
      "bancos",
      "maquinas",
    ],
    lighting: "buena",
    surface: "mixto",
    crowd: "alta",
    hours: "Parque 5:00–20:00 · box Cross Hiit según programación IDRD",
    transmilenio: ["Portal Tunal"],
    bestFor: ["hiit", "pesas", "sur", "grupos"],
    level: "todos",
    safety: "alta",
    summary:
      "El primer parque con contenedor Cross Hiit del IDRD. Combina gimnasio al aire libre, jaula y zona de pesas rusas / barras. Referente del sur y muy bien conectado por el Portal Tunal.",
    tips: [
      "El box no sustituye las barras clásicas: recorre el parque.",
      "Hay biblioteca y lagos: útil si vas con familia.",
    ],
  }),
  park({
    id: "atahualpa",
    name: "Parque Zonal Atahualpa",
    shortName: "Atahualpa",
    localidad: "Fontibón",
    address: "Carrera 116 entre Calles 36 y 39",
    lat: 4.6688,
    lng: -74.1465,
    kind: "calistenia",
    image: "/parks/zonal.jpg",
    scores: {
      barras: 8.6,
      variedad: 7.8,
      comunidad: 8.0,
      iluminacion: 7.4,
      superficie: 7.8,
      acceso: 7.6,
    },
    equipment: [
      "barras-altas",
      "barras-bajas",
      "paralelas",
      "bancos",
      "dips",
    ],
    lighting: "regular",
    surface: "concreto",
    crowd: "media",
    hours: "Parque diurno · mejor 6:00–8:00",
    transmilenio: ["Modelia", "Portal Eldorado"],
    bestFor: ["street workout", "paralelas", "occidente"],
    level: "intermedio",
    safety: "media",
    summary:
      "Street workout clásico: dos barras altas, barras bajas para flexiones, bancos inclinados y paralelas. Junto a canchas de fútbol y baloncesto. Un estándar de lo que debería ser un parque zonal para calistenia.",
    tips: [
      "También tiene box Cross Hiit del IDRD.",
      "Lleva magnesio: el concreto desgasta el agarre.",
    ],
  }),
  park({
    id: "lombardia",
    name: "Parque Lombardía",
    shortName: "Lombardía",
    localidad: "Suba",
    address: "Calle 143 # 109",
    lat: 4.74716,
    lng: -74.09949,
    kind: "mixto",
    image: "/parks/zonal.jpg",
    scores: {
      barras: 8.3,
      variedad: 8.7,
      comunidad: 7.6,
      iluminacion: 7.5,
      superficie: 8.0,
      acceso: 7.7,
    },
    equipment: [
      "barras-altas",
      "paralelas",
      "dips",
      "bancos",
      "maquinas",
      "pesas",
    ],
    lighting: "regular",
    surface: "mixto",
    crowd: "media",
    hours: "Libre · barrio residencial",
    transmilenio: ["Suba Calle 146"],
    bestFor: ["pierna", "dominadas lastradas", "barrio"],
    level: "todos",
    safety: "alta",
    summary:
      "Complejo de barras con prensa de pierna, pectoral, torres de abdomen y una estación para dominadas lastradas. Más gym de barrio que spot de skills, pero el equipo es serio.",
    tips: [
      "Buena opción si vives en Suba y no quieres cruzar a la 127.",
      "Las máquinas de pierna son raras en parques: aprovéchalas.",
    ],
  }),
  park({
    id: "novios",
    name: "Parque de los Novios",
    shortName: "Los Novios",
    localidad: "Barrios Unidos",
    address: "Avenida Calle 63 con Carrera 36A",
    lat: 4.6569,
    lng: -74.0785,
    kind: "calistenia",
    image: "/parks/lake.jpg",
    scores: {
      barras: 8.1,
      variedad: 7.6,
      comunidad: 8.5,
      iluminacion: 8.6,
      superficie: 8.2,
      acceso: 9.0,
    },
    equipment: [
      "barras-altas",
      "paralelas",
      "barras-bajas",
      "bancos",
      "maquinas",
    ],
    lighting: "buena",
    surface: "caucho",
    crowd: "alta",
    hours: "Parque 5:00–20:00",
    transmilenio: ["Movistar Arena", "Calle 63"],
    bestFor: ["amanecer", "lago", "principiantes"],
    level: "todos",
    safety: "alta",
    summary:
      "Estación junto al lago, con buena iluminación y mucho tránsito. No es el rig más técnico, pero el entorno invita a entrenar seguido. Ideal para quien vive en Barrios Unidos o Teusaquillo.",
    tips: [
      "El lago se llena de runners: calienta en las barras, no en el andén.",
      "Hay biosaludables y barras; prioriza el módulo de acero, no el de adultos mayores.",
    ],
  }),
  park({
    id: "fontanar",
    name: "CEFE Fontanar del Río",
    shortName: "Fontanar",
    localidad: "Suba",
    address: "Fontanar del Río, Suba norte",
    lat: 4.7618,
    lng: -74.0835,
    kind: "mixto",
    image: "/parks/box.jpg",
    scores: {
      barras: 8.0,
      variedad: 8.8,
      comunidad: 7.8,
      iluminacion: 8.7,
      superficie: 8.8,
      acceso: 7.5,
    },
    equipment: ["barras-altas", "jaula", "pesas", "paralelas", "maquinas"],
    lighting: "buena",
    surface: "caucho",
    crowd: "media",
    hours: "Parque libre · CEFE con reserva para polideportivo",
    transmilenio: ["Portal 170"],
    bestFor: ["hiit", "norte", "instalaciones"],
    level: "todos",
    safety: "alta",
    summary:
      "Centro de Felicidad con box Cross Hiit al aire libre. La estación de calistenia es sólida y el predio está cuidado. Útil si ya usas el CEFE o vives en el extremo norte de Suba.",
    tips: [
      "El box es distinto al gimnasio interior de pago.",
      "Combina con San José de Bavaria si haces un loop norte.",
    ],
  }),
  park({
    id: "san-andres",
    name: "Parque San Andrés",
    shortName: "San Andrés",
    localidad: "Engativá",
    address: "Calle 80 con Carrera 104",
    lat: 4.6865,
    lng: -74.126,
    kind: "mixto",
    image: "/parks/box.jpg",
    scores: {
      barras: 7.9,
      variedad: 8.5,
      comunidad: 8.0,
      iluminacion: 8.2,
      superficie: 8.3,
      acceso: 8.6,
    },
    equipment: ["barras-altas", "paralelas", "jaula", "pesas", "maquinas"],
    lighting: "buena",
    surface: "mixto",
    crowd: "alta",
    hours: "Parque 5:00–20:00",
    transmilenio: ["Portal 80", "Minuto de Dios"],
    bestFor: ["hiit", "engativá", "grupos"],
    level: "todos",
    safety: "alta",
    summary:
      "Parque grande de Engativá con box Cross Hiit, gimnasio al aire libre y mucha vida de barrio. Estación correcta, acceso excelente por el Portal 80.",
    tips: [
      "Los fines de semana hay clases y torneos: llega antes de las 8.",
    ],
  }),
  park({
    id: "gaitana",
    name: "Parque La Gaitana",
    shortName: "La Gaitana",
    localidad: "Suba",
    address: "Carrera 116 con Calle 132",
    lat: 4.7345,
    lng: -74.1085,
    kind: "mixto",
    image: "/parks/zonal.jpg",
    scores: {
      barras: 8.0,
      variedad: 7.7,
      comunidad: 7.9,
      iluminacion: 7.2,
      superficie: 7.6,
      acceso: 7.8,
    },
    equipment: ["barras-altas", "paralelas", "bancos", "maquinas"],
    lighting: "regular",
    surface: "concreto",
    crowd: "media",
    hours: "Parque diurno",
    transmilenio: ["21 Ángeles"],
    bestFor: ["barrio", "principiantes"],
    level: "inicio",
    safety: "media",
    summary:
      "Zonal de Suba con gimnasio IDRD y barras suficientes para una rutina completa de empuje y jalón. Sin anillas ni jaula, pero constante y de barrio.",
    tips: ["Mejor en la mañana; la iluminación nocturna es justa."],
  }),
  park({
    id: "simon-bolivar",
    name: "Parque Metropolitano Simón Bolívar",
    shortName: "Simón Bolívar",
    localidad: "Teusaquillo",
    address: "Calle 63 # 48-17, portería 4",
    lat: 4.6575,
    lng: -74.0936,
    kind: "mixto",
    image: "/parks/metro.jpg",
    scores: {
      barras: 7.6,
      variedad: 7.4,
      comunidad: 8.2,
      iluminacion: 7.8,
      superficie: 7.5,
      acceso: 9.0,
    },
    equipment: ["barras-altas", "paralelas", "bancos", "maquinas"],
    lighting: "regular",
    surface: "mixto",
    crowd: "alta",
    hours: "6:00–18:00 (puede variar por eventos)",
    transmilenio: ["Simón Bolívar"],
    bestFor: ["correr + barras", "espacio", "domingo"],
    level: "todos",
    safety: "alta",
    summary:
      "El parque más grande de Bogotá. Las estaciones están dispersas: no esperes un street workout park denso, sí un lugar para combinar carrera, barras y espacio. Cierra más temprano que otros.",
    tips: [
      "Entra por portería 4 si buscas el gimnasio al aire libre.",
      "Confirma horarios: hay cierres por conciertos.",
    ],
  }),
  park({
    id: "timiza",
    name: "Parque Metropolitano Timiza",
    shortName: "Timiza",
    localidad: "Kennedy",
    address: "Carrera 72 / Calle 40H Sur",
    lat: 4.6115,
    lng: -74.157,
    kind: "mixto",
    image: "/parks/metro.jpg",
    scores: {
      barras: 7.7,
      variedad: 7.6,
      comunidad: 7.8,
      iluminacion: 7.4,
      superficie: 7.5,
      acceso: 8.0,
    },
    equipment: ["barras-altas", "paralelas", "bancos", "maquinas"],
    lighting: "regular",
    surface: "mixto",
    crowd: "media",
    hours: "Parque 5:00–20:00",
    transmilenio: ["Timiza", "Patio Bonito"],
    bestFor: ["kennedy", "espacio"],
    level: "todos",
    safety: "media",
    summary:
      "Metropolitano del sur-occidente con gimnasio IDRD, lagos y canchas. Estación honesta para quien vive en Kennedy y no quiere cruzar la ciudad.",
    tips: ["Evita la noche cerrada; entrena con luz."],
  }),
  park({
    id: "mutis",
    name: "Gimnasio Av. Mutis",
    shortName: "Av. Mutis",
    localidad: "Engativá",
    address: "Avenida Mutis (Calle 63), módulo IDU",
    lat: 4.6765,
    lng: -74.0995,
    kind: "mixto",
    image: "/parks/overpass.jpg",
    scores: {
      barras: 7.4,
      variedad: 8.4,
      comunidad: 7.2,
      iluminacion: 8.0,
      superficie: 8.6,
      acceso: 8.5,
    },
    equipment: ["barras-altas", "paralelas", "maquinas", "bancos"],
    lighting: "buena",
    surface: "caucho",
    crowd: "media",
    hours: "Libre · 17 máquinas de fuerza y 7 biosaludables",
    transmilenio: ["Avenida 68", "Carrera 53"],
    bestFor: ["maquinas", "fuerza", "paso"],
    level: "todos",
    safety: "alta",
    summary:
      "Módulo IDU sobre la avenida Mutis: diecisiete máquinas de fuerza y movilidad más biosaludables. Más musculación que skills, útil como estación de paso entre Engativá y Barrios Unidos.",
    tips: ["Si buscas muscle-up, ve a Los Novios o a la Nacional."],
  }),
  park({
    id: "villa-luz",
    name: "Parque Villa Luz",
    shortName: "Villa Luz",
    localidad: "Engativá",
    address: "Carrera 77A con Calle 64B",
    lat: 4.686,
    lng: -74.1085,
    kind: "calistenia",
    image: "/parks/zonal.jpg",
    scores: {
      barras: 8.0,
      variedad: 7.2,
      comunidad: 7.5,
      iluminacion: 7.0,
      superficie: 7.3,
      acceso: 8.2,
    },
    equipment: ["barras-altas", "paralelas", "bancos"],
    lighting: "regular",
    surface: "concreto",
    crowd: "media",
    hours: "Parque diurno",
    transmilenio: ["Minuto de Dios", "Avenida 68"],
    bestFor: ["dominadas", "barrio"],
    level: "intermedio",
    safety: "media",
    summary:
      "Zonal de Engativá con barras horizontales y banca para abdomen. Spot de barrio, sin lujos, suficiente para una sesión de jalón y fondos.",
    tips: ["Revisa el agarre: el revestimiento varía según el mantenimiento."],
  }),
  park({
    id: "sauzalito",
    name: "Parque Sauzalito",
    shortName: "Sauzalito",
    localidad: "Kennedy",
    address: "Diagonal 22B # 68D-43",
    lat: 4.6275,
    lng: -74.137,
    kind: "mixto",
    image: "/parks/box.jpg",
    scores: {
      barras: 7.6,
      variedad: 8.2,
      comunidad: 7.4,
      iluminacion: 7.6,
      superficie: 7.8,
      acceso: 7.6,
    },
    equipment: ["barras-altas", "paralelas", "jaula", "pesas", "maquinas"],
    lighting: "regular",
    surface: "mixto",
    crowd: "media",
    hours: "Parque diurno · box Cross Hiit IDRD",
    transmilenio: ["Marsella", "Carrera 68"],
    bestFor: ["hiit", "kennedy"],
    level: "todos",
    safety: "media",
    summary:
      "Zonal de Kennedy con contenedor Cross Hiit. Buena variedad para un parque de escala media, menos comunidad de calistenia que El Tunal.",
    tips: ["Pregunta al operador del box los horarios de práctica libre."],
  }),
  park({
    id: "nueva-autopista",
    name: "Parque Nueva Autopista",
    shortName: "Nueva Autopista",
    localidad: "Usaquén",
    address: "Transversal 34A y Avenida 13 con Diagonal 139A",
    lat: 4.7255,
    lng: -74.0465,
    kind: "biosaludable",
    image: "/parks/eucalyptus.jpg",
    scores: {
      barras: 6.8,
      variedad: 6.6,
      comunidad: 7.0,
      iluminacion: 8.0,
      superficie: 7.8,
      acceso: 8.4,
    },
    equipment: ["paralelas", "maquinas", "bancos"],
    lighting: "buena",
    surface: "caucho",
    crowd: "media",
    hours: "Parque 24 h",
    transmilenio: ["Alcalá", "Calle 142"],
    bestFor: ["cardio", "movilidad", "norte"],
    level: "inicio",
    safety: "alta",
    summary:
      "Gimnasio IDRD de Usaquén, más biosaludable que street workout. Paralelas y máquinas de movilidad en un parque cuidado. No es el sitio para muscle-up; sí para un circuito de acondicionamiento.",
    tips: ["Si quieres barras altas de verdad, sigue a La Sirena o a Boyacá 127."],
  }),
  park({
    id: "san-cristobal",
    name: "Parque San Cristóbal",
    shortName: "San Cristóbal",
    localidad: "San Cristóbal",
    address: "Calle 13 Sur # 1-70 Este",
    lat: 4.5718,
    lng: -74.0792,
    kind: "mixto",
    image: "/parks/metro.jpg",
    scores: {
      barras: 7.5,
      variedad: 7.3,
      comunidad: 7.4,
      iluminacion: 7.0,
      superficie: 7.2,
      acceso: 7.6,
    },
    equipment: ["barras-altas", "paralelas", "maquinas", "bancos"],
    lighting: "regular",
    surface: "mixto",
    crowd: "media",
    hours: "Parque diurno · CEFE San Cristóbal cerca",
    transmilenio: ["Horto", "Bicentenario"],
    bestFor: ["oriente", "espacio"],
    level: "todos",
    safety: "media",
    summary:
      "Metropolitano del oriente con gimnasio al aire libre y CEFE a un lado. La estación cubre lo básico; el valor extra es el predio y las vistas hacia los cerros.",
    tips: ["Entrena con luz. Combina con una caminata por los cerros."],
  }),
  park({
    id: "salitre",
    name: "Parque Recreodeportivo El Salitre",
    shortName: "El Salitre",
    localidad: "Barrios Unidos",
    address: "Avenida 68 con Calle 63, costado norte",
    lat: 4.6655,
    lng: -74.0878,
    kind: "mixto",
    image: "/parks/metro.jpg",
    scores: {
      barras: 7.2,
      variedad: 7.0,
      comunidad: 7.6,
      iluminacion: 8.4,
      superficie: 7.4,
      acceso: 8.8,
    },
    equipment: ["barras-altas", "paralelas", "bancos", "maquinas"],
    lighting: "buena",
    surface: "mixto",
    crowd: "alta",
    hours: "6:00–22:00 en zonas iluminadas",
    transmilenio: ["Salitre El Greco"],
    bestFor: ["noche", "correr + barras"],
    level: "todos",
    safety: "alta",
    summary:
      "Predio recreodeportivo con buena iluminación y horarios extendidos. Las barras no son de primer nivel, pero puedes entrenar más tarde que en Simón Bolívar.",
    tips: ["Úsalo si entrenas después de las 18:00 y vives en el centro-norte."],
  }),
  park({
    id: "bosa-esperanza",
    name: "Parque Bosa La Esperanza",
    shortName: "La Esperanza",
    localidad: "Bosa",
    address: "Bosa La Esperanza",
    lat: 4.622,
    lng: -74.19,
    kind: "mixto",
    image: "/parks/box.jpg",
    scores: {
      barras: 7.5,
      variedad: 8.3,
      comunidad: 7.6,
      iluminacion: 7.3,
      superficie: 7.7,
      acceso: 7.2,
    },
    equipment: ["barras-altas", "jaula", "pesas", "paralelas", "maquinas"],
    lighting: "regular",
    surface: "mixto",
    crowd: "media",
    hours: "Parque diurno · box Cross Hiit IDRD",
    transmilenio: ["Portal Américas", "Bosa"],
    bestFor: ["hiit", "bosa", "sur-occidente"],
    level: "todos",
    safety: "media",
    summary:
      "Uno de los siete boxes Cross Hiit de la ciudad. Referente de Bosa para entrenamiento funcional y calistenia, lejos del centro-norte.",
    tips: ["Confirma el estado del contenedor: es de los módulos más usados."],
  }),
  park({
    id: "ciudad-montes",
    name: "Parque Ciudad Montes",
    shortName: "Ciudad Montes",
    localidad: "Puente Aranda",
    address: "Calle 10 Sur # 39-29",
    lat: 4.6025,
    lng: -74.1135,
    kind: "biosaludable",
    image: "/parks/zonal.jpg",
    scores: {
      barras: 6.6,
      variedad: 6.4,
      comunidad: 7.1,
      iluminacion: 6.8,
      superficie: 7.0,
      acceso: 7.8,
    },
    equipment: ["paralelas", "maquinas", "bancos"],
    lighting: "escasa",
    surface: "concreto",
    crowd: "media",
    hours: "Parque diurno",
    transmilenio: ["NQS Calle 30 Sur", "SENA"],
    bestFor: ["movilidad", "barrio"],
    level: "inicio",
    safety: "media",
    summary:
      "Gimnasio IDRD de Puente Aranda, pensado más para acondicionamiento general que para street workout. Entra en el mapa para no dejar el occidente-centro vacío.",
    tips: ["Si buscas barras altas, ve a Atahualpa o a la Nacional."],
  }),
  park({
    id: "deseos",
    name: "Parque de los Deseos",
    shortName: "Los Deseos",
    city: "Medellín",
    localidad: "Boston",
    address: "Carrera 52 con Calle 71, junto al Planetario",
    lat: 6.2686,
    lng: -75.5654,
    kind: "calistenia",
    image: "/parks/metro.jpg",
    scores: {
      barras: 8.2,
      variedad: 7.6,
      comunidad: 8.8,
      iluminacion: 8.4,
      superficie: 8.0,
      acceso: 9.0,
    },
    equipment: ["barras-altas", "paralelas", "barras-bajas", "bancos"],
    lighting: "buena",
    surface: "concreto",
    crowd: "alta",
    hours: "Parque diurno y noche iluminada",
    transmilenio: ["Universidad (Metro)"],
    bestFor: ["comunidad", "skills", "medellín"],
    level: "todos",
    safety: "alta",
    summary:
      "Punto de encuentro de calistenia en Medellín, al lado del Planetario. Menos rig que un park dedicado, mucha comunidad y buen acceso por Metro.",
    tips: ["El piso es duro: lleva muñequeras si haces handstand."],
  }),
  park({
    id: "atanasio",
    name: "Unidad Deportiva Atanasio Girardot",
    shortName: "Atanasio",
    city: "Medellín",
    localidad: "Estadio",
    address: "Carrera 74 con Calle 48, Medellín",
    lat: 6.2567,
    lng: -75.5902,
    kind: "mixto",
    image: "/parks/box.jpg",
    scores: {
      barras: 8.0,
      variedad: 8.4,
      comunidad: 8.0,
      iluminacion: 8.6,
      superficie: 8.2,
      acceso: 8.8,
    },
    equipment: ["barras-altas", "paralelas", "jaula", "bancos", "maquinas"],
    lighting: "buena",
    surface: "mixto",
    crowd: "alta",
    hours: "Complejo deportivo · mejor 6:00–9:00 y 17:00–20:00",
    transmilenio: ["Estadio (Metro)"],
    bestFor: ["volumen", "grupos", "noche"],
    level: "todos",
    safety: "alta",
    summary:
      "El complejo deportivo más grande de Medellín. Estaciones al aire libre, espacio para calentar y Metro encima. Complemento natural de Los Deseos.",
    tips: ["Confirma accesos los días de partido."],
  }),
  park({
    id: "ingenio",
    name: "Parque del Ingenio",
    shortName: "El Ingenio",
    city: "Cali",
    localidad: "El Ingenio",
    address: "Carrera 80 con Calle 13, Cali",
    lat: 3.3754,
    lng: -76.5308,
    kind: "mixto",
    image: "/parks/zonal.jpg",
    scores: {
      barras: 7.8,
      variedad: 7.5,
      comunidad: 7.9,
      iluminacion: 7.4,
      superficie: 7.6,
      acceso: 8.0,
    },
    equipment: ["barras-altas", "paralelas", "bancos", "maquinas"],
    lighting: "regular",
    surface: "mixto",
    crowd: "media",
    hours: "Parque diurno",
    transmilenio: ["MIO — El Ingenio"],
    bestFor: ["cali", "barrio"],
    level: "todos",
    safety: "media",
    summary:
      "Parque zonal del sur de Cali con barras y gimnasio al aire libre. Base para quien vive lejos del centro; la comunidad puede completar el mapa vallecaucano.",
    tips: ["Entrena con luz. Aporta si conoces un rig mejor en tu barrio."],
  }),
  park({
    id: "boulevard-rio",
    name: "Boulevard del Río",
    shortName: "Boulevard del Río",
    city: "Cali",
    localidad: "Centro",
    address: "Avenida Colombia, orilla del río Cali",
    lat: 3.4516,
    lng: -76.5319,
    kind: "calistenia",
    image: "/parks/lake.jpg",
    scores: {
      barras: 7.6,
      variedad: 7.0,
      comunidad: 8.2,
      iluminacion: 8.5,
      superficie: 7.4,
      acceso: 9.0,
    },
    equipment: ["barras-altas", "paralelas", "bancos"],
    lighting: "buena",
    surface: "concreto",
    crowd: "alta",
    hours: "Paseo 24 h · mejor 6:00–8:00",
    transmilenio: ["MIO — Centro"],
    bestFor: ["amanecer", "carrera + barras"],
    level: "todos",
    safety: "media",
    summary:
      "Estaciones repartidas a lo largo del bulevar. No es un street workout park denso, sí un lugar para entrenar al aire libre en el centro de Cali.",
    tips: ["Camina el tramo: las barras no están todas juntas."],
  }),
  park({
    id: "venezuela",
    name: "Parque Venezuela",
    shortName: "Venezuela",
    city: "Barranquilla",
    localidad: "Villa Country",
    address: "Carrera 51B con Calle 82, Barranquilla",
    lat: 11.0112,
    lng: -74.8074,
    kind: "mixto",
    image: "/parks/zonal.jpg",
    scores: {
      barras: 7.7,
      variedad: 7.4,
      comunidad: 7.8,
      iluminacion: 7.6,
      superficie: 7.5,
      acceso: 8.2,
    },
    equipment: ["barras-altas", "paralelas", "bancos", "maquinas"],
    lighting: "regular",
    surface: "mixto",
    crowd: "media",
    hours: "Parque diurno",
    transmilenio: ["Transmetro — Villa Country"],
    bestFor: ["costa", "barrio"],
    level: "todos",
    safety: "media",
    summary:
      "Referente de entrenamiento al aire libre en el norte de Barranquilla. La escena costeña puede sumar más spots desde Aportar.",
    tips: ["El calor manda: madruga o espera el viento de la tarde."],
  }),
  park({
    id: "ninos-bga",
    name: "Parque de los Niños",
    shortName: "Parque de los Niños",
    city: "Bucaramanga",
    localidad: "Cabecera",
    address: "Carrera 33 con Calle 42, Bucaramanga",
    lat: 7.1194,
    lng: -73.1224,
    kind: "calistenia",
    image: "/parks/eucalyptus.jpg",
    scores: {
      barras: 7.9,
      variedad: 7.3,
      comunidad: 8.0,
      iluminacion: 7.8,
      superficie: 7.6,
      acceso: 8.4,
    },
    equipment: ["barras-altas", "paralelas", "espaldera", "bancos"],
    lighting: "buena",
    surface: "concreto",
    crowd: "alta",
    hours: "Parque 5:00–20:00",
    transmilenio: ["Metrolínea — Cabecera"],
    bestFor: ["santander", "comunidad"],
    level: "todos",
    safety: "alta",
    summary:
      "Pulmón de Cabecera con barras y mucho tráfico de deportistas. Punto de partida para mapear Bucaramanga con aportes de la comunidad.",
    tips: ["Fines de semana se llena; llega temprano."],
  }),
];


export interface Circuit {
  id: string;
  name: string;
  area: string;
  blurb: string;
  parkIds: string[];
  km: number;
  duration: string;
}

export const CIRCUITS: Circuit[] = [
  {
    id: "norte",
    name: "Eje norte",
    area: "Suba · Usaquén · Chapinero",
    blurb:
      "Las tres estaciones más técnicas del norte: el gimnasio de la 127, anillas en La Sirena y la comunidad de El Virrey.",
    parkIds: ["boyaca-127", "sirena", "virrey"],
    km: 9.2,
    duration: "media mañana",
  },
  {
    id: "centro",
    name: "Eje centro",
    area: "Teusaquillo · Barrios Unidos",
    blurb:
      "Campus de la Nacional, lago de Los Novios y el pulmón de Simón Bolívar. Skills, volumen y carrera.",
    parkIds: ["nacional", "novios", "simon-bolivar"],
    km: 4.8,
    duration: "un bloque de 3 h",
  },
  {
    id: "occidente",
    name: "Eje occidente",
    area: "Fontibón · Engativá",
    blurb:
      "Street workout de Atahualpa, box de San Andrés y barras de Villa Luz. Ruta de barrio, sin cruzar al norte.",
    parkIds: ["atahualpa", "san-andres", "villa-luz"],
    km: 6.4,
    duration: "mañana",
  },
  {
    id: "sur",
    name: "Eje sur",
    area: "Tunjuelito · Kennedy · Bosa",
    blurb:
      "El Tunal como ancla, Timiza para el volumen y La Esperanza si cierras en Bosa. Los boxes Cross Hiit del sur.",
    parkIds: ["tunal", "timiza", "bosa-esperanza"],
    km: 11.5,
    duration: "día completo",
  },
];

export function getPark(id: string, list: Park[] = PARKS): Park | undefined {
  return list.find((p) => p.id === id);
}

export function nearbyParks(park: Park, list: Park[] = PARKS, limit = 3): Park[] {
  return list
    .filter((p) => p.id !== park.id)
    .map((p) => ({
      p,
      d: (p.lat - park.lat) ** 2 + (p.lng - park.lng) ** 2,
    }))
    .sort((a, b) => a.d - b.d)
    .slice(0, limit)
    .map((x) => x.p);
}

export function scoreTone(score: number): "good" | "warn" | "muted" {
  if (score >= 8.5) return "good";
  if (score >= 7.5) return "warn";
  return "muted";
}
