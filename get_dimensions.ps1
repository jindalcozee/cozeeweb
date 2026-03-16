Add-Type -AssemblyName System.Drawing
$files = Get-ChildItem public\*.png | Where-Object { $_.Name -match 'transparent|grey-1' }
foreach ($file in $files) {
    $img = [System.Drawing.Image]::FromFile($file.FullName)
    Write-Host "$($file.Name): $($img.Width)x$($img.Height)"
    $img.Dispose()
}
