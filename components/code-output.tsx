"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCodeHighlight } from "@/hooks/use-code-highlight";

interface CopyButton {
  label: string;
  text: string;
  variant?: "default" | "outline";
}

export function CodeOutput({
  code,
  language = "css",
  copyButtons,
}: {
  code: string;
  language?: string;
  copyButtons: CopyButton[];
}) {
  const codeHtml = useCodeHighlight(code, language);

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-white/30">
      <CardHeader>
        <CardTitle>Generated {language.toUpperCase()} Code</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          {copyButtons.map((btn, i) => (
            <Button
              key={btn.label}
              variant={btn.variant ?? (i === 0 ? "default" : "outline")}
              className={i === 0 ? "bg-blue-600 hover:bg-blue-700" : ""}
              onClick={() => navigator.clipboard.writeText(btn.text)}
            >
              {btn.label}
            </Button>
          ))}
        </div>
        {codeHtml ? (
          <div dangerouslySetInnerHTML={{ __html: codeHtml }} />
        ) : (
          <pre className="bg-[#282A36] text-[#F8F8F2]">{code}</pre>
        )}
      </CardContent>
    </Card>
  );
}
