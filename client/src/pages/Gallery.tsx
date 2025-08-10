import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Hero from "@/components/Hero";

interface GalleryImage {
  id: string;
  imageUrl: string;
  title: string;
  review: string;
  uploaderName: string;
  uploaderEmail: string;
  isApproved: boolean;
  createdAt: string;
}

export default function Gallery() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    imageUrl: "",
    title: "",
    review: "",
    uploaderName: "",
    uploaderEmail: "",
  });

  const { data: images = [], isLoading } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
  });

  const uploadMutation = useMutation({
    mutationFn: (data: typeof uploadData) => apiRequest("POST", "/api/gallery", data),
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your image has been submitted for review. It will appear in the gallery once approved.",
      });
      setShowUploadForm(false);
      setUploadData({
        imageUrl: "",
        title: "",
        review: "",
        uploaderName: "",
        uploaderEmail: "",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate image URL
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(uploadData.imageUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate(uploadData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUploadData({
      ...uploadData,
      [e.target.id]: e.target.value,
    });
  };

  if (isLoading) {
    return (
      <>
        <Hero title="Travel Gallery" subtitle="Share your travel experiences with us!" />
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-center">
              <div className="text-center">Loading gallery...</div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Hero title="Travel Gallery" subtitle="Share your travel experiences with us!" />
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Upload Button */}
            <div className="text-center mb-12">
              <Dialog open={showUploadForm} onOpenChange={setShowUploadForm}>
                <DialogTrigger asChild>
                  <Button className="btn-primary-ttrave" data-testid="upload-image-button">
                    <i className="bi bi-camera me-2"></i>
                    Share Your Travel Photo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Upload Your Travel Photo</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="imageUrl" className="text-gray-700">
                        Image URL *
                      </Label>
                      <Input
                        id="imageUrl"
                        type="url"
                        value={uploadData.imageUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/your-image.jpg"
                        required
                        data-testid="upload-image-url"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Upload your image to a service like Imgur, Google Drive, or Dropbox and paste the direct link here
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="title" className="text-gray-700">
                        Photo Title *
                      </Label>
                      <Input
                        id="title"
                        value={uploadData.title}
                        onChange={handleChange}
                        placeholder="e.g., Sunset at Goa Beach"
                        required
                        data-testid="upload-image-title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="review" className="text-gray-700">
                        Your Travel Experience *
                      </Label>
                      <Textarea
                        id="review"
                        rows={4}
                        value={uploadData.review}
                        onChange={handleChange}
                        placeholder="Share your travel experience, what made this place special..."
                        required
                        data-testid="upload-image-review"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="uploaderName" className="text-gray-700">
                          Your Name *
                        </Label>
                        <Input
                          id="uploaderName"
                          value={uploadData.uploaderName}
                          onChange={handleChange}
                          placeholder="Your full name"
                          required
                          data-testid="upload-uploader-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="uploaderEmail" className="text-gray-700">
                          Your Email *
                        </Label>
                        <Input
                          id="uploaderEmail"
                          type="email"
                          value={uploadData.uploaderEmail}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          required
                          data-testid="upload-uploader-email"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        type="submit"
                        className="btn-primary-ttrave flex-1"
                        disabled={uploadMutation.isPending}
                        data-testid="upload-submit-button"
                      >
                        {uploadMutation.isPending ? "Uploading..." : "Submit for Review"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowUploadForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Gallery Grid */}
            {images.length === 0 ? (
              <div className="text-center py-12">
                <i className="bi bi-images text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No photos yet</h3>
                <p className="text-gray-500 mb-6">Be the first to share your travel experience!</p>
                <Button 
                  onClick={() => setShowUploadForm(true)}
                  className="btn-primary-ttrave"
                >
                  Upload First Photo
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {images.map((image) => (
                  <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square relative">
                      <img
                        src={image.imageUrl}
                        alt={image.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop";
                        }}
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{image.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                        {image.review}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>By {image.uploaderName}</span>
                        <span>{new Date(image.createdAt).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Upload Instructions */}
            <div className="mt-16 bg-white rounded-lg p-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">How to Share Your Photos</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <i className="bi bi-cloud-upload text-3xl text-ttrave-blue mb-3"></i>
                  <h4 className="font-semibold mb-2">1. Upload Your Photo</h4>
                  <p className="text-sm text-gray-600">Upload your travel photo to a service like Imgur, Google Drive, or Dropbox</p>
                </div>
                <div className="text-center">
                  <i className="bi bi-link-45deg text-3xl text-ttrave-blue mb-3"></i>
                  <h4 className="font-semibold mb-2">2. Get the Link</h4>
                  <p className="text-sm text-gray-600">Copy the direct image URL and paste it in our form</p>
                </div>
                <div className="text-center">
                  <i className="bi bi-check-circle text-3xl text-ttrave-blue mb-3"></i>
                  <h4 className="font-semibold mb-2">3. Share Your Story</h4>
                  <p className="text-sm text-gray-600">Add your travel experience and submit for review</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}