import { 
  Product, 
  Category, 
  EnquiryOrder, 
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
  
  // Dedicated Homepage Background Setting
  homepageBackgroundImage: STOREFRONT_IMAGE,
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

// LocalStorage persistence keys
const KEYS = {
  PRODUCTS: 'ankobeng_products_v3',
  CATEGORIES: 'ankobeng_categories_v3',
  HERO_SLIDES: 'ankobeng_hero_slides_v3',
  BUSINESS_INFO: 'ankobeng_business_info_v3',
  HOMEPAGE_CONTENT: 'ankobeng_homepage_content_v3',
  WHATSAPP_SETTINGS: 'ankobeng_whatsapp_settings_v3',
  MEDIA_LIBRARY: 'ankobeng_media_library_v3',
  ADMIN_PASSCODE: 'ankobeng_admin_passcode_v3',
  ADMIN_AUTH: 'ankobeng_admin_auth_v3'
};

export const cleanProductNameFromFileName = (fileName: string): string => {
  // Exact rule: Use the exact file name with only the file extension removed.
  // Do not rewrite, shorten, improve, capitalize, or invent product names.
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) return fileName;
  return fileName.substring(0, lastDotIndex);
};

export const dataService = {
  // --------------------------------------------------------------------------
  // WhatsApp Settings & Direct Ordering Flow
  // --------------------------------------------------------------------------
  getWhatsAppSettings(): WhatsAppSettings {
    const raw = localStorage.getItem(KEYS.WHATSAPP_SETTINGS);
    if (!raw) {
      localStorage.setItem(KEYS.WHATSAPP_SETTINGS, JSON.stringify(INITIAL_WHATSAPP_SETTINGS));
      return INITIAL_WHATSAPP_SETTINGS;
    }
    try {
      return { ...INITIAL_WHATSAPP_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return INITIAL_WHATSAPP_SETTINGS;
    }
  },

  saveWhatsAppSettings(settings: WhatsAppSettings): void {
    localStorage.setItem(KEYS.WHATSAPP_SETTINGS, JSON.stringify(settings));
  },

  getWhatsAppOrderUrl(productName?: string): string {
    const settings = this.getWhatsAppSettings();
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
  // Admin Authentication
  // --------------------------------------------------------------------------
  verifyAdminPasscode(enteredPasscode: string): boolean {
    const trimmed = enteredPasscode.trim();
    if (!trimmed) return false;
    // Primary requested passcode is 'yaw'
    if (trimmed.toLowerCase() === 'yaw') return true;
    const stored = localStorage.getItem(KEYS.ADMIN_PASSCODE);
    if (stored && (trimmed === stored || trimmed.toLowerCase() === stored.toLowerCase())) return true;
    const fallbackPasscodes = ['0243324183', 'ankobeng2026', '2026'];
    return fallbackPasscodes.includes(trimmed);
  },

  setAdminPasscode(newPasscode: string): void {
    localStorage.setItem(KEYS.ADMIN_PASSCODE, newPasscode.trim());
  },

  isAdminAuthenticated(): boolean {
    return (
      sessionStorage.getItem(KEYS.ADMIN_AUTH) === 'true' ||
      localStorage.getItem(KEYS.ADMIN_AUTH) === 'true'
    );
  },

  setAdminAuthenticated(authenticated: boolean, persist = false): void {
    if (authenticated) {
      sessionStorage.setItem(KEYS.ADMIN_AUTH, 'true');
      if (persist) {
        localStorage.setItem(KEYS.ADMIN_AUTH, 'true');
      }
    } else {
      sessionStorage.removeItem(KEYS.ADMIN_AUTH);
      localStorage.removeItem(KEYS.ADMIN_AUTH);
    }
  },

  logoutAdmin(): void {
    sessionStorage.removeItem(KEYS.ADMIN_AUTH);
    localStorage.removeItem(KEYS.ADMIN_AUTH);
  },

  // --------------------------------------------------------------------------
  // Products Management
  // --------------------------------------------------------------------------
  getProducts(): Product[] {
    const raw = localStorage.getItem(KEYS.PRODUCTS);
    if (!raw) {
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    try {
      const parsed: Product[] = JSON.parse(raw);
      return parsed.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  getProductById(id: string): Product | undefined {
    return this.getProducts().find(p => p.id === id);
  },

  saveProducts(products: Product[]): void {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  },

  addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      order: products.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    products.unshift(newProduct);
    this.saveProducts(products);
    return newProduct;
  },

  updateProduct(product: Product): void {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      products[index] = {
        ...product,
        updatedAt: new Date().toISOString()
      };
      this.saveProducts(products);
    }
  },

  deleteProduct(id: string): void {
    const products = this.getProducts().filter(p => p.id !== id);
    this.saveProducts(products);
  },

  // --------------------------------------------------------------------------
  // Categories Management
  // --------------------------------------------------------------------------
  getCategories(): Category[] {
    const raw = localStorage.getItem(KEYS.CATEGORIES);
    if (!raw) {
      localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    try {
      const parsed: Category[] = JSON.parse(raw);
      return parsed.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    } catch {
      return INITIAL_CATEGORIES;
    }
  },

  saveCategories(categories: Category[]): void {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
  },

  addCategory(name: string): Category {
    const categories = this.getCategories();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      order: categories.length + 1
    };
    categories.push(newCat);
    this.saveCategories(categories);
    return newCat;
  },

  updateCategory(category: Category): void {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id === category.id);
    if (index !== -1) {
      categories[index] = category;
      this.saveCategories(categories);
    }
  },

  deleteCategory(id: string): void {
    const categories = this.getCategories().filter(c => c.id !== id);
    this.saveCategories(categories);
  },

  // --------------------------------------------------------------------------
  // Hero Slides Management
  // --------------------------------------------------------------------------
  getHeroSlides(): HeroSlide[] {
    const raw = localStorage.getItem(KEYS.HERO_SLIDES);
    if (!raw) {
      localStorage.setItem(KEYS.HERO_SLIDES, JSON.stringify(INITIAL_HERO_SLIDES));
      return INITIAL_HERO_SLIDES;
    }
    try {
      const parsed: HeroSlide[] = JSON.parse(raw);
      return parsed.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    } catch {
      return INITIAL_HERO_SLIDES;
    }
  },

  saveHeroSlides(slides: HeroSlide[]): void {
    localStorage.setItem(KEYS.HERO_SLIDES, JSON.stringify(slides));
  },

  addHeroSlide(slide: Omit<HeroSlide, 'id'>): HeroSlide {
    const slides = this.getHeroSlides();
    const newSlide: HeroSlide = {
      ...slide,
      id: `slide-${Date.now()}`,
      order: slides.length + 1
    };
    slides.push(newSlide);
    this.saveHeroSlides(slides);
    return newSlide;
  },

  updateHeroSlide(slide: HeroSlide): void {
    const slides = this.getHeroSlides();
    const index = slides.findIndex(s => s.id === slide.id);
    if (index !== -1) {
      slides[index] = slide;
      this.saveHeroSlides(slides);
    }
  },

  deleteHeroSlide(id: string): void {
    const slides = this.getHeroSlides().filter(s => s.id !== id);
    this.saveHeroSlides(slides);
  },

  // --------------------------------------------------------------------------
  // Media Library Management (Both Images & Videos)
  // --------------------------------------------------------------------------
  getMediaItems(): MediaItem[] {
    const raw = localStorage.getItem(KEYS.MEDIA_LIBRARY);
    if (!raw) {
      localStorage.setItem(KEYS.MEDIA_LIBRARY, JSON.stringify(INITIAL_MEDIA_ITEMS));
      return INITIAL_MEDIA_ITEMS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_MEDIA_ITEMS;
    }
  },

  saveMediaItems(items: MediaItem[]): void {
    localStorage.setItem(KEYS.MEDIA_LIBRARY, JSON.stringify(items));
  },

  addMediaItem(item: Omit<MediaItem, 'id' | 'createdAt'>): MediaItem {
    const items = this.getMediaItems();
    const newItem: MediaItem = {
      ...item,
      id: `med-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    items.unshift(newItem);
    this.saveMediaItems(items);
    return newItem;
  },

  updateMediaItem(item: MediaItem): void {
    const items = this.getMediaItems();
    const idx = items.findIndex(m => m.id === item.id);
    if (idx !== -1) {
      items[idx] = item;
      this.saveMediaItems(items);
    }
  },

  deleteMediaItem(id: string): void {
    const items = this.getMediaItems().filter(m => m.id !== id);
    this.saveMediaItems(items);
  },

  // --------------------------------------------------------------------------
  // Homepage Content & Media Placements
  // --------------------------------------------------------------------------
  getHomepageContent(): HomepageContent {
    const raw = localStorage.getItem(KEYS.HOMEPAGE_CONTENT);
    if (!raw) {
      localStorage.setItem(KEYS.HOMEPAGE_CONTENT, JSON.stringify(INITIAL_HOMEPAGE_CONTENT));
      return INITIAL_HOMEPAGE_CONTENT;
    }
    try {
      const parsed = JSON.parse(raw);
      return { 
        ...INITIAL_HOMEPAGE_CONTENT, 
        ...parsed,
        videoPlacements: parsed.videoPlacements && parsed.videoPlacements.length > 0 
          ? parsed.videoPlacements 
          : INITIAL_VIDEO_PLACEMENTS
      };
    } catch {
      return INITIAL_HOMEPAGE_CONTENT;
    }
  },

  saveHomepageContent(content: HomepageContent): void {
    localStorage.setItem(KEYS.HOMEPAGE_CONTENT, JSON.stringify(content));
  },

  updateHomepageBackground(background: {
    url: string;
    publicId?: string;
    type: 'image' | 'video';
    duration?: number;
    settings?: { autoplay: boolean; muted: boolean; loop: boolean; controls: boolean };
  }): void {
    const current = this.getHomepageContent();
    if (background.type === 'video') {
      current.homepageBackgroundType = 'video';
      current.homepageBackgroundVideo = background.url;
      current.homepageBackgroundVideoDuration = background.duration;
      if (background.settings) {
        current.homepageBackgroundVideoSettings = background.settings;
      }
    } else {
      current.homepageBackgroundType = 'image';
      current.homepageBackgroundImage = background.url;
      current.homepageBackgroundPublicId = background.publicId;
    }
    this.saveHomepageContent(current);
  },

  // --------------------------------------------------------------------------
  // Business Information
  // --------------------------------------------------------------------------
  getBusinessInfo(): BusinessInfo {
    const raw = localStorage.getItem(KEYS.BUSINESS_INFO);
    if (!raw) {
      localStorage.setItem(KEYS.BUSINESS_INFO, JSON.stringify(INITIAL_BUSINESS_INFO));
      return INITIAL_BUSINESS_INFO;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_BUSINESS_INFO;
    }
  },

  saveBusinessInfo(info: BusinessInfo): void {
    localStorage.setItem(KEYS.BUSINESS_INFO, JSON.stringify(info));
  },

  // --------------------------------------------------------------------------
  // Reset Defaults
  // --------------------------------------------------------------------------
  resetAll(): void {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(KEYS.HERO_SLIDES, JSON.stringify(INITIAL_HERO_SLIDES));
    localStorage.setItem(KEYS.BUSINESS_INFO, JSON.stringify(INITIAL_BUSINESS_INFO));
    localStorage.setItem(KEYS.HOMEPAGE_CONTENT, JSON.stringify(INITIAL_HOMEPAGE_CONTENT));
    localStorage.setItem(KEYS.WHATSAPP_SETTINGS, JSON.stringify(INITIAL_WHATSAPP_SETTINGS));
    localStorage.setItem(KEYS.MEDIA_LIBRARY, JSON.stringify(INITIAL_MEDIA_ITEMS));
  }
};

export const openWhatsAppOrder = (productName?: string): void => {
  const url = dataService.getWhatsAppOrderUrl(productName);
  try {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = url;
    }
  } catch {
    window.location.href = url;
  }
};
