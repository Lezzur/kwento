// =============================================================================
// KWENTO - Story Icons (Literary-themed SVG icons)
// =============================================================================

import type { ElementType } from '@/types'

interface IconProps {
  className?: string
  size?: number
  style?: React.CSSProperties
}

// -----------------------------------------------------------------------------
// Individual Icons
// -----------------------------------------------------------------------------

export function SceneIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Film clapperboard */}
      <path d="M4 6h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
      <path d="M2 10h20" />
      <path d="M7 6l-3 4" />
      <path d="M13 6l-3 4" />
      <path d="M19 6l-3 4" />
    </svg>
  )
}

export function CharacterIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Quill with silhouette */}
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a6.5 6.5 0 0113 0" />
    </svg>
  )
}

export function LocationIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Castle/setting */}
      <path d="M3 21h18" />
      <path d="M5 21V7l3-3 3 3v14" />
      <path d="M19 21V11l-3-3-3 3v10" />
      <path d="M9 21v-4h2v4" />
      <path d="M7 10h0" />
      <path d="M15 14h0" />
    </svg>
  )
}

export function PlotPointIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Star/key moment */}
      <path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.2L12 17l-6.3 4 2.3-7.2-6-4.4h7.6z" />
    </svg>
  )
}

export function IdeaIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Candle flame / inspiration */}
      <path d="M12 2c-2.5 2.5-2.5 5 0 7.5 2.5-2.5 2.5-5 0-7.5z" />
      <path d="M9 12h6" />
      <path d="M10 12v6a2 2 0 002 2 2 2 0 002-2v-6" />
      <path d="M10 16h4" />
    </svg>
  )
}

export function ChapterIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Open book */}
      <path d="M2 4a2 2 0 012-2h6a2 2 0 012 2v16a2 2 0 01-2-2H4a2 2 0 01-2-2V4z" />
      <path d="M22 4a2 2 0 00-2-2h-6a2 2 0 00-2 2v16a2 2 0 002-2h6a2 2 0 002-2V4z" />
      <path d="M6 6h2" />
      <path d="M6 10h2" />
      <path d="M16 6h2" />
      <path d="M16 10h2" />
    </svg>
  )
}

export function ConflictIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Crossed swords */}
      <path d="M5 5l14 14" />
      <path d="M5 3v4h4" />
      <path d="M19 5L5 19" />
      <path d="M15 3h4v4" />
    </svg>
  )
}

export function ThemeIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Drama masks */}
      <path d="M3 8c0-3.3 2.7-6 6-6 2.1 0 4 1.1 5 2.7" />
      <path d="M3 8c0 3.3 2.7 6 6 6" />
      <path d="M6 10.5c.5.3 1 .5 1.5.5s1-.2 1.5-.5" />
      <circle cx="5.5" cy="7" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7" r=".5" fill="currentColor" />
      <path d="M21 16c0-3.3-2.7-6-6-6-2.1 0-4 1.1-5 2.7" />
      <path d="M21 16c0 3.3-2.7 6-6 6" />
      <path d="M18 18.5c-.5-.3-1-.5-1.5-.5s-1 .2-1.5.5" />
      <circle cx="18.5" cy="15" r=".5" fill="currentColor" />
      <circle cx="15.5" cy="15" r=".5" fill="currentColor" />
    </svg>
  )
}

export function NoteIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Scroll/parchment */}
      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h1v8a4 4 0 004 4h6a4 4 0 004-4V9h1a2 2 0 002-2V5a2 2 0 00-2-2H5z" />
      <path d="M6 9h12v8a2 2 0 01-2 2h-6a2 2 0 01-2-2V9z" />
      <path d="M9 13h6" />
      <path d="M9 16h4" />
    </svg>
  )
}

export function ElementsIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Grid of elements */}
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

export function PlotHoleIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Broken chain link */}
      <path d="M15 7h2a4 4 0 010 8h-2" />
      <path d="M9 17H7a4 4 0 110-8h2" />
      <path d="M8 12h2" />
      <path d="M14 12h2" />
      <path d="M12 10v4" />
    </svg>
  )
}

// -----------------------------------------------------------------------------
// Extended Icon Library (for custom card types)
// -----------------------------------------------------------------------------

export function ShieldIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Shield - organizations, factions */}
      <path d="M12 2l8 4v6c0 5.5-3.8 10-8 11-4.2-1-8-5.5-8-11V6l8-4z" />
    </svg>
  )
}

