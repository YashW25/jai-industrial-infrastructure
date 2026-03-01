$files = @(
  "src\pages\Partners.tsx",
  "src\pages\Notice.tsx",
  "src\pages\Events.tsx",
  "src\pages\Downloads.tsx",
  "src\pages\CustomPage.tsx",
  "src\pages\Charter.tsx",
  "src\pages\Certificates.tsx",
  "src\pages\Auth.tsx",
  "src\components\home\ClubAdvantageSection.tsx",
  "src\components\home\CTASection.tsx",
  "src\components\layout\MainLayout.tsx",
  "src\components\layout\Header.tsx",
  "src\components\layout\Footer.tsx"
)

foreach ($file in $files) {
  $path = Join-Path "y:\materproject-yash-main\materproject-yash-main" $file
  $content = Get-Content $path -Raw
  $content = $content -replace 'useSiteSettings', 'useOrganizationSettings'
  [IO.File]::WriteAllText($path, $content)
  Write-Host "Updated $file"
}
