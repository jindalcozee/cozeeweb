Add-Type -AssemblyName System.Drawing

$logoPath = "c:\Users\hjind\Downloads\WhatsApp Image 2026-03-20 at 1.12.15 PM.jpeg"
$publicDir = "c:\Users\hjind\Downloads\the-cozee-store (2)\public"
$faviconIoDir = "$publicDir\favicon_io"

if (!(Test-Path $logoPath)) {
    Write-Error "Logo not found at $logoPath"
    exit 1
}

function Resize-Image {
    param(
        [string]$SourcePath,
        [string]$TargetPath,
        [int]$Size
    )
    
    try {
        $img = [System.Drawing.Bitmap]::FromFile($SourcePath)
        $newImg = New-Object System.Drawing.Bitmap($Size, $Size)
        $graphics = [System.Drawing.Graphics]::FromImage($newImg)
        
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

        $graphics.DrawImage($img, 0, 0, $Size, $Size)
        
        $newImg.Save($TargetPath, [System.Drawing.Imaging.ImageFormat]::Png)
        
        $graphics.Dispose()
        $img.Dispose()
        $newImg.Dispose()
        Write-Host "Created $TargetPath ($Size x $Size)"
    }
    catch {
        Write-Error "Failed to resize image to ${Size} : $_"
    }
}

# Generate favicon sizes
Resize-Image $logoPath "$faviconIoDir\favicon-16x16.png" 16
Resize-Image $logoPath "$faviconIoDir\favicon-32x32.png" 32
Resize-Image $logoPath "$faviconIoDir\favicon-48x48.png" 48
Resize-Image $logoPath "$faviconIoDir\favicon-96x96.png" 96
Resize-Image $logoPath "$faviconIoDir\apple-touch-icon.png" 180
Resize-Image $logoPath "$faviconIoDir\android-chrome-192x192.png" 192
Resize-Image $logoPath "$faviconIoDir\android-chrome-512x512.png" 512
Resize-Image $logoPath "$publicDir\favicon.png" 512

# Simple ICO creation
Copy-Item "$faviconIoDir\favicon-32x32.png" "$faviconIoDir\favicon.ico"
Write-Host "Copied 32x32 to favicon.ico"
