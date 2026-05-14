import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Moon, ShieldAlert, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-md bg-primary flex items-center justify-center"
              aria-hidden="true"
            >
              <ShieldAlert className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-base tracking-tight text-foreground">
              Hallucination<span className="text-primary">Guard</span>
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            data-ocid="theme.toggle"
            className="w-8 h-8 text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 w-full">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/40 border-t border-border mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <Separator className="mb-4" />
          <p className="text-center text-xs text-muted-foreground">
            &copy; {year}. Built with love using{" "}
            <a
              href={utmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline transition-colors duration-200"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
