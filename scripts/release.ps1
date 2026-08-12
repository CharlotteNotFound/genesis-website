param(
  [Parameter(Mandatory = $true)]
  [ValidatePattern('^\d+\.\d+\.\d+$')]
  [string]$Version,

  [Parameter(Mandatory = $true)]
  [ValidateNotNullOrEmpty()]
  [string]$Message
)

$ErrorActionPreference = 'Stop'
$repositoryRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
Set-Location -LiteralPath $repositoryRoot

if (-not (Test-Path -LiteralPath '.git')) {
  throw 'This folder is not a Git repository.'
}

$tag = "v$Version"
if (git tag --list $tag) {
  throw "Tag $tag already exists. Choose a new semantic version."
}

$currentBranch = git branch --show-current
if ($currentBranch -ne 'main') {
  throw "Releases must be created from main. Current branch: $currentBranch"
}

Set-Content -LiteralPath 'VERSION' -Value $Version -Encoding utf8
git add --all

$stagedChanges = git diff --cached --name-only
if (-not $stagedChanges) {
  throw 'There are no changes to release.'
}

git commit -m "release: $tag - $Message"
git tag -a $tag -m "Genesis website $tag - $Message"
git push origin main
git push origin $tag

Write-Host "Released $tag to origin/main."
