/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolItem {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  seoDescription: string;
  iconName: string; // Dynamic mapping in UI to Lucide icon string
  trending?: boolean;
  howToUse: string;
  faqs: ToolFAQ[];
  tags: string[];
}

export type ToolCategory =
  | "text"
  | "image"
  | "pdf"
  | "developer"
  | "student"
  | "business"
  | "security"
  | "daily"
  | "generator";

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  iconName: string;
  count: number;
}

export interface UserStats {
  favorites: string[]; // array of toolIDs
  recentlyUsed: string[]; // array of toolIDs with max length
  completedSessions: number;
  offlineSaves: number;
}
