export const EVENT_CATEGORIES = ['cours', 'atelier', 'conference', 'networking'] as const

export type EventCategory = (typeof EVENT_CATEGORIES)[number]

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  cours: 'Cours',
  atelier: 'Atelier',
  conference: 'Conférence',
  networking: 'Networking',
}

export const CATEGORY_DOT: Record<EventCategory, string> = {
  cours: 'bg-sky-500',
  atelier: 'bg-amber-500',
  conference: 'bg-violet-500',
  networking: 'bg-emerald-500',
}
