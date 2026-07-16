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
  Video, // Perfect for Video Editing
  Layers, // Great for Motion Graphics / Compositing
  Box, // Ideal for 3D Art / Modeling
  Network, // Great for Machine Learning / Data Pipelines
  LineChart, // Great for Data Science / Analytics
} from 'lucide-react'

// Map your REAL database category strings to Lucide icons.
// Make sure the string keys exactly match what is in your database!
export const categoryIconMap: Record<string, React.ElementType> = {
  // Foundational
  Language: Code2,
  Languages: Code2,

  // Software Engineering & Architecture
  Frontend: MonitorSmartphone,
  Backend: Server,
  Database: Database,
  Databases: Database,
  Cloud: Cloud,
  CRM: Cloud, // Maps nicely for Salesforce/cloud platforms
  DevOps: Network,
  Tools: Wrench,
  Architecture: Cpu,

  // Data Science & Machine Learning (DSML)
  AI: Brain,
  'Machine Learning': Network,
  'Data Science': LineChart,
  'Data Engineering': Database,

  // Digital Creation & Multimedia
  Editing: Video,
  'Video Editing': Video,
  Design: PenTool,
  UI: Layout,
  'Motion Graphics': Layers,
  '3D Art': Box,
  '3D Modeling': Box,

  // The ultimate fallback if you add a weird category to the DB later
  default: Braces,
}
