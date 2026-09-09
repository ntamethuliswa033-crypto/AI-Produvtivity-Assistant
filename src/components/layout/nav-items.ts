import {
  LayoutDashboard,
  Mail,
  FileText,
  ListChecks,
  BookOpen,
  MessagesSquare,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  to: "/" | "/email" | "/meeting-notes" | "/tasks" | "/research" | "/chat" | "/settings";
  label: string;
  icon: LucideIcon;
  description: string;
};

export const navItems: NavItem[] = [
  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Usage overview and quick actions",
  },
  {
    to: "/email",
    label: "Smart Email Generator",
    icon: Mail,
    description: "Draft professional emails in seconds",
  },
  {
    to: "/meeting-notes",
    label: "Meeting Notes Summarizer",
    icon: FileText,
    description: "Turn raw notes into decisions and actions",
  },
  {
    to: "/tasks",
    label: "AI Task Planner",
    icon: ListChecks,
    description: "Prioritise work and build a schedule",
  },
  {
    to: "/research",
    label: "AI Research Assistant",
    icon: BookOpen,
    description: "Brief yourself on any work topic",
  },
  {
    to: "/chat",
    label: "AI Chatbot",
    icon: MessagesSquare,
    description: "Ask anything about your workday",
  },
  {
    to: "/settings",
    label: "Settings",
    icon: Settings,
    description: "Preferences and workspace details",
  },
];
