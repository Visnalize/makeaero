import type { Metadata } from "next";
import {
  SITE_NAME,
  SITE_URL,
  defaultOpenGraph,
  defaultTwitter,
  ogTitle,
} from "@/lib/seo";

const ABOUT_TITLE = ogTitle("About");
const ABOUT_DESCRIPTION =
  "Learn about Make Aero - the motivation behind the project, how it was built, and who made it.";

export const metadata: Metadata = {
  title: ABOUT_TITLE,
  description: ABOUT_DESCRIPTION,
  openGraph: {
    ...defaultOpenGraph,
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    url: `${SITE_URL}/about`,
  },
  twitter: {
    ...defaultTwitter,
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
  },
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
};

export default function AboutPage() {
  return (
    <main className="mx-auto px-6 py-16 max-w-2xl">
      <h1 className="mb-8 font-bold text-slate-900 text-4xl tracking-tight">
        About
      </h1>

      <section className="mb-10">
        <h2 className="mb-3 font-semibold text-slate-800 text-xl">
          Motivation
        </h2>
        <p className="mb-4 text-slate-600 leading-relaxed">
          Frutiger Aero was a design language that defined an era - glossy
          buttons, luminous orbs, and the distinctive glass chrome of Windows 7.
          It carried a sense of optimism that felt alive and tactile in a way
          that today&apos;s flat UIs rarely do.
        </p>
        <p className="text-slate-600 leading-relaxed">
          <b>{SITE_NAME}</b> exists to make that aesthetic accessible again.
          Whether you&apos;re building a retro-themed project, experimenting
          with nostalgic UI, or just want to relive those glossy vibes, this
          toolset lets you generate authentic Aero-style CSS without digging
          through decade-old tutorials.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 font-semibold text-slate-800 text-xl">
          How it&apos;s built
        </h2>
        <p className="mb-4 text-slate-600 leading-relaxed">
          The project was initially scaffolded with the help of{" "}
          <span className="font-medium text-slate-700">vibecoding</span> - an
          AI-assisted rapid prototyping approach that gets a working foundation
          up quickly. As the project grows it will be increasingly shaped by
          hand: refined interactions, thoughtful design decisions, and features
          driven by real feedback rather than generated boilerplate. Think of it
          as starting with a sketch and gradually turning it into something
          deliberate.
        </p>
        <p className="text-slate-600 leading-relaxed">
          The source code is publicly available on{" "}
          <a
            href="https://github.com/Visnalize/makeaero"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-dark hover:underline"
          >
            GitHub
          </a>
          . Feel free to explore, contribute, or use it as a reference for your
          own Aero-inspired projects!
        </p>
      </section>

      <section>
        <h2 className="mb-3 font-semibold text-slate-800 text-xl">Author</h2>
        <p className="text-slate-600 leading-relaxed">
          {SITE_NAME} is made by{" "}
          <a
            href="https://visnalize.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-dark hover:underline"
          >
            Visnalize
          </a>
          , the maker behind{" "}
          <a
            href="https://visnalize.com/win7simu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-dark hover:underline"
          >
            Win7 Simu
          </a>{" "}
          and{" "}
          <a
            href="https://visnalize.com/brick1100"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-dark hover:underline"
          >
            Brick 1100
          </a>
          . If you enjoy retro aesthetics and niche passion projects,
          you&apos;ll feel right at home.
        </p>
      </section>
    </main>
  );
}
