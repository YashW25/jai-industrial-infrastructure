import { useEffect } from 'react';
import { useOrganizationSettings, useSeoSettings } from './useSiteData';

interface DynamicSEOOptions {
    pagePath: string;
    titleSuffix?: string;
    defaultTitle?: string;
    defaultDescription?: string;
}

/**
 * useDynamicSEO - Injects page-specific SEO meta tags into the document head.
 * Merges organization settings with page-level SEO settings from the DB.
 */
export const useDynamicSEO = ({
    pagePath,
    titleSuffix,
    defaultTitle,
    defaultDescription,
}: DynamicSEOOptions) => {
    const { data: settings } = useOrganizationSettings();
    const { data: pageSeo } = useSeoSettings(pagePath);

    const orgName = settings?.name ?? 'Enterprise';
    const resolvedTitle = pageSeo?.meta_title || defaultTitle || orgName;
    const resolvedDescription = pageSeo?.meta_description || defaultDescription || settings?.tagline || '';
    const resolvedOgImage = pageSeo?.og_image || settings?.logo_url || '';
    const fullTitle = titleSuffix ? `${resolvedTitle} | ${titleSuffix}` : resolvedTitle;

    useEffect(() => {
        // Title
        document.title = fullTitle;

        // Meta description
        setMeta('description', resolvedDescription);

        // OpenGraph
        setMeta('og:title', fullTitle, true);
        setMeta('og:description', resolvedDescription, true);
        setMeta('og:type', 'website', true);
        if (resolvedOgImage) setMeta('og:image', resolvedOgImage, true);

        // Twitter Card
        setMeta('twitter:card', 'summary_large_image', false, true);
        setMeta('twitter:title', fullTitle, false, true);
        setMeta('twitter:description', resolvedDescription, false, true);
        if (resolvedOgImage) setMeta('twitter:image', resolvedOgImage, false, true);

        // Keywords
        if (pageSeo?.meta_keywords) {
            setMeta('keywords', pageSeo.meta_keywords);
        }
    }, [fullTitle, resolvedDescription, resolvedOgImage, pageSeo]);

    return { title: fullTitle, description: resolvedDescription };
};

const setMeta = (name: string, content: string, isProperty = false, isTwitter = false) => {
    const attr = isProperty ? 'property' : isTwitter ? 'name' : 'name';
    const metaAttrValue = isProperty ? `og:${name.replace('og:', '')}` : name;

    let el = document.querySelector<HTMLMetaElement>(
        isProperty ? `meta[property="${metaAttrValue}"]` : `meta[name="${name}"]`
    );

    if (!el) {
        el = document.createElement('meta');
        if (isProperty) {
            el.setAttribute('property', metaAttrValue);
        } else {
            el.setAttribute('name', name);
        }
        document.head.appendChild(el);
    }

    el.setAttribute('content', content);
};
