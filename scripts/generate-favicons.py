import os
from PIL import Image

src_image_path = r"d:\aman portfolio\public\favicon-512.png"
dest_dir = r"d:\aman portfolio\public"

# Load the source image
img = Image.open(src_image_path).convert("RGBA")

# Function to resize and save image
def save_icon(image, size, filename, format="PNG"):
    resized = image.resize((size, size), Image.Resampling.LANCZOS)
    path = os.path.join(dest_dir, filename)
    resized.save(path, format=format)
    print(f"Saved {path} ({size}x{size})")

# Save all manifest and favicon images
save_icon(img, 512, "web-app-manifest-512x512.png")
save_icon(img, 192, "web-app-manifest-192x192.png")
save_icon(img, 180, "apple-touch-icon.png")
save_icon(img, 96, "favicon-96x96.png")
save_icon(img, 32, "favicon.ico", format="ICO")

# Clean up the temporary 512.png file
if os.path.exists(src_image_path):
    os.remove(src_image_path)
    print("Temporary high-res PNG cleaned up.")

print("All favicons successfully generated!")
