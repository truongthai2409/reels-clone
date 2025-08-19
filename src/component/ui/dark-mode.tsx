import { useTheme } from "../../context/theme";

export function DarkModeToggle() {
    const { dark, toggle } = useTheme();
    return (
        <button
            type="button"
            className="px-3 py-2 rounded-xl border text-sm"
            onClick={toggle}
            aria-pressed={dark}
            aria-label="Toggle dark mode"
        >
            {dark ? "🌙 Dark" : "☀️ Light"}
        </button>
    );
}