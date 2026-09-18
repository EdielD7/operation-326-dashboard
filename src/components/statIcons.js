import { Users, Target, CircleCheckBig, Globe, MapPin } from 'lucide-react'

/**
 * Icons chosen for the five statistics in the Figma's "Stats Bar Section".
 * Kept in a separate file from StatCard so Fast Refresh keeps working
 * (react-refresh/only-export-components).
 */
export const statIcons = {
  total: Users, // "Total People Groups"
  unreached: Target, // "Unreached People Groups"
  reached: CircleCheckBig, // "Reached People Groups"
  regions: Globe, // "Regions Worldwide"
  countries: MapPin, // "Countries Identified"
}
