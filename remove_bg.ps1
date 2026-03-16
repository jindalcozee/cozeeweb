Add-Type -AssemblyName System.Drawing

function Remove-Checkerboard {
    param(
        [string]$ImagePath,
        [string]$OutputPath
    )
    
    Write-Host "Processing $ImagePath..."
    $file = Get-Item $ImagePath
    $img = [System.Drawing.Bitmap]::FromFile($file.FullName)
    $newImg = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
    
    # Corner colors as baseline
    $c1 = $img.GetPixel(0,0)
    $c2 = $img.GetPixel(5,0)
    
    $tolerance = 15
    
    function IsMatch($pixel, $target) {
        return ([Math]::Abs($pixel.R - $target.R) -lt $tolerance) -and `
               ([Math]::Abs($pixel.G - $target.G) -lt $tolerance) -and `
               ([Math]::Abs($pixel.B - $target.B) -lt $tolerance)
    }

    for ($x = 0; $x -lt $img.Width; $x++) {
        for ($y = 0; $y -lt $img.Height; $y++) {
            $p = $img.GetPixel($x, $y)
            if ((IsMatch $p $c1) -or (IsMatch $p $c2)) {
                $newImg.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
            } else {
                $newImg.SetPixel($x, $y, $p)
            }
        }
    }
    
    $newImg.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $img.Dispose()
    $newImg.Dispose()
    Write-Host "Saved to $OutputPath"
}

$files = @(
    "public\blackyyy_transparent.png",
    "public\navyyy_transparent.png",
    "public\pinkyyy_transparent.png"
)

foreach ($f in $files) {
    if (Test-Path $f) {
        Remove-Checkerboard $f $f
    } else {
        Write-Warning "File not found: $f"
    }
}
