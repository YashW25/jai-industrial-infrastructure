export const SEO_CONFIG = {
    defaultTitle: 'Jai Industrial Infrastructure | Engineering Excellence. Industrial Strength.',
    titleTemplate: '%s | Jai Industrial Infrastructure',
    description: 'Jai Industrial Infrastructure delivers world-class industrial and enterprise infrastructure solutions — from steel fabrication to turnkey plant construction — across India.',
    siteUrl: 'https://jaiindustrial.in',
    siteName: 'Jai Industrial Infrastructure',
    twitterHandle: '@jaiinfra',
    defaultImage: '/og-image.png',
    keywords: [
        'Jai Industrial Infrastructure',
        'Industrial Infrastructure India',
        'Plant Construction Pune',
        'Steel Fabrication Maharashtra',
        'Turnkey Project Management',
        'Industrial Engineering Services',
        'Enterprise Infrastructure Solutions',
        'MIDC Industrial Area Pune',
        'Heavy Engineering India',
        'Industrial Automation',
        'Civil Infrastructure Contractor',
        'Mechanical Engineering Services Pune',
        'Structural Steel Fabrication',
        'EPC Contractor India',
        'Factory Construction Maharashtra',
        'Industrial Project Management',
        'Pipeline Engineering India',
        'Electrical Infrastructure Services',
        'Industrial Equipment Installation',
        'BOT Projects Infrastructure India'
    ]
};

export const generateOrganizationSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Jai Industrial Infrastructure',
    url: SEO_CONFIG.siteUrl,
    logo: `${SEO_CONFIG.siteUrl}/logo.png`,
    sameAs: [
        'https://linkedin.com/company/jai-industrial-infrastructure',
        'https://facebook.com/jaiindustrialinfra',
        'https://instagram.com/jaiindustrialinfra',
        'https://twitter.com/jaiinfra'
    ],
    address: {
        '@type': 'PostalAddress',
        streetAddress: 'Plot No. 12, MIDC Industrial Area',
        addressLocality: 'Pune',
        addressRegion: 'Maharashtra',
        postalCode: '411019',
        addressCountry: 'IN'
    },
    contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-98765-43210',
        contactType: 'customer service',
        email: 'info@jaiindustrial.in'
    }
});

export const generateBreadcrumbSchema = (items: { name: string; item: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${SEO_CONFIG.siteUrl}${item.item}`
    }))
});
