# Refresh PATH and start dev server
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
cd $PSScriptRoot
& "$env:ProgramFiles\nodejs\npm.cmd" run dev
