import {
  Brain,
  Server,
  MonitorSmartphone,
  Cloud,
  PenTool,
  Braces,
  Database,
  Code2,
  Wrench,
  Cpu,
  Layout,
} from 'lucide-react'

// Map your REAL database category strings to Lucide icons.
// Make sure the string keys exactly match what is in your database!
export const categoryIconMap: Record<string, React.ElementType> = {
  // Your current DB categories
  Language: Code2,
  Languages: Code2,

  // Software Engineering
  Frontend: MonitorSmartphone,
  Backend: Server,
  Database: Database,
  Databases: Database,
  Cloud: Cloud,
  DevOps: Cloud,
  Tools: Wrench,
  Architecture: Cpu,

  // AI & Data
  AI: Brain,
  'Machine Learning': Brain,
  'Data Science': Brain,

  // Creative (To match your multi-disciplinary identity)
  Editing: PenTool,
  Design: Layout,
  'Motion Graphics': PenTool,

  // The ultimate fallback if you add a weird category to the DB later
  default: Braces,
}
