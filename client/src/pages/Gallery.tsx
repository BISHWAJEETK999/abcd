import Hero from "@/components/Hero";
import { STOCK_IMAGES } from "@/lib/constants";

export default function Gallery() {
  return (
    <>
      <Hero
        title="Photo Gallery"
        subtitle="Explore our beautiful travel moments"
      />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {STOCK_IMAGES.gallery.map((image, index) => (
              <div key={index} className="group cursor-pointer">
                <img
                  src={image}
                  alt={`Gallery Image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
