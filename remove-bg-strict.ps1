Add-Type -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

public class ImageProcessor {
    public static void RemoveWhiteBackground(string inputPath) {
        if (!File.Exists(inputPath)) {
            Console.WriteLine("File not found: " + inputPath);
            return;
        }

        Bitmap bmp = new Bitmap(inputPath);
        Bitmap clone = new Bitmap(bmp.Width, bmp.Height, PixelFormat.Format32bppArgb);
        
        using (Graphics gr = Graphics.FromImage(clone)) {
            gr.DrawImage(bmp, new Rectangle(0, 0, clone.Width, clone.Height));
        }
        bmp.Dispose();
        
        BitmapData bmpData = clone.LockBits(new Rectangle(0, 0, clone.Width, clone.Height), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
        
        int bytes = Math.Abs(bmpData.Stride) * clone.Height;
        byte[] rgbValues = new byte[bytes];
        
        System.Runtime.InteropServices.Marshal.Copy(bmpData.Scan0, rgbValues, 0, bytes);
        
        for (int i = 0; i < rgbValues.Length; i += 4) {
            byte b = rgbValues[i];
            byte g = rgbValues[i+1];
            byte r = rgbValues[i+2];
            
            // Background is close to white e.g. RGB(242, 240, 235), so use a wider threshold.
            // Be more aggressive.
            if (r >= 230 && g >= 230 && b >= 230) {
                // If it is fairly light, check if it's kinda gray/white
                int max = Math.Max(Math.Max(r, g), b);
                int min = Math.Min(Math.Min(r, g), b);
                
                // Low saturation indicates white/gray color, not a bright colored part
                if (max - min < 20) {
                    rgbValues[i+3] = 0; // Make transparent
                }
            } else if (r >= 245 && g >= 245 && b >= 245) {
                // Extreme whites are background
                rgbValues[i+3] = 0; 
            }
        }
        
        System.Runtime.InteropServices.Marshal.Copy(rgbValues, 0, bmpData.Scan0, bytes);
        clone.UnlockBits(bmpData);
        
        string outputPath = inputPath.Replace(".PNG", "-transparent.png").Replace(".png", "-transparent.png");
        clone.Save(outputPath, ImageFormat.Png);
        clone.Dispose();
        Console.WriteLine("Saved: " + outputPath);
    }
}
"@ -ReferencedAssemblies System.Drawing

try {
    Write-Host "Processing images..."
    [ImageProcessor]::RemoveWhiteBackground("c:\Users\hjind\Downloads\the-cozee-store (2)\public\navyyy.png.PNG")
    [ImageProcessor]::RemoveWhiteBackground("c:\Users\hjind\Downloads\the-cozee-store (2)\public\blackyyy.png.PNG")
    [ImageProcessor]::RemoveWhiteBackground("c:\Users\hjind\Downloads\the-cozee-store (2)\public\pinkyyy.png.PNG")
    Write-Host "Done processing!"
} catch {
    Write-Error $_
}