export function CrownIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Crown - royalty, hierarchy */}
      <path d="M2 18h20v2H2z" />
      <path d="M4 18l1-10 5 4 2-8 2 8 5-4 1 10" />
    </svg>
  )
}

export function SwordIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Sword - weapons, items */}
      <path d="M5 19L19 5" />
      <path d="M15 5h4v4" />
      <path d="M5 15l4 4" />
      <path d="M3 17l4 4" />
    </svg>
  )
}

export function PotionIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Potion flask - magic, alchemy */}
      <path d="M9 3h6v3H9z" />
      <path d="M10 6v4l-4 8a2 2 0 002 2h8a2 2 0 002-2l-4-8V6" />
      <path d="M8 16h8" />
    </svg>
  )
}

export function RingIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Ring - artifacts, treasures */}
      <ellipse cx="12" cy="14" rx="8" ry="4" />
      <ellipse cx="12" cy="14" rx="5" ry="2.5" />
      <path d="M12 6l-2 4h4l-2-4z" />
    </svg>
  )
}

export function SkullIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Skull - danger, death, villains */}
      <circle cx="12" cy="10" r="7" />
      <circle cx="9" cy="9" r="1.5" fill="currentColor" />
      <circle cx="15" cy="9" r="1.5" fill="currentColor" />
      <path d="M9 17v4" />
      <path d="M12 17v4" />
      <path d="M15 17v4" />
      <path d="M8 14h8" />
    </svg>
  )
}

export function HeartIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Heart - relationships, love */}
      <path d="M12 21C12 21 4 14 4 8.5C4 5.5 6.5 3 9.5 3C11 3 12 4 12 4C12 4 13 3 14.5 3C17.5 3 20 5.5 20 8.5C20 14 12 21 12 21Z" />
    </svg>
  )
}

export function LightningIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Lightning bolt - powers, abilities */}
      <path d="M13 2L4 14h7l-2 8 11-12h-7l2-8z" />
    </svg>
  )
}

export function KeyIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Key - secrets, mysteries */}
      <circle cx="8" cy="8" r="5" />
      <path d="M12 12l8 8" />
      <path d="M17 17l3 0" />
      <path d="M14 14l0 3" />
    </svg>
  )
}

export function EyeIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Eye - surveillance, secrets, vision */}
      <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export function CompassIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Compass - journeys, exploration */}
      <circle cx="12" cy="12" r="9" />
      <path d="M16 8l-4 4-4-4" fill="currentColor" />
      <path d="M8 16l4-4 4 4" />
    </svg>
  )
}

export function HourglassIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Hourglass - time, deadlines */}
      <path d="M5 3h14" />
      <path d="M5 21h14" />
      <path d="M7 3v4l5 5-5 5v4" />
      <path d="M17 3v4l-5 5 5 5v4" />
    </svg>
  )
}

export function GemIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Gem/crystal - treasures, magic */}
      <path d="M6 3h12l4 7-10 12L2 10l4-7z" />
      <path d="M2 10h20" />
      <path d="M12 22V10" />
      <path d="M6 3l6 7 6-7" />
    </svg>
  )
}

export function TowerIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Tower - structures, strongholds */}
      <path d="M8 21V10l4-7 4 7v11" />
      <path d="M6 21h12" />
      <path d="M10 14h4" />
      <path d="M10 17h4" />
      <path d="M12 3v1" />
    </svg>
  )
}

export function FlagIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Flag/banner - factions, groups */}
      <path d="M4 3v18" />
      <path d="M4 3h12l-3 4 3 4H4" />
    </svg>
  )
}

export function BeastIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Wolf/beast - creatures, species */}
      <path d="M4 8l2-4 2 3 4-4 4 4 2-3 2 4" />
      <path d="M4 8c0 6 3 10 8 12 5-2 8-6 8-12" />
      <circle cx="9" cy="11" r="1" fill="currentColor" />
      <circle cx="15" cy="11" r="1" fill="currentColor" />
      <path d="M10 15h4" />
    </svg>
  )
}

export function ShipIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Ship - vehicles, travel */}
      <path d="M3 18l3-3h12l3 3" />
      <path d="M6 15V8l6-5 6 5v7" />
      <path d="M12 3v5" />
      <path d="M8 8h8" />
    </svg>
  )
}

export function TreeIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Tree - nature, families, lineage */}
      <path d="M12 22v-6" />
      <path d="M12 16l-6 0 6-7-4 0 4-6 4 6-4 0 6 7-6 0z" />
    </svg>
  )
}

