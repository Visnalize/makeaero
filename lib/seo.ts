export const SITE_NAME = "Make Aero";
export const SITE_URL = "https://makeaero.com";
export const ogTitle = (title: string) => `${title} | ${SITE_NAME}`;

export const defaultOpenGraph = {
  siteName: SITE_NAME,
  type: "website" as const,
};

export const defaultTwitter = {
  card: "summary_large_image" as const,
};

export function webAppJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Free online tools for creating authentic Frutiger Aero styles — glossy buttons, shiny orbs, and glass window frames.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
