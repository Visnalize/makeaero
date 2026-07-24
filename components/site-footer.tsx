export function SiteFooter() {
  return (
    <footer className="flex justify-center px-6 py-8">
      <div className="aero-glass px-6 py-4 text-slate-600 text-sm text-center">
        <p className="aero-subtitle">Retro fan? Check out our other projects</p>
        <p className="mt-1">
          <a href="https://visnalize.com/win7simu" target="_blank" className="font-medium text-brand-dark hover:underline">
            Win7 Simu
          </a>{" "}
          -{" "}
          <a href="https://visnalize.com/brick1100" target="_blank" className="font-medium text-brand-dark hover:underline">
            Brick 1100
          </a>
        </p>
      </div>
    </footer>
  );
}
