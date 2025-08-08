import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import Hero from "@/components/Hero";
import { STOCK_IMAGES } from "@/lib/constants";

export default function About() {
  const { data: content = {} } = useQuery<Record<string, string>>({
    queryKey: ["/api/content"],
  });

  return (
    <>
      <Hero
        title="About TTravel Hospitality"
        subtitle="Your trusted partner for unforgettable travel experiences"
      />

      {/* Who We Are Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-poppins text-3xl font-semibold mb-6 text-ttrave-dark-gray">
                Who We Are
              </h2>
              <p className="text-lg mb-6 text-gray-700 leading-relaxed">
                TTravel Hospitality is a premier travel agency dedicated to creating extraordinary travel experiences. 
                With over a decade of expertise in the travel industry, we specialize in both domestic and international 
                travel packages that cater to every traveler's dreams.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our team of experienced travel consultants works tirelessly to ensure that every journey you take with us 
                is seamless, memorable, and perfectly tailored to your preferences. From cultural expeditions to adventure 
                tours, we have something special for everyone.
              </p>
            </div>
            <div>
              <img
                src={STOCK_IMAGES.about}
                alt="Travel Planning"
                className="rounded-2xl shadow-xl w-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-ttrave-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-poppins text-3xl font-semibold text-ttrave-dark-gray">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg h-full">
              <CardContent className="p-8">
                <div className="text-ttrave-primary mb-6">
                  <i className="bi bi-bullseye text-5xl"></i>
                </div>
                <h4 className="font-poppins text-xl font-semibold mb-4 text-ttrave-dark-gray">
                  Our Mission
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  To provide exceptional travel experiences that create lasting memories and foster cultural understanding 
                  through personalized service and attention to detail.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg h-full">
              <CardContent className="p-8">
                <div className="text-ttrave-primary mb-6">
                  <i className="bi bi-eye text-5xl"></i>
                </div>
                <h4 className="font-poppins text-xl font-semibold mb-4 text-ttrave-dark-gray">
                  Our Vision
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  To be the leading travel agency that connects people with the world's most beautiful destinations 
                  while promoting sustainable and responsible tourism practices.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg h-full">
              <CardContent className="p-8">
                <div className="text-ttrave-primary mb-6">
                  <i className="bi bi-heart text-5xl"></i>
                </div>
                <h4 className="font-poppins text-xl font-semibold mb-4 text-ttrave-dark-gray">
                  Our Values
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  Integrity, Excellence, Customer Focus, Innovation, and Sustainability guide every decision we make 
                  and every service we provide to our valued customers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
