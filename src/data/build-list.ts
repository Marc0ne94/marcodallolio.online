export type Wave = "stage" | "hero" | "input" | "dressing";

export type BuildItem = {
  n: number;
  id: string;
  wave: Wave;
  title: string;
  model: string;
  why: string;
};

export const WAVES: { id: Wave; label: string; blurb: string }[] = [
  {
    id: "stage",
    label: "01 · Palco",
    blurb: "Il sit-stand. Senza questo, niente scena.",
  },
  {
    id: "hero",
    label: "02 · Macchine",
    blurb: "Pezzi confermati. Uno alla volta, isolati nel void.",
  },
  {
    id: "input",
    label: "03 · Mani",
    blurb: "Tastiere, mouse, audio, hub. Quello che si tocca.",
  },
  {
    id: "dressing",
    label: "04 · Set",
    blurb: "Tappetino, bracci, cavi, oggetti piccoli.",
  },
];

export const BUILD_LIST: BuildItem[] = [
  {
    n: 1,
    id: "desk-standing",
    wave: "stage",
    title: "Sit-stand",
    model: "excovip (da confermare)",
    why: "Palco. Altezza sit/stand, gamba, controller.",
  },
  {
    n: 2,
    id: "mon-left",
    wave: "hero",
    title: "Monitor sinistro",
    model: "ASUS ROG Strix XG349C",
    why: "Ultrawide 34\" 3440×1440, curva 1900R.",
  },
  {
    n: 3,
    id: "mon-right",
    wave: "hero",
    title: "Monitor destro",
    model: "Samsung U32R590",
    why: "32\" 4K, curva 1500R.",
  },
  {
    n: 4,
    id: "laptop-left",
    wave: "hero",
    title: "Surface",
    model: "Microsoft Surface Pro 7",
    why: "Type cover, kickstand.",
  },
  {
    n: 5,
    id: "laptop-right",
    wave: "hero",
    title: "Zenbook Duo",
    model: "ASUS Zenbook Duo",
    why: "Due pannelli, tastiera sganciata.",
  },
  {
    n: 6,
    id: "riser-black",
    wave: "hero",
    title: "ROG chiuso",
    model: "ASUS ROG Strix 18 RTX 5090",
    why: "Coperchio al centro, piano per il Fold.",
  },
  {
    n: 7,
    id: "phone-fold",
    wave: "hero",
    title: "Pieghevole",
    model: "Samsung Galaxy Z Fold 7",
    why: "Aperto in verticale sullo stand, One UI.",
  },
  {
    n: 8,
    id: "dgx-spark",
    wave: "hero",
    title: "Spark",
    model: "NVIDIA DGX Spark",
    why: "SFF sotto la tastiera.",
  },
  {
    n: 9,
    id: "kb-compact",
    wave: "input",
    title: "Tastiera Trust",
    model: "Trust",
    why: "Full-size tasti tondi, sopra lo Spark. SKU di linea ancora aperto.",
  },
  {
    n: 10,
    id: "kb-mech",
    wave: "input",
    title: "Tastiera meccanica",
    model: "—",
    why: "Full-size, retroilluminata. SKU mancante.",
  },
  {
    n: 11,
    id: "mouse-main",
    wave: "input",
    title: "Mouse",
    model: "Redragon M913",
    why: "Primo piano sul tappetino.",
  },
  {
    n: 12,
    id: "earbuds",
    wave: "input",
    title: "Auricolari",
    model: "Huawei FreeBuds 3",
    why: "Cover rossa sul coperchio ROG.",
  },
  {
    n: 13,
    id: "hub-usbc",
    wave: "input",
    title: "Hub",
    model: "Baseus",
    why: "LED blu, verso lo Spark.",
  },
  {
    n: 14,
    id: "stand-phone",
    wave: "input",
    title: "Stand Fold",
    model: "—",
    why: "Metallo a due bracci. SKU mancante.",
  },
  {
    n: 15,
    id: "mat-desk",
    wave: "dressing",
    title: "Tappetino",
    model: "Desk mat Linux cheat-sheet",
    why: "Process Operations / Text Processing.",
  },
  {
    n: 16,
    id: "mon-arm-left",
    wave: "dressing",
    title: "Braccio sinistro",
    model: "—",
    why: "Palo sotto il XG349C.",
  },
  {
    n: 17,
    id: "mon-arm-right",
    wave: "dressing",
    title: "Piede destro",
    model: "—",
    why: "Supporto del Samsung.",
  },
  {
    n: 18,
    id: "desk-controller",
    wave: "dressing",
    title: "Controller altezza",
    model: "Memoria 1-2-3",
    why: "Bordo anteriore destro.",
  },
  {
    n: 19,
    id: "glasses-case",
    wave: "dressing",
    title: "Custodia",
    model: "Ray-Ban",
    why: "Astuccio.",
  },
  {
    n: 20,
    id: "cable-white",
    wave: "dressing",
    title: "Cavo Fold",
    model: "USB-C bianco",
    why: "Dal pieghevole verso il piano.",
  },
];

export function buildItemById(id: string) {
  return BUILD_LIST.find((i) => i.id === id);
}
