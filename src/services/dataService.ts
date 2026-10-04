import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { 
  signInWithCustomToken, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { 
  Product, 
  Category, 
  HeroSlide, 
  BusinessInfo, 
  MediaItem, 
  HomepageContent, 
  WhatsAppSettings,
  VideoPlacementConfig 
} from '../types';

export const STOREFRONT_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHFVh5pUl_Eq2SCZZTI2zpZRY2Htf_BHI8ws4pKz9FfwFb2KZfHb4tkSLeqPg8q3YJaWemjiO2YkQ1bKp4LeCxnJ-D671bPMnEIw2LSvEuuOBgs23tmOSree3tXhk4u1zjQMeCc3Gcz8lwF0Pzt8jjm6z8Idu4gQzlMGvyY1KY-rpzhOYDRZMX7LixJitxEeO0n6FUbFzQEcpTAieZbp7pE4uDRlqUcv0uDRvN_WFOosptlbCB1Oq_M8vtdJFgW4_9Dfc';

export const STOREFRONT_IMAGE_INTERIOR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWjsoMKUf8ac1RLb1Pks7VshjMyYxsbaV-tvZhcaA8gkfHpnPsGmLWJIwciH5pRW45BMLg0xSqJWpfzgh89hOqAjs5sWUHFUQ_LczQnLlgEAvcwSMvydPtakvxMitXVOgV9WVad8EfeVL9xumWwtq_81ZDyd_9XJtjnT7lAJe_Y1O_uCgflrTmXJ7UyYTWG1pTv6gNfEUCEpdvvlqx9qtQXOhZfSNiaDVfqyibBRAJyI8dNc8agrzyzGdzjTWj2jqkfFQ';

export const OPEL_HERO_VEHICLE_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0e2e_lPjs9-q_EbDgDBCLAnOZRXGlQDKyBZ5j-koK4zW6ccY6TU9hpRbNaXqGJy07MANH2-JL7IbBvEMa6wsIwjSi3ZRlbl15edxCrtoj27_oI8D5tmzPTrcTDT-px9YEBfu4XQbgSXJiWQu1kOYP4TzOC-Tck3ZUsAI9aZ2rrDFAAT_5n6KjoNzt0lU8KGm-SvCpUaabPwBVSgqQgpXNpPv8Kz9JkffQrVaQU08eGz6IHprqzRvhQ0A-HHR6MXImuyY';

export const FEATURED_SPOTLIGHT_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEtSk87tY4B7D-mUHnC9V_-KpjeMAYpcyvsEaDKzbwTKOtZ6abRrbdFHfy7UnMLamZUshpfA_ND3gYcRywneJWkpwHWaPuV8WL_8ZKvWULLOdH9WGTtg0Bob9Rimwrp_BaZiSAO3x73eXKZ2lVQ1GdylFl2gLoBjvJdUGp0qkHm4Zxr3HPwlqZLe4sbA-4MAuMD1Tysxe5Tg9Z3MYaekmbQEXcagy8nchHSUUvh7Wjjl4hnI6fXQf9orOCPDzZ-PIURiM';

export const INITIAL_BUSINESS_INFO: BusinessInfo = {
  name: 'ANKOBENG MOTORS',
  owner: 'JOSEPH OBENG ANDERSON',
  description: 'DEALERS IN OPEL ENGINES & ALL KINDS OF ENGINE PARTS',
  address: 'BOX KN4009',
  location: 'Near the Post Office, ABOSSEY OKAI – ACCRA',
  shopDoor: 'SHOP DOOR E-3',
  phones: ['0243324183', '0538988846']
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-engines', name: 'Engines', slug: 'engines', order: 1 },
  { id: 'cat-parts', name: 'Engine Parts', slug: 'engine-parts', order: 2 }
];

export const INITIAL_WHATSAPP_SETTINGS: WhatsAppSettings = {
  phoneNumber: '0243324183',
  internationalNumber: '233243324183',
  messageTemplate: 'Hello Ankobeng Motors, please I want to order {productName}.',
  defaultMessage: 'Hello Ankobeng Motors, please I want to order an engine or engine part.'
};

export const INITIAL_VIDEO_PLACEMENTS: VideoPlacementConfig[] = [
  {
    id: 'homepage-bg',
    name: 'Homepage Background Video',
    location: 'Homepage / Site-wide Backdrop',
    enabled: false,
    videoUrl: '',
    autoplay: true,
    muted: true,
    loop: true,
    controls: false
  },
  {
    id: 'hero-bg',
    name: 'Hero Section Background Video',
    location: 'Top Hero Header',
    enabled: false,
    videoUrl: '',
    autoplay: true,
    muted: true,
    loop: true,
    controls: false
  },
  {
    id: 'about-section',
    name: 'About & Physical Shop Video',
    location: 'About Us / Shop Door E-3 Verification',
    enabled: false,
    videoUrl: '',
    autoplay: false,
    muted: true,
    loop: true,
    controls: true
  },
  {
    id: 'featured-section',
    name: 'Featured Spotlight Video',
    location: 'Featured Powertrain Showcase',
    enabled: false,
    videoUrl: '',
    autoplay: false,
    muted: true,
    loop: true,
    controls: true
  },
  {
    id: 'cta-section',
    name: 'Promotional / CTA Banner Video',
    location: 'Bottom Assistance Strip',
    enabled: false,
    videoUrl: '',
    autoplay: false,
    muted: true,
    loop: true,
    controls: true
  }
];

export const INITIAL_HOMEPAGE_CONTENT: HomepageContent = {
  heroHeadlinePrefix: 'DEALERS IN',
  heroHeadlineHighlight: 'OPEL ENGINES',
  heroHeadlineSuffix: '& ALL KINDS OF ENGINE PARTS',
  heroLocationSubtitle: 'Near the Post Office, ABOSSEY OKAI – ACCRA',
  featuredTitle: 'FEATURED ENGINES',
  featuredSubtitle: 'Opel Powertrains & Components Available for Immediate Collection or Regional Transport',
  catalogueTitle: 'EXPLORE OUR ENGINES & ENGINE PARTS',
  catalogueSubtitle: 'Complete assemblies, cylinder heads, crankcases, pistons, and precision mechanical spares catalogued directly from the Abossey Okai warehouse floor.',
  aboutHeadline: 'REAL ENGINES. REAL SHOP. REAL SERVICE.',
  aboutDescription: 'Every engine on our racks is physically stocked at our Abossey Okai store. Mechanics, fleet operators, and vehicle owners are welcome to inspect units directly before ordering.',
  ctaHeadline: 'LOOKING FOR A SPECIFIC ENGINE?',
  ctaDescription: 'Tell us what you need and contact Ankobeng Motors for the engine or engine part you are looking for. Direct stock availability at Abossey Okai.',
  homepageBackgroundImage: '',
  homepageBackgroundType: 'image',
  homepageBackgroundVideo: '',
  homepageBackgroundVideoSettings: {
    autoplay: true,
    muted: true,
    loop: true,
    controls: false
  },
  videoPlacements: INITIAL_VIDEO_PLACEMENTS
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'OPEL 1.6',
    category: 'Engines',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBqsim3jR2YWzcCwuAlLBEMzE7BvjXfuhSX_D-rm0i1WJ00onR0aMPFNAy49-iyydz7JIRswLTFyWrW7QuRY6k9B23nPMHbSvM5rE4r7dtsYcnukGRLEuKP_JRIBDmsCFzLi4HXa2tzcpAyRKMJWGONwvBvZdn6GIE75Fk8usrC1UtcchYDstSMFzBDMtSCIb8OVgdLonrQk0_Fee_XmULd8-ep1m9QszHlQzZ6eFEqwbTAy_PEQMOGpDpyt0OvfCijDnU',
      FEATURED_SPOTLIGHT_IMAGE
    ],
    description: 'Complete Opel 1.6 engine assembly with mounting points, intake components, and engine wiring.',
    fitment: 'Opel Astra, Vectra A, Zafira',
    condition: 'Shop Stock',
    availability: 'In Stock (Shop Door E-3)',
    featured: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    name: 'ASTRA G',
    category: 'Engines',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDvaWnDBKtb0gcSnuHH-8lKwTAXNUAmVTbeQKQVV15M1CgAW2DOQc1H-m9Umjhl7TVkFweyhsJxS5oXHd9_TxOhuZxP8pIStl6Q7FvXc1E8m0p2IjzpqBXmdYLgiQFa1O0qYukuO6NId6CLmXBgk_Ba_0OUeFNnNKVDKK_S956Xrlw-QOZS0AY_mGH4kOfWq6Ofu7NL1FRzJnCylUEk5_Ll9iSGJbq3X6E3OmpF7Rku05y6mG7iYig6CymSKIV6iQ2Q52k'
    ],
    description: 'Complete Astra G powertrain assembly with intake manifold, timing belt casing, and alternator mounting.',
    fitment: 'Astra G, Zafira A',
    condition: 'Shop Stock',
    availability: 'In Stock (Shop Door E-3)',
    featured: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    name: 'OPEL HEAD 2.0',
    category: 'Engine Parts',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCmJVinmROUIPibuLAHVf2KMOTilp2bFIrt5fB-stDarPym-7FeIUnA2jmMzywDmDXE2MlOaYb_BbDC888rU_vcntl9OQyWnGN7n_s7rFZNlN8tUa9HiMyMPp5I-8fjG9Pn55Cp0wR-81elDOminyvcKEKcgGHaR2U39n8R02EHW9qglexJ6oDiswgwr4aCvAunL9FfBbUHszTLApMuMbb9kKRERX4ZnWWbU5jsG4kp-B2kQFWVuPQ0dp0XUwCD_2UurCA'
    ],
    description: '2.0L 16V cylinder head with valves, springs, and intake ports.',
    fitment: 'Vectra B, Omega, Astra',
    condition: 'Shop Stock',
    availability: 'In Stock (Shop Door E-3)',
    featured: true,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-4',
    name: 'CLOSE HEAD',
    category: 'Engine Parts',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD-vYKczjKd8MAWU335fCCJbk6755JBgJKIceQixO5GGRSqWVqFYvRBo1LK5XRPXfwGurbQEMDIcUkKk2vCjGkZGGPuuewnT-BrC9YkqgYm9D7TM6TwqNr4eQ8JZxn92hGBpY0wTmKnVvpqM-oALyngYc0uko6X7_neSChQQXFUeaXllT5oEjzvkYpJEXEgWz4bisXI-PBk03W7h4hjsNLzlZjhB_PHW_PMvGjo3VGiZQso9b_2yPjAUJD6xDdJKilvQ9s'
    ],
    description: 'Complete closed cylinder head assembly with cover and sensors intact.',
    fitment: 'Opel Astra, Corsa, Zafira',
    condition: 'Shop Stock',
    availability: 'In Stock (Shop Door E-3)',
    featured: false,
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-5',
    name: 'CHEVROLET OPTRA HEAD',
    category: 'Engine Parts',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCRfzPmi9B6NNRwEQQIqZjwrw5cp_YRJQz7QGM4nj34SKDezopsR2_uQM6fbcIS3yd4s5Af9fbKSoZudzk6ZH0Xxc7x7a2EknANXYfNSrlKwxdDd2xv-99iPBCp9WuwbWk4wmbn54xwCmcMy6YyNyys0Qcq2_cTJdmweXs9rbX2e2AAHfnlNhgs5z5HOGYaDnCR4GQsSXarPVl5eXCpjoVFkJEVj7MUs3eqmGXben7RrReB1DVzKMkb_WUvUi6OQRW3lCI'
    ],
    description: 'Twin camshaft cylinder head compatible with Chevrolet Optra / GM platforms.',
    fitment: 'Chevrolet Optra 1.6 / GM',
    condition: 'Shop Stock',
    availability: 'In Stock (Shop Door E-3)',
    featured: false,
    order: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-6',
    name: 'CHEVROLET AVEO 1.6',
    category: 'Engines',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCaO_XTSu5bH4l_9QgAGGtpYvhsya2icvMUBkXDZDksol1XlVo4EFb8TMfq5qHkmjX-yRI9VmmnWUnzDa7-ZTRcUqfa-q4RqhYzlhjbk8FodW89ojWBHoE1DbKHqgRyTDpTDzk-iwUK7wQ3RBywA_J6L5_VPrnuJTpWU20p-N8jaL70L1DiGRQhSUKzjMaPkA9_4Yos9ryPjQiFn5HfWb0IDyyfDGboUOBjXMvQ5dwptf6nAx8GvkBkypSx1oZW1llYpMI'
    ],
    description: 'Chevrolet Aveo 1.6 complete engine assembly with intake runner manifold, alternator, and pulleys.',
    fitment: 'Chevrolet Aveo / Daewoo',
    condition: 'Shop Stock',
    availability: 'In Stock (Shop Door E-3)',
    featured: true,
    order: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7',
    name: 'CHEVROLET AVEO 1.6(PLUG WIRES)',
    category: 'Engines',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCbFDGwRYSzy8CHdvZtUDlhLvArreoB1eTnuyocm25egUFtDCKGowTObSv4U-DZ8deoAXBUWMMN1KxhpAPAUht9BsFjlq1A0Iy7Rr3fY8u59ie_o8LXBYvX39VYqXylQsSzUhcwwDs0htu3KygAxsZChRSxGgoULbUJkAD0WWROpHlGKkbKh3mHfXjkvziLyktQObuaDzIWur9XPSyJmq2MVpyqErZRVwyXfc43PX0xJh3v47W6hIwsF32C9Bz8FaEFOiU'
    ],
    description: 'Chevrolet Aveo 1.6 powertrain assembly with plug wires harness and accessories.',
    fitment: 'Aveo 1.6 / Pontiac Wave',
    condition: 'Shop Stock',
    availability: 'In Stock (Shop Door E-3)',
    featured: false,
    order: 7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-8',
    name: 'CRANKS',
    category: 'Engine Parts',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDintCGcl7RzZUj_2TE4wFJP8Cdvk1LZvoCZOjueV2_iwUcApueaKYFPlMT7jGjQqC0MfR9cEQ9-j7hRObiD39HeAQy55Mw5jxh1lisnshdWwCIOUvOqL-BfmB0Gqlt7ThieGxwO_SRH9-ARk-4p3B_klQklfb9kBN_1YYxQdEiISVEqbTarJqgwQByOQZWnRYi32_ngEPuP0Va5z7sQ3-S7oXf3hBy2pQkaZ6FvWR-vCTO9psKkssAaM-s6DMSFtBoP-s'
    ],
    description: 'Forged crankshafts with main journals and flywheel flanges for Opel and GM engines.',
    fitment: 'Opel Astra, Vectra, Omega',
    condition: 'Shop Stock',
    availability: 'In Stock (Shop Door E-3)',
    featured: false,
    order: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-9',
    name: 'AGILA GEAR BOX',
    category: 'Engine Parts',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjXI5WKFfVQulr0BRbu5b0mkSPGTKAwca6LucQiA2d_bCJdVb_jwJFBskm0vUkMPd71fv3keTpba7ym1BfoIqfnkLRL5mbmJkMPwy3zmjJslsBGSvOOCApz9vJ5K1gXcmNyqgQq1dcDtEYYwohIedzEzxwAovJ0zrhhRePZZMfaPf8O7Vnhi0sK-uqXz-TcjNQ3yFgLn7dg6xATrseGJ2HKqWIQj9IdFaRaLKs6KBYtRs4ZwrPBsfag0jatR2E3Q2bbhc'
    ],
    description: 'Complete manual gearbox assembly with selector linkages and bellhousing mounts.',
    fitment: 'Opel Agila / Corsa C',
    condition: 'Shop Stock',
    availability: 'In Stock (Shop Door E-3)',
    featured: false,
    order: 9,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    title: 'OPEL POWERTRAIN SPECIALISTS',
    subtitle: 'ABOSSEY OKAI STOCK',
    badge: 'SHOP DOOR E-3',
    image: OPEL_HERO_VEHICLE_IMAGE,
    mediaType: 'image',
    description: 'Direct stockists of Opel engines and complete mechanical components at Abossey Okai, Accra.',
    active: true,
    order: 1
  },
  {
    id: 'slide-2',
    title: 'COMPLETE ENGINE ASSEMBLIES',
    subtitle: 'OPEL & GM POWERTRAINS',
    badge: 'READY IN SHOP',
    image: FEATURED_SPOTLIGHT_IMAGE,
    mediaType: 'image',
    description: 'In-shop engine blocks, cylinder heads, gearboxes and crankshafts ready for inspection.',
    active: true,
    order: 2
  },
  {
    id: 'slide-3',
    title: 'ANKOBENG MOTORS STOREFRONT',
    subtitle: 'NEAR POST OFFICE, ABOSSEY OKAI',
    badge: 'PHYSICAL LOCATION',
    image: STOREFRONT_IMAGE_INTERIOR,
    mediaType: 'image',
    description: 'Visit Shop Door E-3 to inspect engine parts directly with Joseph Obeng Anderson.',
    active: true,
    order: 3
  }
];

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'med-storefront-ext',
    url: STOREFRONT_IMAGE,
    originalFilename: 'ANKOBENG_STOREFRONT_DOOR_E3.jpg',
    format: 'jpg',
    mediaType: 'image',
    locationUsed: 'Homepage Background & Storefront',
    createdAt: new Date().toISOString()
  },
  {
    id: 'med-storefront-int',
    url: STOREFRONT_IMAGE_INTERIOR,
    originalFilename: 'ANKOBENG_INTERIOR_RACKS.jpg',
    format: 'jpg',
    mediaType: 'image',
    locationUsed: 'About Section (Shop Verification)',
    createdAt: new Date().toISOString()
  },
  {
    id: 'med-opel-hero',
    url: OPEL_HERO_VEHICLE_IMAGE,
    originalFilename: 'OPEL_BONNET_OPEN_HERO.jpg',
    format: 'jpg',
    mediaType: 'image',
    locationUsed: 'Hero Slideshow (Slide 1)',
    createdAt: new Date().toISOString()
  },
  {
    id: 'med-spotlight',
    url: FEATURED_SPOTLIGHT_IMAGE,
    originalFilename: 'OPEL_POWERTRAIN_SPOTLIGHT.jpg',
    format: 'jpg',
    mediaType: 'image',
    locationUsed: 'Hero Slideshow & Featured Spotlight',
    createdAt: new Date().toISOString()
  }
];

