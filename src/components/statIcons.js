import { Users, Globe, MapPin, Search, FileText } from 'lucide-react'

/**
 * Icons chosen for the five statistics in the Figma's "Stats Bar Section".
 * Kept in a separate file from StatCard so Fast Refresh keeps working
 * (react-refresh/only-export-components).
 */
export const statIcons = {
  unreached: Users, // "Unreached People Groups"
  regions: Globe, // "Regions Worldwide"
  countries: MapPin, // "Countries Identified"
  researching: Search, // "Groups Currently Being Researched"
  reports: FileText, // "Mission Reports Submitted"
}
