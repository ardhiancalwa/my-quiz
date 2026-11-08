$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$manifestPath = Join-Path $projectRoot 'tmp/audio-manifest.json'
$outputRoot = Join-Path $projectRoot 'public/audio'
$wavRoot = Join-Path $projectRoot 'tmp/audio'
New-Item -ItemType Directory -Force -Path $outputRoot, $wavRoot | Out-Null
Add-Type -AssemblyName System.Speech
$synthesizer = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synthesizer.SelectVoice('Microsoft Zira Desktop')
$synthesizer.Rate = -1
foreach ($asset in (Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json)) {
  if ($asset.id -notmatch '^[a-z0-9-]+$') { throw 'Invalid audio id' }
  $wavPath = Join-Path $wavRoot ($asset.id + '.wav')
  $mp3Path = Join-Path $outputRoot ($asset.id + '.mp3')
  $synthesizer.SetOutputToWaveFile($wavPath)
  $synthesizer.Speak($asset.text)
  $synthesizer.SetOutputToNull()
  & ffmpeg -hide_banner -loglevel error -y -i $wavPath -ac 1 -ar 24000 -b:a 48k $mp3Path
  if ($LASTEXITCODE -ne 0) { throw "Audio conversion failed: $($asset.id)" }
}
$synthesizer.Dispose()
Write-Output 'Demo audio generated. Operator must review pronunciation and redistribution rights before publication.'
