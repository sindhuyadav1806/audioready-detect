import { Languages } from "lucide-react";

import { LANGUAGES, type LanguageCode } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function languageLabel(code: LanguageCode): string {
  return LANGUAGES.find((l) => l.code === code)?.label ?? code;
}

export function LanguageSelector({
  value,
  onChange,
  label = "Language",
}: {
  value: LanguageCode;
  onChange: (code: LanguageCode) => void;
  label?: string | undefined;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <Languages className="size-4" aria-hidden />
        {label}
      </span>
      <Select value={value} onValueChange={(next) => onChange(next as LanguageCode)}>
        <SelectTrigger className="h-9 w-[170px] bg-surface/70">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              {language.label} · {language.native}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}

export function LanguageNote() {
  return (
    <p className="text-xs leading-relaxed text-muted-foreground">
      Language-agnostic acoustic features allow the system architecture to support multiple Indian
      languages and regional accents. In this prototype multilingual handling is architectural — it is
      not a claim of trained production-grade multilingual detection.
    </p>
  );
}
