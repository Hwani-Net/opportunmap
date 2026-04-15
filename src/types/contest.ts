import { Timestamp } from "firebase/firestore";

export type Category = "contest" | "hackathon" | "startup" | "grant";

export interface Contest {
  id: string;
  title: string;
  category: Category;
  organizer: string;
  applicationStart: Timestamp;
  applicationEnd: Timestamp;
  field: string[];
  target: string[];
  region: string;
  summary: string;
  prize: string;
  eligibility: string;
  applyUrl: string;
  sourceUrl: string;
  checklist: string[];
  isActive: boolean;
}

export const CATEGORY_LABEL: Record<Category, string> = {
  contest: "공모전",
  hackathon: "해커톤",
  startup: "예창패",
  grant: "지원금",
};
