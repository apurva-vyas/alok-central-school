/**
 * Central image registry for easy management.
 * To change any image on the site, update the path here — all components pull from this file.
 */

const ASSETS = '/assets';

export const IMAGES = {
  branding: {
    logo: `${ASSETS}/branding/school_logo.png`,
  },

  carousel: [
    `${ASSETS}/carousel/alokcentralschool_topfront.png`,
    `${ASSETS}/carousel/alokcentralschool_front.png`,
  ],

  campus: {
    hero: `${ASSETS}/carousel/alokcentralschool_topfront.png`,
    frontView: `${ASSETS}/carousel/alokcentralschool_front.png`,
    cbseHero: `${ASSETS}/campus/alokcentralschool_white_building.png`,
    galleryHero: `${ASSETS}/campus/alokcentralschool_ai_building.png`,
  },

  staff: {
    principal: `${ASSETS}/staff/principal.jpg`,
  },

  facilities: {
    scienceLab: `${ASSETS}/facilities/ScienceLab.jpg`,
    library: `${ASSETS}/facilities/Libarary.jpg`,
    computerLab: `${ASSETS}/facilities/ComputerLab.jpg`,
    musicRoom: `${ASSETS}/facilities/MusicRoom.jpg`,
    knowledgeCenter: `${ASSETS}/facilities/knowledge1.jpg`,
    transport: `${ASSETS}/facilities/transport.jpg`,
    funSaturdays: `${ASSETS}/facilities/fun.jpg`,
    security: `${ASSETS}/facilities/security.jpg`,
    specialLectures: `${ASSETS}/facilities/lecture.jpg`,
    canteen: `${ASSETS}/facilities/canteen1.jpg`,
    maths: `${ASSETS}/facilities/maths.jpg`,
    sports: `${ASSETS}/facilities/sports.jpg`,
  },

  results: [
    `${ASSETS}/results/result1.jpg`,
    `${ASSETS}/results/result2.jpg`,
  ],
} as const;

export interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

function generateEventImages(folder: string, count: number, alt: string, category: string): GalleryImage[] {
  return Array.from({ length: count }, (_, i) => ({
    src: `${ASSETS}/events/${folder}/${i + 1}.jpg`,
    alt,
    category,
  }));
}

export const GALLERY_IMAGES: GalleryImage[] = [
  ...generateEventImages('science-fair', 14, 'Science Fair', 'science fair'),
  ...generateEventImages('school-trip', 14, 'School Trip', 'school trip'),
  ...generateEventImages('janmashtami', 18, 'Janmashtami', 'Janmashtami'),
  ...generateEventImages('annual-function', 27, 'Annual Function', 'Annual Function'),
  ...generateEventImages('news-clips', 13, 'News Clips', 'News Clips'),
];
