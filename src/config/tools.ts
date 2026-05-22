import type { LucideIcon } from "lucide-react";
import { FileJson, Clock3, FileSearch } from "lucide-react";
import type { ComponentType } from "react";
import { JsonFormatter } from "../pages/JsonFormatter";
import { EpochConverter } from "../pages/EpochConverter";
import { SentLogDecoder } from "../pages/SentLogDecoder";

export interface ToolDef {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  component: ComponentType;
}

export const tools: ToolDef[] = [
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    tagline: "CleverTap payload → email-ready table",
    description:
      "Parse raw CleverTap JSON, configure columns, and copy an inline-styled HTML table for Outlook/Gmail.",
    icon: FileJson,
    accent: "emerald",
    component: JsonFormatter,
  },
  {
    slug: "sentlog-decoder",
    name: "SentLog Decoder",
    tagline: "Notification log JSON → readable text",
    description:
      "Decode CleverTap notification-sent log JSON into a structured, copy-ready plain-text summary. Handles multiple keys, multiple entries, and malformed inputs.",
    icon: FileSearch,
    accent: "indigo",
    component: SentLogDecoder,
  },
  {
    slug: "epoch-converter",
    name: "Epoch Converter",
    tagline: "Epoch ↔ human date, every unit",
    description:
      "Bidirectional epoch converter with auto-unit detection (s/ms/µs/ns), ISO/RFC/relative formats, multi-timezone display, live current epoch, presets, and one-click copy.",
    icon: Clock3,
    accent: "amber",
    component: EpochConverter,
  },
];

export const getToolBySlug = (slug: string): ToolDef | undefined =>
  tools.find((t) => t.slug === slug);
