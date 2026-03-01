$basePath = "y:\materproject-yash-main\materproject-yash-main"

# 1. Fix useClubData.ts clubId
$f = Join-Path $basePath "src\hooks\useClubData.ts"
$c = Get-Content $f -Raw
$c = $c -replace "clubId, ", ""
$c = $c -replace ", clubId", ""
[IO.File]::WriteAllText($f, $c)

# 2. Fix Overview.tsx
$f = Join-Path $basePath "src\pages\admin\Overview.tsx"
$c = Get-Content $f -Raw
$c = $c -replace "import { useStats, useEvents, useTeamMembers, useAnnouncements, useGallery } from '@/hooks/useSiteData';", "import { useTeamMembers, useGallery } from '@/hooks/useSiteData';`nimport { useClubStats, useClubEvents, useClubAnnouncements } from '@/hooks/useClubData';"
$c = $c -replace "useStats\(\)", "useClubStats()"
$c = $c -replace "useEvents\(\)", "useClubEvents()"
$c = $c -replace "useAnnouncements\(\)", "useClubAnnouncements()"
[IO.File]::WriteAllText($f, $c)

# 3. Fix Marquee.tsx
$f = Join-Path $basePath "src\components\home\Marquee.tsx"
$c = Get-Content $f -Raw
$c = $c -replace "useAnnouncements } from '@/hooks/useSiteData'", "useClubAnnouncements } from '@/hooks/useClubData'"
$c = $c -replace "useAnnouncements\(\)", "useClubAnnouncements()"
[IO.File]::WriteAllText($f, $c)

# 4. Fix Gallery.tsx
$f = Join-Path $basePath "src\pages\Gallery.tsx"
$c = Get-Content $f -Raw
$c = $c -replace "import { useEvents, useOccasions } from '@/hooks/useSiteData';", "import { useOccasions } from '@/hooks/useSiteData';`nimport { useClubEvents } from '@/hooks/useClubData';"
$c = $c -replace "useEvents\(\)", "useClubEvents()"
[IO.File]::WriteAllText($f, $c)

# 5. Fix Events.tsx
$f = Join-Path $basePath "src\pages\Events.tsx"
$c = Get-Content $f -Raw
$c = $c -replace "import { useEvents, useOrganizationSettings } from '@/hooks/useSiteData';", "import { useOrganizationSettings } from '@/hooks/useSiteData';`nimport { useClubEvents } from '@/hooks/useClubData';"
$c = $c -replace "useEvents\(", "useClubEvents("
[IO.File]::WriteAllText($f, $c)

# 6. Fix StatsSection.tsx
$f = Join-Path $basePath "src\components\home\StatsSection.tsx"
$c = Get-Content $f -Raw
$c = $c -replace "useStats } from '@/hooks/useSiteData'", "useClubStats } from '@/hooks/useClubData'"
$c = $c -replace "useStats\(\)", "useClubStats()"
[IO.File]::WriteAllText($f, $c)

Write-Host "Done patching all files."
