$compress = @{
    Path = "./src/*"
    Force = $true
    DestinationPath =  "char-select.zip"
}

Compress-Archive @compress


$CcmodFileName = "char-select.ccmod"
if (Test-Path $CcmodFileName) 
{
  Remove-Item $CcmodFileName
}

Rename-Item -Path "char-select.zip" -NewName $CcmodFileName