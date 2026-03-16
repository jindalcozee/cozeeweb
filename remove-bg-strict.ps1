Add-Type -AssemblyName System.Drawing

function Resize-Image {
    param(
        [System.Drawing.Bitmap]$img,
        [int]$targetWidth,
        [int]$targetHeight
    )
    
    $newImg = New-Object System.Drawing.Bitmap $targetWidth, $targetHeight
    $g = [System.Drawing.Graphics]::FromImage($newImg)
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    
    # Calculate scaling factor to fit the image while maintaining aspect ratio
    $ratioX = $targetWidth / $img.Width
    $ratioY = $targetHeight / $img.Height
    $ratio = [Math]::Min($ratioX, $ratioY)
    
    # Scale down slightly to leave a small margin if it hits the edges
    $scale = 0.95
    $ratio = $ratio * $scale

    $newWidth = [int]($img.Width * $ratio)
    $newHeight = [int]($img.Height * $ratio)
    
    # Calculate centering
    $posX = [int](($targetWidth - $newWidth) / 2)
    $posY = [int](($targetHeight - $newHeight) / 2)
    
    $g.DrawImage($img, $posX, $posY, $newWidth, $newHeight)
    $g.Dispose()
    
    return $newImg
}

function Flood-Fill-Transparency {
    param(
        [string]$ImagePath,
        [string]$OutputPath
    )
    
    if (!(Test-Path $ImagePath)) {
        Write-Warning "File not found: $ImagePath"
        return
    }

    Write-Host "Processing $ImagePath..."
    $file = Get-Item $ImagePath
    $img = [System.Drawing.Bitmap]::FromFile($file.FullName)
    $width = $img.Width
    $height = $img.Height
    
    # Checkered backgrounds usually have two colors. 
    # Let's sample a few points in the corner to find them.
    $colorA = $img.GetPixel(0, 0)
    $colorB = $null
    
    # Try to find the second color of the checkerboard near the corner
    for ($x = 0; $x -lt 20; $x++) {
        for ($y = 0; $y -lt 20; $y++) {
            $p = $img.GetPixel($x, $y)
            if ($p.R -ne $colorA.R -or $p.G -ne $colorA.G -or $p.B -ne $colorA.B) {
                $colorB = $p
                break
            }
        }
        if ($colorB) { break }
    }

    if ($null -eq $colorB) {
        Write-Host "Could only find one background color. Using single color detection."
        $targets = @($colorA)
    } else {
        Write-Host "Detected checkered pattern: RGB($($colorA.R),$($colorA.G),$($colorA.B)) and RGB($($colorB.R),$($colorB.G),$($colorB.B))"
        $targets = @($colorA, $colorB)
    }
    
    # We'll use a queue for flood fill
    $queue = New-Object System.Collections.Generic.Queue[System.Drawing.Point]
    $visited = New-Object 'bool[,]' $width, $height
    
    # Seeds: All edges to ensure we catch all background areas
    for($x=0; $x -lt $width; $x++) { 
        $queue.Enqueue((New-Object System.Drawing.Point($x, 0)))
        $queue.Enqueue((New-Object System.Drawing.Point($x, ($height - 1))))
    }
    for($y=0; $y -lt $height; $y++) {
        $queue.Enqueue((New-Object System.Drawing.Point(0, $y)))
        $queue.Enqueue((New-Object System.Drawing.Point(($width - 1), $y)))
    }

    $tolerance = 40 # Increased tolerance for compressed JPG/PNG artifacts
    
    function IsBackground($p) {
        foreach($t in $targets) {
            if ([Math]::Abs($p.R - $t.R) -lt $tolerance -and `
                [Math]::Abs($p.G - $t.G) -lt $tolerance -and `
                [Math]::Abs($p.B - $t.B) -lt $tolerance) {
                return $true
            }
        }
        return $false
    }

    Write-Host "Running flood fill..."
    while ($queue.Count -gt 0) {
        $curr = $queue.Dequeue()
        if ($curr.X -lt 0 -or $curr.X -ge $width -or $curr.Y -lt 0 -or $curr.Y -ge $height) { continue }
        if ($visited[$curr.X, $curr.Y]) { continue }
        
        $p = $img.GetPixel($curr.X, $curr.Y)
        if (IsBackground $p) {
            $visited[$curr.X, $curr.Y] = $true
            $img.SetPixel($curr.X, $curr.Y, [System.Drawing.Color]::Transparent)
            
            # Add neighbors
            $queue.Enqueue((New-Object System.Drawing.Point(($curr.X + 1), $curr.Y)))
            $queue.Enqueue((New-Object System.Drawing.Point(($curr.X - 1), $curr.Y)))
            $queue.Enqueue((New-Object System.Drawing.Point($curr.X, ($curr.Y + 1))))
            $queue.Enqueue((New-Object System.Drawing.Point($curr.X, ($curr.Y - 1))))
        }
    }
    
    # NEW: Resize and Pad to 848x1264
    Write-Host "Resizing to 848x1264..."
    $resizedImg = Resize-Image $img 848 1264
    $img.Dispose()
    
    # Save to a temporary file first
    $tempPath = [System.IO.Path]::GetTempFileName() + ".png"
    $resizedImg.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $resizedImg.Dispose()
    
    # Copy back to original location
    Move-Item -Path $tempPath -Destination $OutputPath -Force
    Write-Host "Finished saving to $OutputPath"
}

$targetFiles = @{
    "public\navyyy-old.png" = "public\navyyy_transparent.png"
    "public\blackyyy-old.png" = "public\blackyyy_transparent.png"
    "public\pinkyyy-old.png" = "public\pinkyyy_transparent.png"
    "public\grey-1.png" = "public\grey_transparent.png"
}

foreach ($f in $targetFiles.Keys) {
    Flood-Fill-Transparency $f $targetFiles[$f]
}

