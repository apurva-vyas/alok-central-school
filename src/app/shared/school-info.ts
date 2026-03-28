import { IMAGES } from './image-registry';

export const SCHOOL_INFO = {
  name: 'Alok Central School',
  shortName: 'ACS',
  email: 'alokcentralschool@gmail.com',
  phone: '01484-222244',
  mobile: '9413270929',
  mobileCallUrl: 'tel:+919413270929',
  whatsappChat: '7014559002',
  whatsappChatUrl: 'https://wa.me/917014559002',
  address: {
    line1: 'Alok Central School',
    line2: 'Shahpura, Bhilwara',
    line3: 'Rajasthan, 311404',
    mapUrl: 'https://maps.app.goo.gl/qKvotw9g1PG4oqjB9',
  },
  social: {
    instagram: 'https://www.instagram.com/alok_central_school_shahpura/',
    youtube: 'https://www.youtube.com/@alokcentralschool7866/featured',
    facebook: 'https://www.facebook.com/people/Alok-Central-School-Shahpura/pfbid02ZKfGSouwGLkP4SiD8hwEFjQjPHf8EqZnjn5tWiqbJbU3LCoefax3cEMss2oPpSaWl/',
  },
  contactFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfT9AahxDVQiMq9K4kcyCzuIVmGiMnMcmJG16w9EG3-HDdnrg/viewform?embedded=true',
  admissionFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScKlZIDW5d0Zw0AL7UnKSS61yf0MVTe-FoSnlouay1QCJEcMw/viewform?embedded=true',
  heroImage: IMAGES.campus.hero,
  logo: IMAGES.branding.logo,
} as const;
