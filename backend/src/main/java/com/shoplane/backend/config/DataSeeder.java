package com.shoplane.backend.config;

import com.shoplane.backend.model.Product;
import com.shoplane.backend.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedProducts(ProductRepository repo) {
        return args -> {
            if (repo.count() > 0) return;

            // CLOTHING
            repo.save(p("Classic White Shirt","Zara",1299.0,"A timeless white shirt crafted from premium Egyptian cotton. Perfect for formal and casual wear.","https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600","clothing",false,"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600,https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600"));
            repo.save(p("Slim Fit Chinos","Levi's",1899.0,"Modern slim fit chinos in stretch cotton blend. Comfortable and versatile.","https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600","clothing",false,"https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600,https://images.unsplash.com/photo-1565084888279-aca607bb4b01?w=600"));
            repo.save(p("Floral Summer Dress","Pantaloons",2199.0,"Light and breezy floral print dress for women. Ideal for summer outings.","https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600","clothing",false,"https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600,https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600"));
            repo.save(p("Oversized Hoodie","UCB",2499.0,"Cosy oversized hoodie in premium fleece. Unisex design, great for cooler days.","https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600","clothing",false,"https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600,https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=600"));
            repo.save(p("Linen Kurta","Pantaloons",999.0,"Comfortable handloom linen kurta with subtle embroidery. Perfect for festive occasions.","https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600","clothing",false,"https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600"));
            repo.save(p("Denim Jacket","Levi's",3499.0,"Classic denim jacket with modern slim cut. A wardrobe essential for every season.","https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600","clothing",false,"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600,https://images.unsplash.com/photo-1604644401890-0bd678c83788?w=600"));
            repo.save(p("Cotton Polo Shirt","Zara",1499.0,"Classic polo in 100% pique cotton. Breathable and easy to style.","https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600","clothing",false,"https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600"));
            repo.save(p("Midi Wrap Dress","Pantaloons",1899.0,"Elegant midi wrap dress in flowing chiffon. Flattering for all body types.","https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600","clothing",false,"https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600"));
            repo.save(p("Graphic Tee","UCB",799.0,"Bold graphic print tee in soft ring-spun cotton. Express your personality.","https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600","clothing",false,"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600"));
            repo.save(p("Tailored Blazer","Zara",4999.0,"Sharp tailored blazer in stretch wool blend. From boardroom to evening.","https://images.unsplash.com/photo-1594938298603-c8148c4b4730?w=600","clothing",false,"https://images.unsplash.com/photo-1594938298603-c8148c4b4730?w=600"));
            repo.save(p("Ethnic Salwar Set","Pantaloons",2799.0,"Elegant salwar kameez with delicate block print. Perfect for weddings.","https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600","clothing",false,"https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600"));
            repo.save(p("Bomber Jacket","Levi's",3799.0,"Sleek bomber jacket with ribbed cuffs. A streetwear staple.","https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600","clothing",false,"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600"));

            // ACCESSORIES
            repo.save(p("Leather Wrist Watch","Zara",3999.0,"Elegant brown leather strap watch, minimalist dial, water-resistant 30m.","https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600","accessory",true,"https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600,https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600"));
            repo.save(p("Canvas Tote Bag","UCB",899.0,"Sturdy canvas tote with zip closure and inner pocket. Eco-friendly.","https://images.unsplash.com/photo-1544816155-12df9643f363?w=600","accessory",true,"https://images.unsplash.com/photo-1544816155-12df9643f363?w=600"));
            repo.save(p("Aviator Sunglasses","Levi's",1499.0,"Classic gold-frame aviators with UV400 protection. Timeless style.","https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600","accessory",true,"https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600,https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600"));
            repo.save(p("Silk Neck Scarf","Zara",699.0,"Lightweight silk scarf in vibrant prints. Versatile styling options.","https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600","accessory",true,"https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600"));
            repo.save(p("Full-Grain Leather Belt","Pantaloons",799.0,"Full-grain leather belt with classic pin-buckle in black and tan.","https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600","accessory",true,"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"));
            repo.save(p("Pearl Necklace","Zara",1199.0,"Delicate faux pearl necklace on a gold-toned chain. Elevates any outfit.","https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600","accessory",true,"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600"));
            repo.save(p("Pebbled Crossbody Bag","Pantaloons",2199.0,"Compact crossbody in pebbled vegan leather with adjustable strap.","https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600","accessory",true,"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600"));
            repo.save(p("Stainless Steel Watch","Levi's",5499.0,"Premium stainless steel watch with sapphire-coated crystal and date display.","https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600","accessory",true,"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"));

            System.out.println("✅  Seeded " + repo.count() + " products.");
        };
    }

    private Product p(String name, String brand, Double price, String desc,
                      String preview, String category, boolean isAccessory, String photosRaw) {
        Product prod = new Product();
        prod.setName(name); prod.setBrand(brand); prod.setPrice(price);
        prod.setDescription(desc); prod.setPreview(preview);
        prod.setCategory(category); prod.setIsAccessory(isAccessory);
        prod.setPhotosRaw(photosRaw);
        return prod;
    }
}
