// SVG Data URIs for images to avoid binary assets in the repository

// Project visuals
export const DECIPAD_PROJECT_VISUAL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJyZWQiLz48L3N2Zz4K'
export const GRAMMARLY_PROJECT_VISUAL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJncmVlbiIvPjwvc3ZnPgo='

// Gallery images
export const GALLERY_RED_SQUARE =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJyZWQiLz48L3N2Zz4K'
export const GALLERY_GREEN_SQUARE =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJncmVlbiIvPjwvc3ZnPgo='
export const GALLERY_BLUE_SQUARE =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJibHVlIi8+PC9zdmc+Cg=='

// Gallery images array for convenience
export const GALLERY_IMAGES = [
  GALLERY_RED_SQUARE,
  GALLERY_GREEN_SQUARE,
  GALLERY_BLUE_SQUARE,
]

// Helper function to create achievement badges with gradients and icons
let badgeIdCounter = 0
const createAchievementBadge = (
  icon: string,
  title: string,
  subtitle: string,
  detail: string,
  gradientStart: string,
  gradientEnd: string,
  textColor: string = 'white'
): string => {
  const uniqueId = `badge${badgeIdCounter++}`
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <defs>
    <linearGradient id="grad${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${gradientStart};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${gradientEnd};stop-opacity:1" />
    </linearGradient>
    <filter id="shadow${uniqueId}" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
      <feOffset dx="0" dy="3" result="offsetblur"/>
      <feFlood flood-color="#000000" flood-opacity="0.15"/>
      <feComposite in2="offsetblur" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="120" height="120" rx="16" fill="url(#grad${uniqueId})" filter="url(#shadow${uniqueId})"/>
  <text x="60" y="30" text-anchor="middle" fill="${textColor}" font-size="28" opacity="0.9">${icon}</text>
  <text x="60" y="55" text-anchor="middle" fill="${textColor}" font-family="Arial, sans-serif" font-size="14" font-weight="600">${title}</text>
  <text x="60" y="76" text-anchor="middle" fill="${textColor}" font-family="Arial, sans-serif" font-size="18" font-weight="700">${subtitle}</text>
  <text x="60" y="96" text-anchor="middle" fill="${textColor}" font-family="Arial, sans-serif" font-size="11" opacity="0.8">${detail}</text>
</svg>
`
  // Use encodeURIComponent instead of btoa for Unicode support
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.trim())
}

// Rylee Brasseur Achievement Badges
export const TRACK_RECORD_800M_BADGE = createAchievementBadge(
  '🏃',
  '800m',
  '2:27.62',
  'SCHOOL RECORD',
  '#0d4f0d',
  '#1a5f1a',
  'white'
)

export const TRACK_RECORD_1600M_BADGE = createAchievementBadge(
  '🏃',
  '1600m',
  '5:30.15',
  'SCHOOL RECORD',
  '#0d4f0d',
  '#1a5f1a',
  'white'
)

export const TRACK_RECORD_3200M_BADGE = createAchievementBadge(
  '🏃',
  '3200m',
  '11:46.47',
  'SCHOOL RECORD',
  '#0d4f0d',
  '#1a5f1a',
  'white'
)

export const AP_SCHOLAR_BADGE = createAchievementBadge(
  '🎓',
  'AP',
  'Scholar',
  '2023',
  '#2d0052',
  '#4B0082',
  'white'
)

export const SCHOLARSHIP_BADGE = createAchievementBadge(
  '💰',
  '$2,000',
  'Scholarship',
  'Awards',
  '#FFD700',
  '#FFA500',
  '#333333'
)

export const CHOREOGRAPHER_BADGE = createAchievementBadge(
  '🎭',
  'Student',
  'Choreographer',
  'Mamma Mia!',
  '#8B1538',
  '#DC143C',
  'white'
)

export const ALL_LEAGUE_BADGE = createAchievementBadge(
  '🎯',
  'All-League',
  'Cross Country',
  'Honorable Mention',
  '#8B6508',
  '#CD853F',
  'white'
)

export const TEAM_CHAMPION_BADGE = createAchievementBadge(
  '🏆',
  'Lapeer',
  'Lightning',
  'Champions',
  '#FF4500',
  '#FF6347',
  'white'
)

export const MSU_JMC_BADGE = createAchievementBadge(
  '🎓',
  'MSU',
  'James Madison',
  "Int'l Relations",
  '#18453B',
  '#0d2818',
  'white'
)

export const DISTANCE_RUNNER_BADGE = createAchievementBadge(
  '🏃',
  'Distance',
  'Runner',
  '21:40 5K PR',
  '#4169E1',
  '#1E90FF',
  'white'
)

export const LEADER_FUND_BADGE = createAchievementBadge(
  '⭐',
  'LEADER',
  'Fund',
  'Recipient',
  '#8B4513',
  '#A0522D',
  'white'
)