export function MaskIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Mask - disguise, identity */}
      <path d="M4 10c0-4 4-7 8-7s8 3 8 7c0 2-1 4-3 5l-2 5h-6l-2-5c-2-1-3-3-3-5z" />
      <circle cx="9" cy="10" r="1.5" />
      <circle cx="15" cy="10" r="1.5" />
    </svg>
  )
}

export function ScrollIcon({ className = '', size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Scroll - lore, documents */}
      <path d="M6 3a3 3 0 00-3 3v2a3 3 0 003 3h1v7a3 3 0 003 3h8a3 3 0 003-3V6a3 3 0 00-3-3H6z" />
      <path d="M7 11h10v7a1 1 0 01-1 1h-8a1 1 0 01-1-1v-7z" />
      <circle cx="5" cy="6" r="1" />
    </svg>
  )
}

// -----------------------------------------------------------------------------
// Icon Map for Element Types
// -----------------------------------------------------------------------------

import type { IconName } from '@/types'

const iconComponents: Record<ElementType, React.ComponentType<IconProps>> = {
  scene: SceneIcon,
  character: CharacterIcon,
  location: LocationIcon,
  'plot-point': PlotPointIcon,
  idea: IdeaIcon,
  chapter: ChapterIcon,
  conflict: ConflictIcon,
  theme: ThemeIcon,
  note: NoteIcon,
}

export function getElementIcon(type: ElementType): React.ComponentType<IconProps> {
  return iconComponents[type] || NoteIcon
}

// Convenience component that renders based on type
export function ElementIcon({
  type,
  className = '',
  size = 16,
  style,
}: IconProps & { type: ElementType }) {
  const Icon = getElementIcon(type)
  return <Icon className={className} size={size} style={style} />
}

// -----------------------------------------------------------------------------
// Extended Icon Map (for custom card types)
// -----------------------------------------------------------------------------

const allIconComponents: Record<IconName, React.ComponentType<IconProps>> = {
  scene: SceneIcon,
  character: CharacterIcon,
  location: LocationIcon,
  'plot-point': PlotPointIcon,
  idea: IdeaIcon,
  chapter: ChapterIcon,
  conflict: ConflictIcon,
  theme: ThemeIcon,
  note: NoteIcon,
  shield: ShieldIcon,
  crown: CrownIcon,
  sword: SwordIcon,
  potion: PotionIcon,
  ring: RingIcon,
  skull: SkullIcon,
  heart: HeartIcon,
  lightning: LightningIcon,
  key: KeyIcon,
  eye: EyeIcon,
  compass: CompassIcon,
  hourglass: HourglassIcon,
  gem: GemIcon,
  tower: TowerIcon,
  flag: FlagIcon,
  beast: BeastIcon,
  ship: ShipIcon,
  tree: TreeIcon,
  mask: MaskIcon,
  scroll: ScrollIcon,
}

export function getIconByName(name: IconName): React.ComponentType<IconProps> {
  return allIconComponents[name] || NoteIcon
}

// Icon component that renders by name
export function DynamicIcon({
  name,
  className = '',
  size = 16,
  style,
}: IconProps & { name: IconName }) {
  const Icon = getIconByName(name)
  return <Icon className={className} size={size} style={style} />
}

// Available icons for the picker UI
export const ICON_OPTIONS: { name: IconName; label: string }[] = [
  { name: 'shield', label: 'Shield' },
  { name: 'crown', label: 'Crown' },
  { name: 'sword', label: 'Sword' },
  { name: 'potion', label: 'Potion' },
  { name: 'ring', label: 'Ring' },
  { name: 'skull', label: 'Skull' },
  { name: 'heart', label: 'Heart' },
  { name: 'lightning', label: 'Lightning' },
  { name: 'key', label: 'Key' },
  { name: 'eye', label: 'Eye' },
  { name: 'compass', label: 'Compass' },
  { name: 'hourglass', label: 'Hourglass' },
  { name: 'gem', label: 'Gem' },
  { name: 'tower', label: 'Tower' },
  { name: 'flag', label: 'Flag' },
  { name: 'beast', label: 'Beast' },
  { name: 'ship', label: 'Ship' },
  { name: 'tree', label: 'Tree' },
  { name: 'mask', label: 'Mask' },
  { name: 'scroll', label: 'Scroll' },
]