/**
 * EXACT PRODUCT NAME RULE:
 * Uploaded product filename without only the file extension.
 * Do not rewrite, normalize, or rename.
 */
export const cleanProductNameFromFileName = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) return fileName;
  return fileName.substring(0, lastDotIndex);
};

/**
 * Helper to recursively strip any undefined values from Firestore payloads.
 * Cloud Firestore throws errors if an object contains `undefined` values.
 */
function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(item => sanitizeForFirestore(item)) as unknown as T;
  }
  if (typeof data === 'object' && !(data instanceof Date)) {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeForFirestore(value);
      }
    }
    return cleaned as T;
  }
  return data;
}

// Helper to invoke session-authenticated server Firestore mutations
async function performAdminMutation(action: 'set' | 'delete', collectionName: string, docId: string, data?: any): Promise<void> {
  const sessionId = sessionStorage.getItem('admin_session_id') || '';
  const res = await fetch('/api/admin/firestore', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(sessionId ? { 'x-admin-session-id': sessionId } : {})
    },
    body: JSON.stringify({ action, collection: collectionName, docId, data })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Admin mutation failed');
  }
}

export const dataService = {
  // --------------------------------------------------------------------------
  // Direct WhatsApp Order URL
  // --------------------------------------------------------------------------
  getWhatsAppOrderUrl(productName?: string, currentSettings?: WhatsAppSettings): string {
    const settings = currentSettings || INITIAL_WHATSAPP_SETTINGS;
    let message = '';
    if (productName && productName.trim()) {
      message = (settings.messageTemplate || 'Hello Ankobeng Motors, please I want to order {productName}.')
        .replace('{productName}', productName.trim());
    } else {
      message = settings.defaultMessage || 'Hello Ankobeng Motors, please I want to order an engine or engine part.';
    }
    const cleanNumber = (settings.internationalNumber || '233243324183').replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  },

  // --------------------------------------------------------------------------
  // Admin Server-Side Session & Authentication
  // --------------------------------------------------------------------------
  onAuthChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  getCurrentUser(): User | null {
    return auth.currentUser;
  },

  async loginAdminWithPhone(phone: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        if (data.sessionId) {
          sessionStorage.setItem('admin_session_id', data.sessionId);
        }
        if (data.customToken) {
          try {
            await signInWithCustomToken(auth, data.customToken);
          } catch (err) {
            console.error('Firebase Auth sync error:', err);
          }
        }
        return { success: true };
      }
      return { success: false, message: 'Invalid phone number or password.' };
    } catch (err) {
      return { success: false, message: 'Invalid phone number or password.' };
    }
  },

  async checkAdminSession(): Promise<{ authenticated: boolean; phone?: string }> {
    try {
      const sessionId = sessionStorage.getItem('admin_session_id') || '';
      const res = await fetch('/api/admin/session', {
        headers: sessionId ? { 'x-admin-session-id': sessionId } : {}
      });
      const data = await res.json();
      
      if (data.authenticated) {
        if (data.customToken && !auth.currentUser) {
          try {
            await signInWithCustomToken(auth, data.customToken);
          } catch (err) {
            console.error('Session restore token error:', err);
          }
        }
        return { authenticated: true, phone: data.user?.phone };
      }
      return { authenticated: false };
    } catch (err) {
      return { authenticated: false };
    }
  },

  async logoutAdmin(): Promise<void> {
    const sessionId = sessionStorage.getItem('admin_session_id') || '';
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: sessionId ? { 'x-admin-session-id': sessionId } : {}
      });
    } catch (err) {
      // ignore network logout error
    }
    sessionStorage.removeItem('admin_session_id');
    await signOut(auth);
  },

  // --------------------------------------------------------------------------
  // Firestore Realtime Subscriptions (Single Source of Truth)
  // --------------------------------------------------------------------------
  subscribeToProducts(onData: (products: Product[]) => void, onError?: (err: Error) => void) {
    const q = query(collection(db, 'products'), orderBy('order', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const list: Product[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Product, 'id'>) });
      });
      onData(list);
    }, (error) => {
      console.error('Products listener error:', error);
      onError?.(error);
      handleFirestoreError(error, OperationType.GET, 'products');
    });
  },

  subscribeToCategories(onData: (categories: Category[]) => void, onError?: (err: Error) => void) {
    const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const list: Category[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Category, 'id'>) });
      });
      onData(list);
    }, (error) => {
      console.error('Categories listener error:', error);
      onError?.(error);
      handleFirestoreError(error, OperationType.GET, 'categories');
    });
  },

  subscribeToHeroSlides(onData: (slides: HeroSlide[]) => void, onError?: (err: Error) => void) {
    const q = query(collection(db, 'heroSlides'), orderBy('order', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const list: HeroSlide[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<HeroSlide, 'id'>) });
      });
      onData(list);
    }, (error) => {
      console.error('HeroSlides listener error:', error);
      onError?.(error);
      handleFirestoreError(error, OperationType.GET, 'heroSlides');
    });
  },

  subscribeToHomepageContent(onData: (content: HomepageContent) => void, onError?: (err: Error) => void) {
    const docRef = doc(db, 'homepageContent', 'main');
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as HomepageContent;
        onData({ ...INITIAL_HOMEPAGE_CONTENT, ...data });
      } else {
        onData(INITIAL_HOMEPAGE_CONTENT);
      }
    }, (error) => {
      console.error('HomepageContent listener error:', error);
      onError?.(error);
      handleFirestoreError(error, OperationType.GET, 'homepageContent/main');
    });
  },

  subscribeToBusinessInfo(onData: (info: BusinessInfo) => void, onError?: (err: Error) => void) {
    const docRef = doc(db, 'businessInfo', 'main');
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        onData({ ...INITIAL_BUSINESS_INFO, ...(snapshot.data() as BusinessInfo) });
      } else {
        onData(INITIAL_BUSINESS_INFO);
      }
    }, (error) => {
      console.error('BusinessInfo listener error:', error);
      onError?.(error);
      handleFirestoreError(error, OperationType.GET, 'businessInfo/main');
    });
  },

  subscribeToWhatsAppSettings(onData: (settings: WhatsAppSettings) => void, onError?: (err: Error) => void) {
    const docRef = doc(db, 'settings', 'whatsapp');
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        onData({ ...INITIAL_WHATSAPP_SETTINGS, ...(snapshot.data() as WhatsAppSettings) });
      } else {
        onData(INITIAL_WHATSAPP_SETTINGS);
      }
    }, (error) => {
      console.error('WhatsAppSettings listener error:', error);
      onError?.(error);
      handleFirestoreError(error, OperationType.GET, 'settings/whatsapp');
    });
  },

  subscribeToMedia(onData: (items: MediaItem[]) => void, onError?: (err: Error) => void) {
    return onSnapshot(collection(db, 'media'), (snapshot) => {
      const list: MediaItem[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<MediaItem, 'id'>) });
      });
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      onData(list);
    }, (error) => {
      console.error('Media listener error:', error);
      onError?.(error);
      handleFirestoreError(error, OperationType.GET, 'media');
    });
  },

  // --------------------------------------------------------------------------
  // Cloud Firestore CRUD Operations
  // --------------------------------------------------------------------------
  async saveProduct(product: Omit<Product, 'id'> & { id?: string }): Promise<string> {
    const id = product.id || `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const dataToSave = sanitizeForFirestore({
      ...product,
      id,
      updatedAt: new Date().toISOString(),
      createdAt: product.createdAt || new Date().toISOString()
    });
    await performAdminMutation('set', 'products', id, dataToSave);
    return id;
  },

  async deleteProduct(id: string): Promise<void> {
    await performAdminMutation('delete', 'products', id);
  },

  async saveCategory(category: Category): Promise<void> {
    const data = sanitizeForFirestore({
      ...category,
      updatedAt: new Date().toISOString(),
      createdAt: category.createdAt || new Date().toISOString()
    });
    await performAdminMutation('set', 'categories', category.id, data);
  },

  async deleteCategory(id: string): Promise<void> {
    await performAdminMutation('delete', 'categories', id);
  },

  async saveHeroSlide(slide: HeroSlide): Promise<void> {
    const data = sanitizeForFirestore({
      ...slide,
      updatedAt: new Date().toISOString(),
      createdAt: slide.createdAt || new Date().toISOString()
    });
    await performAdminMutation('set', 'heroSlides', slide.id, data);
  },

  async deleteHeroSlide(id: string): Promise<void> {
    await performAdminMutation('delete', 'heroSlides', id);
  },

  async saveHomepageContent(content: HomepageContent): Promise<void> {
    const data = sanitizeForFirestore({
      ...content,
      updatedAt: new Date().toISOString()
    });
    await performAdminMutation('set', 'homepageContent', 'main', data);
  },

  async saveBusinessInfo(info: BusinessInfo): Promise<void> {
    const data = sanitizeForFirestore({
      ...info,
      updatedAt: new Date().toISOString()
    });
    await performAdminMutation('set', 'businessInfo', 'main', data);
  },

  async saveWhatsAppSettings(settings: WhatsAppSettings): Promise<void> {
    const data = sanitizeForFirestore({
      ...settings,
      updatedAt: new Date().toISOString()
    });
    await performAdminMutation('set', 'settings', 'whatsapp', data);
  },

  async addMediaItem(item: Omit<MediaItem, 'id' | 'createdAt'>): Promise<string> {
    const id = `med-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const data = sanitizeForFirestore({
      ...item,
      id,
      createdAt: new Date().toISOString()
    });
    await performAdminMutation('set', 'media', id, data);
    return id;
  },

  async deleteMediaItem(id: string): Promise<void> {
    await performAdminMutation('delete', 'media', id);
  },

  // --------------------------------------------------------------------------
  // Seed / Migration Utility (Imports Default Inventory into Firestore once)
  // --------------------------------------------------------------------------
  async seedInitialDataIfEmpty(force = false): Promise<boolean> {
    try {
      const prodSnap = await getDocs(collection(db, 'products'));
      if (!force && !prodSnap.empty) {
        return false; // Already populated
      }

      console.log('Synchronizing Ankobeng Motors catalog into Cloud Firestore...');
      const batch = writeBatch(db);

      // 1. Products
      INITIAL_PRODUCTS.forEach((p) => {
        const ref = doc(db, 'products', p.id);
        batch.set(ref, sanitizeForFirestore(p), { merge: true });
      });

      // 2. Categories
      INITIAL_CATEGORIES.forEach((c) => {
        const ref = doc(db, 'categories', c.id);
        batch.set(ref, sanitizeForFirestore(c), { merge: true });
      });

      // 3. Hero Slides
      INITIAL_HERO_SLIDES.forEach((s) => {
        const ref = doc(db, 'heroSlides', s.id);
        batch.set(ref, sanitizeForFirestore(s), { merge: true });
      });

      // 4. Homepage Content
      const hpRef = doc(db, 'homepageContent', 'main');
      batch.set(hpRef, sanitizeForFirestore(INITIAL_HOMEPAGE_CONTENT), { merge: true });

      // 5. Business Info
      const bizRef = doc(db, 'businessInfo', 'main');
      batch.set(bizRef, sanitizeForFirestore(INITIAL_BUSINESS_INFO), { merge: true });

      // 6. WhatsApp Settings
      const waRef = doc(db, 'settings', 'whatsapp');
      batch.set(waRef, sanitizeForFirestore(INITIAL_WHATSAPP_SETTINGS), { merge: true });

      // 7. Initial Media Items
      INITIAL_MEDIA_ITEMS.forEach((m) => {
        const ref = doc(db, 'media', m.id);
        batch.set(ref, sanitizeForFirestore(m), { merge: true });
      });

      await batch.commit();
      console.log('Catalog synchronized successfully.');
      return true;
    } catch (err) {
      console.warn('Initial seeding check:', err);
      return false;
    }
  }
};

export const openWhatsAppOrder = (productName?: string, currentSettings?: WhatsAppSettings): void => {
  const url = dataService.getWhatsAppOrderUrl(productName, currentSettings);
  try {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = url;
    }
  } catch {
    window.location.href = url;
  }
};
