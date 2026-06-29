import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.core.files.base import ContentFile
from store.models import Category, Product, ProductImage, ProductVariant
from PIL import Image
import io

def generate_dummy_image(color_hex, size=(800, 1000)):
    # Create a simple solid color image
    img = Image.new('RGB', size, color=color_hex)
    byte_arr = io.BytesIO()
    img.save(byte_arr, format='JPEG')
    return ContentFile(byte_arr.getvalue(), name=f"{color_hex.strip('#')}.jpg")

def seed():
    print("Starting database seeding...")
    
    # 1. Clear existing data
    ProductVariant.objects.all().delete()
    ProductImage.objects.all().delete()
    Product.objects.all().delete()
    Category.objects.all().delete()
    print("Cleared existing database records.")

    # 2. Create Categories
    categories_data = [
        {"name": "Oversized Tees", "desc": "Baggy fits, heavy-weight cotton, Gen-Z streetwear certified.", "color": "#1A1A1A"},
        {"name": "Hoodies & Sweatshirts", "desc": "Ultimate comfort meets bold graphics.", "color": "#D4FF00"},
        {"name": "Cargo Pants", "desc": "Tactical designs, relaxed cuts, utility pockets.", "color": "#FF3366"},
        {"name": "Accessories", "desc": "Complete the fit. Caps, socks, and stickers.", "color": "#00E5FF"},
    ]

    categories = {}
    for c_data in categories_data:
        cat = Category.objects.create(
            name=c_data["name"],
            description=c_data["desc"],
            display_order=len(categories)
        )
        # Add category dummy image
        img_file = generate_dummy_image(c_data["color"], size=(400, 400))
        cat.image.save(f"cat_{cat.slug}.jpg", img_file, save=True)
        categories[cat.name] = cat
        print(f"Created category: {cat.name}")

    # 3. Create Products
    products_data = [
        {
            "name": "Nirvana Oversized Tee",
            "desc": "<p>Indian streetwear at its finest. Featuring a premium heavy-weight cotton knit with an oversized, drop-shoulder silhouette. Features a bold screen print on the back inspired by traditional elements merged with modern cyber-punk aesthetics.</p>",
            "story": "Made for the tribe that walks the thin line between ancient values and cyber-punk realities.",
            "category": "Oversized Tees",
            "price": 1299.00,
            "compare_price": 1999.00,
            "is_featured": True,
            "is_new_arrival": True,
            "colors": ["Acid Black", "Vintage White"],
            "sizes": ["M", "L", "XL"],
            "color_hex": "#121212"
        },
        {
            "name": "Tribe Heavy Hoodie",
            "desc": "<p>A premium 450 GSM French terry hoodie built for chilly nights and bold statements. High-density puff print details on front chest, raw metal aglets, and a spacious double-lined hood.</p>",
            "story": "Wrap yourself in the weight of the tribe. Thick, heavy, unapologetic.",
            "category": "Hoodies & Sweatshirts",
            "price": 2499.00,
            "compare_price": 3499.00,
            "is_featured": True,
            "is_new_arrival": False,
            "colors": ["Carbon Grey", "Acid Green"],
            "sizes": ["S", "M", "L", "XL"],
            "color_hex": "#D4FF00"
        },
        {
            "name": "Urban Tech Cargoes",
            "desc": "<p>Water-resistant ripstop nylon cargoes with adjustable ankle straps, six utility pockets, and custom Athnic branding details. Relaxed fit through the thigh with a tapered hem option.</p>",
            "story": "Utility meets the streets. Pockets for your gear, style for the culture.",
            "category": "Cargoes", # Fallback to Cargo Pants
            "price": 1899.00,
            "compare_price": 2799.00,
            "is_featured": False,
            "is_new_arrival": True,
            "colors": ["Olive Drab", "Black"],
            "sizes": ["M", "L", "XL"],
            "color_hex": "#3A4F3B"
        },
        {
            "name": "Street Tribe Cap",
            "desc": "<p>Classic 5-panel unstructured cap with adjustable nylon strap, brass buckle, and embroidered signature Athnic emblem. Breathable metal eyelets.</p>",
            "story": "Crown your vibe. Minimal styling, maximum presence.",
            "category": "Accessories",
            "price": 599.00,
            "compare_price": 999.00,
            "is_featured": False,
            "is_new_arrival": False,
            "colors": ["Black", "Acid Yellow"],
            "sizes": ["M"], # One size fits most
            "color_hex": "#00E5FF"
        }
    ]

    for p_data in products_data:
        cat_name = p_data["category"]
        if cat_name not in categories:
            # Fallback if name slightly differs
            cat_name = "Cargo Pants" if cat_name == "Cargoes" else list(categories.keys())[0]
        
        prod = Product.objects.create(
            name=p_data["name"],
            description=p_data["desc"],
            brand_story_copy=p_data["story"],
            category=categories[cat_name],
            price=p_data["price"],
            compare_price=p_data["compare_price"],
            is_featured=p_data["is_featured"],
            is_new_arrival=p_data["is_new_arrival"],
        )

        # Create product image
        img_file = generate_dummy_image(p_data["color_hex"], size=(600, 800))
        ProductImage.objects.create(
            product=prod,
            image=img_file,
            alt_text=f"{prod.name} default view",
            order=0,
            is_primary=True
        )

        # Create secondary variant image (different color shade)
        img_file_sec = generate_dummy_image("#444444", size=(600, 800))
        ProductImage.objects.create(
            product=prod,
            image=img_file_sec,
            alt_text=f"{prod.name} secondary view",
            order=1,
            is_primary=False
        )

        # Create variants (Sizes x Colors)
        for color in p_data["colors"]:
            for size in p_data["sizes"]:
                sku = f"ATH-{prod.id}-{size}-{color.replace(' ', '').upper()}"
                ProductVariant.objects.create(
                    product=prod,
                    size=size,
                    color=color,
                    sku=sku,
                    stock_quantity=50
                )
        
        print(f"Created product: {prod.name} with {len(p_data['colors']) * len(p_data['sizes'])} variants.")

    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed()
