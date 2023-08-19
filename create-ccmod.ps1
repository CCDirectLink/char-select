$modname = "char-select"

$CcmodFileName = $modname + ".ccmod"
if (Test-Path $CcmodFileName) 
{
  Remove-Item $CcmodFileName
}

$compress = @{
    Path = "./*"
    Force = $true
    DestinationPath =  $modname + ".zip"
}

Compress-Archive @compress

Rename-Item -Path ($modname + ".zip") -NewName $CcmodFileName