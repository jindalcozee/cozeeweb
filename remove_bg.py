from PIL import Image, ImageDraw
import sys
import os

def remove_background(image_path, output_path):
    print(f"Processing {image_path}...")
    img = Image.open(image_path).convert("RGBA")
    width, height = img.size
    
    # Get background colors from corners
    color1 = img.getpixel((0, 0))
    color2 = img.getpixel((width - 1, 0))
    
    # Simple check to see if we have a checkerboard
    print(f"Corner colors: {color1}, {color2}")
    
    # We'll use multiple seeds to cover all edges
    seeds = [
        (0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1),
        (width // 2, 0), (width // 2, height - 1), (0, height // 2), (width - 1, height // 2)
    ]
    
    # Target transparency (0,0,0,0)
    target_color = (0, 0, 0, 0)
    
    # We'll perform flood fill for both checkerboard colors
    # Use a bit of tolerance
    tolerance = 10
    
    def is_match(c1, c2):
        return all(abs(c1[i] - c2[i]) < tolerance for i in range(3))

    # Mask to keep track of filled areas to prevent redundant work
    canvas = Image.new('L', (width, height), 0)
    draw = ImageDraw.Draw(img)
    
    # Unfortunately Pillow's floodfill doesn't support transparency well in-place for mask-based logic
    # We'll use a mask-based approach
    mask = Image.new('L', (width, height), 255)
    
    for seed_x, seed_y in seeds:
        seed_color = img.getpixel((seed_x, seed_y))
        if seed_color[3] == 0: continue # Already transparent
        
        # We target the specific color at the seed
        ImageDraw.floodfill(img, (seed_x, seed_y), (0, 0, 0, 0), thresh=tolerance)

    img.save(output_path, "PNG")
    print(f"Saved to {output_path}")

if __name__ == "__main__":
    files = [
        "public/blackyyy_transparent.png",
        "public/navyyy_transparent.png",
        "public/pinkyyy_transparent.png"
    ]
    for f in files:
        if os.path.exists(f):
            remove_background(f, f)
        else:
            print(f"File not found: {f}")
