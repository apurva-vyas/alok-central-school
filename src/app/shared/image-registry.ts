const ASSETS = '/assets';

export const IMAGES = {
  branding: {
    logo: `${ASSETS}/branding/school_logo.png`,
  },

  carousel: [
    `${ASSETS}/carousel/alokcentralschool_topfront.png`,
    `${ASSETS}/carousel/alokcentralschool_front.png`,
  ],

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
} as const;
