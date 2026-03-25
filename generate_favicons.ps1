Add-Type -AssemblyName System.Drawing

$logoPath = "C:\Users\hjind\.gemini\antigravity\brain\61002f09-5ec3-4bfd-9bc8-0e129e12a5af\media__1774396635503.jpg"
$publicDir = "c:\Users\hjind\Downloads\the-cozee-store (2)\public"
$faviconIoDir = "$publicDir\favicon_io"

# Target Background Color (Cream)
$bgR = 249; $bgG = 240; $bgB = 223
$tolerance = 40

function Generate-Transparent-Favicons {
    param([string]$SourcePath, [string]$OutputDir)
    
    $img = [System.Drawing.Bitmap]::FromFile($SourcePath)
    $size = [Math]::Min($img.Width, $img.Height)
    
    # Create a square version with transparency
    $squareImg = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($squareImg)
    
    # Fill with transparency
    $graphics.Clear([System.Drawing.Color]::Transparent)
    
    # Draw original (centered and cropped to square)
    $offsetX = ($img.Width - $size) / 2
    $offsetY = ($img.Height - $size) / 2
    $graphics.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $size, $size)), $offsetX, $offsetY, $size, $size, [System.Drawing.GraphicsUnit]::Pixel)
    
    # Remove background color manually (loop through pixels)
    for ($x = 0; $x -lt $size; $x++) {
        for ($y = 0; $y -lt $size; $y++) {
            $p = $squareImg.GetPixel($x, $y)
            if ([Math]::Abs($p.R - $bgR) -lt $tolerance -and [Math]::Abs($p.G - $bgG) -lt $tolerance -and [Math]::Abs($p.B - $bgB) -lt $tolerance) {
                $squareImg.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
            }
        }
    }
    
    # Helper to resize and save
    function Save-Resized {
        param($bmp, $targetSize, $targetPath)
        $newBmp = New-Object System.Drawing.Bitmap($targetSize, $targetSize)
        $g = [System.Drawing.Graphics]::FromImage($newBmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.DrawImage($bmp, 0, 0, $targetSize, $targetSize)
        $newBmp.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $g.Dispose()
        $newBmp.Dispose()
        Write-Host "Created $targetPath ($targetSize x $targetSize)"
    }
    
    # Generate all sizes
    Save-Resized $squareImg 16 "$OutputDir\favicon-16x16.png"
    Save-Resized $squareImg 32 "$OutputDir\favicon-32x32.png"
    Save-Resized $squareImg 48 "$OutputDir\favicon-48x48.png"
    Save-Resized $squareImg 96 "$OutputDir\favicon-96x96.png"
    Save-Resized $squareImg 180 "$OutputDir\apple-touch-icon.png"
    Save-Resized $squareImg 192 "$OutputDir\android-chrome-192x192.png"
    Save-Resized $squareImg 512 "$OutputDir\android-chrome-512x512.png"
    Save-Resized $squareImg 512 "$publicDir\favicon.png"
    
    Copy-Item "$OutputDir\favicon-32x32.png" "$OutputDir\favicon.ico"
    
    $graphics.Dispose()
    $img.Dispose()
    $squareImg.Dispose()
}

Generate-Transparent-Favicons $logoPath $faviconIoDir
