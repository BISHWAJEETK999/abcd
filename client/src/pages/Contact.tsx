import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Hero from "@/components/Hero";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const { data: content = {} } = useQuery<Record<string, string>>({
    queryKey: ["/api/content"],
  });

  const contactMutation = useMutation({
    mutationFn: (data: typeof formData) => apiRequest("POST", "/api/contact", data),
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Thank you! Your message has been sent.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <>
      <Hero
        title="Get In Touch"
        subtitle="Ready to plan your next adventure? Contact us today!"
      />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="glass-card">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Contact Information */}
                <div className="p-8 text-white">
                  <h3 className="font-poppins text-2xl font-semibold mb-8">
                    Contact Information
                  </h3>

                  <div className="space-y-6">
                    <div className="flex items-center">
                      <i className="bi bi-telephone-fill me-4 text-xl"></i>
                      <span className="text-lg">
                        {content["contact.phone"] || "+91 8100331032"}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <i className="bi bi-envelope-fill me-4 text-xl"></i>
                      <span className="text-lg">
                        {content["contact.email"] || "ttrave.travelagency@gmail.com"}
                      </span>
                    </div>

                    <div className="flex items-start">
                      <i className="bi bi-geo-alt-fill me-4 text-xl mt-1"></i>
                      <span className="text-lg">
                        {content["contact.address"] || 
                          "B-12, Shop No. - 111/19, Saptaparni Market, Kalyani Central Park - ward no. 11, Nadia- 741235, West Bengal, India"}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-6 mt-8">
                    <a
                      href={content["social.facebook"] || "#"}
                      className="text-white hover:text-ttrave-light-blue text-2xl transition-colors"
                      data-testid="contact-social-facebook"
                    >
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a
                      href={content["social.twitter"] || "#"}
                      className="text-white hover:text-ttrave-light-blue text-2xl transition-colors"
                      data-testid="contact-social-twitter"
                    >
                      <i className="bi bi-twitter"></i>
                    </a>
                    <a
                      href={content["social.instagram"] || "#"}
                      className="text-white hover:text-ttrave-light-blue text-2xl transition-colors"
                      data-testid="contact-social-instagram"
                    >
                      <i className="bi bi-instagram"></i>
                    </a>
                    <a
                      href={content["social.linkedin"] || "#"}
                      className="text-white hover:text-ttrave-light-blue text-2xl transition-colors"
                      data-testid="contact-social-linkedin"
                    >
                      <i className="bi bi-linkedin"></i>
                    </a>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-white">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          data-testid="contact-first-name-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-white">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          data-testid="contact-last-name-input"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        data-testid="contact-email-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject" className="text-white">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        data-testid="contact-subject-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-white">
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        data-testid="contact-message-input"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="btn-primary-ttrave w-full md:w-auto"
                      disabled={contactMutation.isPending}
                      data-testid="contact-submit-button"
                    >
                      {contactMutation.isPending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
