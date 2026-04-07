"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

export function useCodeHighlight(code: string, lang: string = "css"): string {
  const [html, setHtml] = useState("");

  useEffect(() => {
    codeToHtml(code, { lang, theme: "dracula" }).then(setHtml);
  }, [code, lang]);

  return html;
}
