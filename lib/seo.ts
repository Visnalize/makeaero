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
