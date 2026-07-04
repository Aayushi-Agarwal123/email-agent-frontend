import { Moon, Sun } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/components/theme-provider"

/** Light/dark toggle as a switch (Sun ↔ Moon). "system" resolves to the OS
 *  preference for the initial position; flipping it sets an explicit theme. */
export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <div className="flex items-center gap-2" title="Toggle light / dark theme">
      <Sun className="h-4 w-4 text-muted-foreground" />
      <Switch
        checked={isDark}
        onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
        aria-label="Toggle light or dark theme"
      />
      <Moon className="h-4 w-4 text-muted-foreground" />
    </div>
  )
}
