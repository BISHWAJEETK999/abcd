import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState("content");
  const [editingDestination, setEditingDestination] = useState<any>(null);
  const [showAddDestination, setShowAddDestination] = useState(false);
  const [newDestination, setNewDestination] = useState({
    name: "",
    type: "domestic" as "domestic" | "international",
    imageUrl: "",
    formUrl: "",
    icon: ""
  });

  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [newPackage, setNewPackage] = useState({
    destinationId: "",
    name: "",
    description: "",
    imageUrl: "",
    pricePerPerson: "",
    duration: "",
    highlights: [""],
    location: "",
    isFeatured: false
  });

  const { data: content = {} } = useQuery<Record<string, string>>({
    queryKey: ["/api/content"],
  });

  const { data: destinations = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/destinations"],
  });

  const { data: contactSubmissions = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/contact-submissions"],
  });

  const { data: stats = {} } = useQuery<Record<string, number>>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: packages = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/packages"],
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/logout"),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Logout successful",
      });
      onLogout();
    },
  });

  const updateContentMutation = useMutation({
    mutationFn: (updates: { key: string; value: string }[]) =>
      apiRequest("PUT", "/api/admin/content", updates),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
    },
  });

  const addDestinationMutation = useMutation({
    mutationFn: (destination: typeof newDestination) =>
      apiRequest("POST", "/api/admin/destinations", destination),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Destination added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/destinations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/destinations/domestic"] });
      queryClient.invalidateQueries({ queryKey: ["/api/destinations/international"] });
      setShowAddDestination(false);
      setNewDestination({ name: "", type: "domestic", imageUrl: "", formUrl: "", icon: "" });
    },
  });

  const updateDestinationMutation = useMutation({
    mutationFn: (destination: any) =>
      apiRequest("PUT", `/api/admin/destinations/${destination.id}`, destination),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Destination updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/destinations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/destinations/domestic"] });
      queryClient.invalidateQueries({ queryKey: ["/api/destinations/international"] });
      setEditingDestination(null);
    },
  });

  const deleteDestinationMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest("DELETE", `/api/admin/destinations/${id}`),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Destination deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/destinations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/destinations/domestic"] });
      queryClient.invalidateQueries({ queryKey: ["/api/destinations/international"] });
    },
  });

  const addPackageMutation = useMutation({
    mutationFn: (packageData: typeof newPackage) =>
      apiRequest("POST", "/api/admin/packages", packageData),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Package added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/packages"] });
      setShowAddPackage(false);
      setNewPackage({
        destinationId: "",
        name: "",
        description: "",
        imageUrl: "",
        pricePerPerson: "",
        duration: "",
        highlights: [""],
        location: "",
        isFeatured: false
      });
    },
  });

  const updatePackageMutation = useMutation({
    mutationFn: (packageData: any) =>
      apiRequest("PUT", `/api/admin/packages/${packageData.id}`, packageData),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Package updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/packages"] });
      setEditingPackage(null);
    },
  });

  const deletePackageMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest("DELETE", `/api/admin/packages/${id}`),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Package deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/packages"] });
    },
  });

  const handleSaveContent = () => {
    const formData = new FormData(document.getElementById("contentForm") as HTMLFormElement);
    const updates: { key: string; value: string }[] = [];
    
    Array.from(formData.entries()).forEach(([key, value]) => {
      updates.push({ key: key as string, value: value as string });
    });
    
    updateContentMutation.mutate(updates);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleAddDestination = () => {
    addDestinationMutation.mutate(newDestination);
  };

  const handleUpdateDestination = () => {
    if (editingDestination) {
      updateDestinationMutation.mutate(editingDestination);
    }
  };

  const handleDeleteDestination = (id: string) => {
    if (confirm("Are you sure you want to delete this destination?")) {
      deleteDestinationMutation.mutate(id);
    }
  };

  const handleAddPackage = () => {
    addPackageMutation.mutate(newPackage);
  };

  const handleUpdatePackage = () => {
    if (editingPackage) {
      updatePackageMutation.mutate(editingPackage);
    }
  };

  const handleDeletePackage = (id: string) => {
    if (confirm("Are you sure you want to delete this package?")) {
      deletePackageMutation.mutate(id);
    }
  };

  const addHighlight = (isNew = false) => {
    if (isNew) {
      setNewPackage({ ...newPackage, highlights: [...newPackage.highlights, ""] });
    } else if (editingPackage) {
      setEditingPackage({ ...editingPackage, highlights: [...editingPackage.highlights, ""] });
    }
  };

  const removeHighlight = (index: number, isNew = false) => {
    if (isNew) {
      const highlights = newPackage.highlights.filter((_: string, i: number) => i !== index);
      setNewPackage({ ...newPackage, highlights: highlights.length ? highlights : [""] });
    } else if (editingPackage) {
      const highlights = editingPackage.highlights.filter((_: string, i: number) => i !== index);
      setEditingPackage({ ...editingPackage, highlights: highlights.length ? highlights : [""] });
    }
  };

  const updateHighlight = (index: number, value: string, isNew = false) => {
    if (isNew) {
      const highlights = [...newPackage.highlights];
      highlights[index] = value;
      setNewPackage({ ...newPackage, highlights });
    } else if (editingPackage) {
      const highlights = [...editingPackage.highlights];
      highlights[index] = value;
      setEditingPackage({ ...editingPackage, highlights });
    }
  };

  return (
    <div className="admin-panel">
      <div className="container-fluid px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="admin-sidebar">
              <div className="text-center mb-6">
                <i className="bi bi-person-circle text-ttrave-primary text-5xl"></i>
                <h5 className="font-poppins text-lg font-semibold mt-2">Welcome, Admin</h5>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveSection("content")}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    activeSection === "content" 
                      ? "bg-ttrave-primary text-white" 
                      : "hover:bg-gray-100"
                  }`}
                  data-testid="admin-nav-content"
                >
                  <i className="bi bi-file-text"></i>
                  <span>Content Management</span>
                </button>
                <button
                  onClick={() => setActiveSection("destinations")}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    activeSection === "destinations" 
                      ? "bg-ttrave-primary text-white" 
                      : "hover:bg-gray-100"
                  }`}
                  data-testid="admin-nav-destinations"
                >
                  <i className="bi bi-geo-alt"></i>
                  <span>Destinations</span>
                </button>
                <button
                  onClick={() => setActiveSection("packages")}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    activeSection === "packages" 
                      ? "bg-ttrave-primary text-white" 
                      : "hover:bg-gray-100"
                  }`}
                  data-testid="admin-nav-packages"
                >
                  <i className="bi bi-box"></i>
                  <span>Travel Packages</span>
                </button>
                <button
                  onClick={() => setActiveSection("submissions")}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    activeSection === "submissions" 
                      ? "bg-ttrave-primary text-white" 
                      : "hover:bg-gray-100"
                  }`}
                  data-testid="admin-nav-submissions"
                >
                  <i className="bi bi-chat-dots"></i>
                  <span>Form Submissions</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-lg flex items-center space-x-2 text-red-600 hover:bg-red-50 transition-colors"
                  data-testid="admin-logout-button"
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Content Management */}
            {activeSection === "content" && (
              <div className="admin-content">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-poppins text-2xl font-semibold">Content Management</h2>
                  <Button
                    onClick={handleSaveContent}
                    className="btn-primary-ttrave"
                    disabled={updateContentMutation.isPending}
                    data-testid="save-content-button"
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    {updateContentMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>

                <form id="contentForm" className="space-y-6">
                  <Card>
                    <CardHeader className="bg-ttrave-primary text-white">
                      <CardTitle className="flex items-center">
                        <i className="bi bi-image me-2"></i>
                        Site Logo & Branding
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="site.logo">Site Logo URL</Label>
                          <Input
                            id="site.logo"
                            name="site.logo"
                            defaultValue={content["site.logo"] || ""}
                            placeholder="Enter logo image URL"
                            data-testid="input-site-logo"
                          />
                          <p className="text-sm text-gray-500 mt-1">Upload your logo to an image hosting service and paste the URL here</p>
                        </div>
                        <div>
                          <Label htmlFor="site.name">Site Name</Label>
                          <Input
                            id="site.name"
                            name="site.name"
                            defaultValue={content["site.name"] || ""}
                            placeholder="Enter site name"
                            data-testid="input-site-name"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="bg-ttrave-primary text-white">
                      <CardTitle className="flex items-center">
                        <i className="bi bi-image me-2"></i>
                        Hero Section
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <Label htmlFor="hero.title">Main Title</Label>
                        <Input
                          id="hero.title"
                          name="hero.title"
                          defaultValue={content["hero.title"] || ""}
                          data-testid="content-hero-title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="hero.subtitle">Subtitle</Label>
                        <Input
                          id="hero.subtitle"
                          name="hero.subtitle"
                          defaultValue={content["hero.subtitle"] || ""}
                          data-testid="content-hero-subtitle"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="bg-blue-500 text-white">
                        <CardTitle className="flex items-center text-base">
                          <i className="bi bi-building me-2"></i>
                          Company Info
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <Label htmlFor="company.name" className="text-sm">Company Name</Label>
                          <Input
                            id="company.name"
                            name="company.name"
                            defaultValue={content["company.name"] || ""}
                            className="text-sm"
                            data-testid="content-company-name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contact.phone" className="text-sm">Phone</Label>
                          <Input
                            id="contact.phone"
                            name="contact.phone"
                            defaultValue={content["contact.phone"] || ""}
                            className="text-sm"
                            data-testid="content-contact-phone"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contact.email" className="text-sm">Email</Label>
                          <Input
                            id="contact.email"
                            name="contact.email"
                            type="email"
                            defaultValue={content["contact.email"] || ""}
                            className="text-sm"
                            data-testid="content-contact-email"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="bg-yellow-500 text-black">
                        <CardTitle className="flex items-center text-base">
                          <i className="bi bi-share me-2"></i>
                          Social Media
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <Label htmlFor="social.facebook" className="text-sm">Facebook URL</Label>
                          <Input
                            id="social.facebook"
                            name="social.facebook"
                            type="url"
                            defaultValue={content["social.facebook"] || ""}
                            className="text-sm"
                            data-testid="content-social-facebook"
                          />
                        </div>
                        <div>
                          <Label htmlFor="social.instagram" className="text-sm">Instagram URL</Label>
                          <Input
                            id="social.instagram"
                            name="social.instagram"
                            type="url"
                            defaultValue={content["social.instagram"] || ""}
                            className="text-sm"
                            data-testid="content-social-instagram"
                          />
                        </div>
                        <div>
                          <Label htmlFor="social.linkedin" className="text-sm">LinkedIn URL</Label>
                          <Input
                            id="social.linkedin"
                            name="social.linkedin"
                            type="url"
                            defaultValue={content["social.linkedin"] || ""}
                            className="text-sm"
                            data-testid="content-social-linkedin"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </form>
              </div>
            )}

            {/* Destinations Management */}
            {activeSection === "destinations" && (
              <div className="admin-content">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-poppins text-2xl font-semibold">Destinations Management</h2>
                  <Dialog open={showAddDestination} onOpenChange={setShowAddDestination}>
                    <DialogTrigger asChild>
                      <Button className="btn-primary-ttrave" data-testid="add-destination-button">
                        <i className="bi bi-plus-circle me-2"></i>
                        Add New Destination
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Destination</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="new-name">Name</Label>
                          <Input
                            id="new-name"
                            value={newDestination.name}
                            onChange={(e) => setNewDestination({...newDestination, name: e.target.value})}
                            placeholder="Enter destination name"
                            data-testid="add-destination-name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="new-type">Type</Label>
                          <Select value={newDestination.type} onValueChange={(value: "domestic" | "international") => setNewDestination({...newDestination, type: value})}>
                            <SelectTrigger data-testid="add-destination-type">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="domestic">Domestic</SelectItem>
                              <SelectItem value="international">International</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="new-imageUrl">Image URL</Label>
                          <Input
                            id="new-imageUrl"
                            value={newDestination.imageUrl}
                            onChange={(e) => setNewDestination({...newDestination, imageUrl: e.target.value})}
                            placeholder="Enter image URL"
                            data-testid="add-destination-image"
                          />
                        </div>
                        <div>
                          <Label htmlFor="new-formUrl">Google Form URL</Label>
                          <Input
                            id="new-formUrl"
                            value={newDestination.formUrl}
                            onChange={(e) => setNewDestination({...newDestination, formUrl: e.target.value})}
                            placeholder="Enter Google Form URL"
                            data-testid="add-destination-form"
                          />
                        </div>
                        <div>
                          <Label htmlFor="new-icon">Bootstrap Icon</Label>
                          <Input
                            id="new-icon"
                            value={newDestination.icon}
                            onChange={(e) => setNewDestination({...newDestination, icon: e.target.value})}
                            placeholder="e.g., bi-geo-alt"
                            data-testid="add-destination-icon"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={handleAddDestination}
                            disabled={addDestinationMutation.isPending || !newDestination.name}
                            className="flex-1 btn-primary-ttrave"
                            data-testid="save-new-destination"
                          >
                            {addDestinationMutation.isPending ? "Adding..." : "Add Destination"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowAddDestination(false)}
                            className="flex-1"
                            data-testid="cancel-add-destination"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Image
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Form URL
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {destinations.slice(0, 5).map((destination: any) => (
                            <tr key={destination.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {destination.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge 
                                  variant={destination.type === 'domestic' ? 'default' : 'secondary'}
                                  className={destination.type === 'domestic' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                                >
                                  {destination.type}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <img
                                  src={destination.imageUrl}
                                  alt={destination.name}
                                  className="w-16 h-8 object-cover rounded"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">
                                {destination.formUrl}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setEditingDestination({...destination})}
                                      data-testid={`edit-destination-${destination.id}`}
                                    >
                                      <i className="bi bi-pencil"></i>
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>Edit Destination</DialogTitle>
                                    </DialogHeader>
                                    {editingDestination && (
                                      <div className="space-y-4">
                                        <div>
                                          <Label htmlFor="edit-name">Name</Label>
                                          <Input
                                            id="edit-name"
                                            value={editingDestination.name}
                                            onChange={(e) => setEditingDestination({...editingDestination, name: e.target.value})}
                                            data-testid="edit-destination-name"
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="edit-type">Type</Label>
                                          <Select value={editingDestination.type} onValueChange={(value: "domestic" | "international") => setEditingDestination({...editingDestination, type: value})}>
                                            <SelectTrigger data-testid="edit-destination-type">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="domestic">Domestic</SelectItem>
                                              <SelectItem value="international">International</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div>
                                          <Label htmlFor="edit-imageUrl">Image URL</Label>
                                          <Input
                                            id="edit-imageUrl"
                                            value={editingDestination.imageUrl}
                                            onChange={(e) => setEditingDestination({...editingDestination, imageUrl: e.target.value})}
                                            data-testid="edit-destination-image"
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="edit-formUrl">Google Form URL</Label>
                                          <Input
                                            id="edit-formUrl"
                                            value={editingDestination.formUrl}
                                            onChange={(e) => setEditingDestination({...editingDestination, formUrl: e.target.value})}
                                            data-testid="edit-destination-form"
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="edit-icon">Bootstrap Icon</Label>
                                          <Input
                                            id="edit-icon"
                                            value={editingDestination.icon}
                                            onChange={(e) => setEditingDestination({...editingDestination, icon: e.target.value})}
                                            data-testid="edit-destination-icon"
                                          />
                                        </div>
                                        <div className="flex space-x-2">
                                          <Button
                                            onClick={handleUpdateDestination}
                                            disabled={updateDestinationMutation.isPending}
                                            className="flex-1 btn-primary-ttrave"
                                            data-testid="save-destination-changes"
                                          >
                                            {updateDestinationMutation.isPending ? "Saving..." : "Save Changes"}
                                          </Button>
                                          <Button
                                            variant="outline"
                                            onClick={() => setEditingDestination(null)}
                                            className="flex-1"
                                            data-testid="cancel-edit-destination"
                                          >
                                            Cancel
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-red-600 hover:text-red-800"
                                  onClick={() => handleDeleteDestination(destination.id)}
                                  data-testid={`delete-destination-${destination.id}`}
                                >
                                  <i className="bi bi-trash"></i>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Packages Management */}
            {activeSection === "packages" && (
              <div className="admin-content">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-poppins text-2xl font-semibold">Travel Packages Management</h2>
                  <Dialog open={showAddPackage} onOpenChange={setShowAddPackage}>
                    <DialogTrigger asChild>
                      <Button className="btn-primary-ttrave" data-testid="add-package-button">
                        <i className="bi bi-plus-circle me-2"></i>
                        Add New Package
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Travel Package</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="package-destination">Destination</Label>
                          <Select value={newPackage.destinationId} onValueChange={(value) => setNewPackage({ ...newPackage, destinationId: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select destination" />
                            </SelectTrigger>
                            <SelectContent>
                              {destinations.map((dest: any) => (
                                <SelectItem key={dest.id} value={dest.id}>
                                  {dest.name} ({dest.type})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="package-name">Package Name</Label>
                          <Input
                            id="package-name"
                            value={newPackage.name}
                            onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                            placeholder="Enter package name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="package-description">Description</Label>
                          <Textarea
                            id="package-description"
                            value={newPackage.description}
                            onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                            placeholder="Enter package description"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="package-price">Price per Person</Label>
                            <Input
                              id="package-price"
                              value={newPackage.pricePerPerson}
                              onChange={(e) => setNewPackage({ ...newPackage, pricePerPerson: e.target.value })}
                              placeholder="e.g., ₹25,000"
                            />
                          </div>
                          <div>
                            <Label htmlFor="package-duration">Duration</Label>
                            <Input
                              id="package-duration"
                              value={newPackage.duration}
                              onChange={(e) => setNewPackage({ ...newPackage, duration: e.target.value })}
                              placeholder="e.g., 6 Days / 5 Nights"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="package-location">Location</Label>
                          <Input
                            id="package-location"
                            value={newPackage.location}
                            onChange={(e) => setNewPackage({ ...newPackage, location: e.target.value })}
                            placeholder="e.g., Delhi - Agra - Jaipur"
                          />
                        </div>
                        <div>
                          <Label htmlFor="package-image">Image URL</Label>
                          <Input
                            id="package-image"
                            value={newPackage.imageUrl}
                            onChange={(e) => setNewPackage({ ...newPackage, imageUrl: e.target.value })}
                            placeholder="Enter image URL"
                          />
                        </div>
                        <div>
                          <Label>Package Highlights</Label>
                          <div className="space-y-2">
                            {newPackage.highlights.map((highlight, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  value={highlight}
                                  onChange={(e) => updateHighlight(index, e.target.value, true)}
                                  placeholder={`Highlight ${index + 1}`}
                                />
                                {newPackage.highlights.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeHighlight(index, true)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </Button>
                                )}
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addHighlight(true)}
                            >
                              <i className="bi bi-plus"></i> Add Highlight
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="package-featured"
                            checked={newPackage.isFeatured}
                            onCheckedChange={(checked) => setNewPackage({ ...newPackage, isFeatured: !!checked })}
                          />
                          <Label htmlFor="package-featured">Featured Package</Label>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={handleAddPackage}
                            disabled={addPackageMutation.isPending}
                            className="flex-1 btn-primary-ttrave"
                          >
                            {addPackageMutation.isPending ? "Adding..." : "Add Package"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowAddPackage(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Existing Packages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Package
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Destination
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Duration
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {packages.map((pkg: any) => (
                            <tr key={pkg.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <img className="h-10 w-10 rounded object-cover" src={pkg.imageUrl} alt={pkg.name} />
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                                    <div className="text-sm text-gray-500">{pkg.location}</div>
                                    {pkg.isFeatured && <Badge className="mt-1">Featured</Badge>}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {destinations.find((d: any) => d.id === pkg.destinationId)?.name || 'Unknown'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {pkg.pricePerPerson}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {pkg.duration}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant={pkg.isActive ? 'default' : 'secondary'}>
                                  {pkg.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setEditingPackage(pkg)}
                                      data-testid={`edit-package-${pkg.id}`}
                                    >
                                      <i className="bi bi-pencil"></i>
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>Edit Package</DialogTitle>
                                    </DialogHeader>
                                    {editingPackage && (
                                      <div className="space-y-4">
                                        <div>
                                          <Label htmlFor="edit-package-destination">Destination</Label>
                                          <Select 
                                            value={editingPackage.destinationId} 
                                            onValueChange={(value) => setEditingPackage({ ...editingPackage, destinationId: value })}
                                          >
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select destination" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {destinations.map((dest: any) => (
                                                <SelectItem key={dest.id} value={dest.id}>
                                                  {dest.name} ({dest.type})
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div>
                                          <Label htmlFor="edit-package-name">Package Name</Label>
                                          <Input
                                            id="edit-package-name"
                                            value={editingPackage.name}
                                            onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="edit-package-description">Description</Label>
                                          <Textarea
                                            id="edit-package-description"
                                            value={editingPackage.description}
                                            onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })}
                                            rows={3}
                                          />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label htmlFor="edit-package-price">Price per Person</Label>
                                            <Input
                                              id="edit-package-price"
                                              value={editingPackage.pricePerPerson}
                                              onChange={(e) => setEditingPackage({ ...editingPackage, pricePerPerson: e.target.value })}
                                            />
                                          </div>
                                          <div>
                                            <Label htmlFor="edit-package-duration">Duration</Label>
                                            <Input
                                              id="edit-package-duration"
                                              value={editingPackage.duration}
                                              onChange={(e) => setEditingPackage({ ...editingPackage, duration: e.target.value })}
                                            />
                                          </div>
                                        </div>
                                        <div>
                                          <Label htmlFor="edit-package-location">Location</Label>
                                          <Input
                                            id="edit-package-location"
                                            value={editingPackage.location}
                                            onChange={(e) => setEditingPackage({ ...editingPackage, location: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="edit-package-image">Image URL</Label>
                                          <Input
                                            id="edit-package-image"
                                            value={editingPackage.imageUrl}
                                            onChange={(e) => setEditingPackage({ ...editingPackage, imageUrl: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <Label>Package Highlights</Label>
                                          <div className="space-y-2">
                                            {editingPackage.highlights.map((highlight: string, index: number) => (
                                              <div key={index} className="flex gap-2">
                                                <Input
                                                  value={highlight}
                                                  onChange={(e) => updateHighlight(index, e.target.value, false)}
                                                  placeholder={`Highlight ${index + 1}`}
                                                />
                                                {editingPackage.highlights.length > 1 && (
                                                  <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeHighlight(index, false)}
                                                  >
                                                    <i className="bi bi-trash"></i>
                                                  </Button>
                                                )}
                                              </div>
                                            ))}
                                            <Button
                                              type="button"
                                              variant="outline"
                                              size="sm"
                                              onClick={() => addHighlight(false)}
                                            >
                                              <i className="bi bi-plus"></i> Add Highlight
                                            </Button>
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            id="edit-package-featured"
                                            checked={editingPackage.isFeatured}
                                            onCheckedChange={(checked) => setEditingPackage({ ...editingPackage, isFeatured: !!checked })}
                                          />
                                          <Label htmlFor="edit-package-featured">Featured Package</Label>
                                        </div>
                                        <div className="flex space-x-2">
                                          <Button
                                            onClick={handleUpdatePackage}
                                            disabled={updatePackageMutation.isPending}
                                            className="flex-1 btn-primary-ttrave"
                                          >
                                            {updatePackageMutation.isPending ? "Saving..." : "Save Changes"}
                                          </Button>
                                          <Button
                                            variant="outline"
                                            onClick={() => setEditingPackage(null)}
                                            className="flex-1"
                                          >
                                            Cancel
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-red-600 hover:text-red-800"
                                  onClick={() => handleDeletePackage(pkg.id)}
                                  data-testid={`delete-package-${pkg.id}`}
                                >
                                  <i className="bi bi-trash"></i>
                                </Button>
                              </td>
                            </tr>
                          ))}
                          {packages.length === 0 && (
                            <tr>
                              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                No packages created yet
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Form Submissions */}
            {activeSection === "submissions" && (
              <div className="admin-content">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-poppins text-2xl font-semibold">Form Submissions</h2>
                  <Button variant="outline" data-testid="export-submissions-button">
                    <i className="bi bi-download me-2"></i>
                    Export CSV
                  </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card className="text-center">
                    <CardContent className="p-6">
                      <i className="bi bi-envelope text-blue-500 text-3xl"></i>
                      <h4 className="font-poppins text-2xl font-semibold mt-2">
                        {stats.contactForms || 0}
                      </h4>
                      <p className="text-gray-600 text-sm">Contact Forms</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="p-6">
                      <i className="bi bi-newspaper text-green-500 text-3xl"></i>
                      <h4 className="font-poppins text-2xl font-semibold mt-2">
                        {stats.newsletter || 0}
                      </h4>
                      <p className="text-gray-600 text-sm">Newsletter Subs</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="p-6">
                      <i className="bi bi-calendar text-yellow-500 text-3xl"></i>
                      <h4 className="font-poppins text-2xl font-semibold mt-2">
                        {stats.thisMonth || 0}
                      </h4>
                      <p className="text-gray-600 text-sm">This Month</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="p-6">
                      <i className="bi bi-graph-up text-purple-500 text-3xl"></i>
                      <h4 className="font-poppins text-2xl font-semibold mt-2">
                        +{stats.growth || 0}%
                      </h4>
                      <p className="text-gray-600 text-sm">Growth Rate</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Submissions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Contact Form Submissions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Subject
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {contactSubmissions.slice(0, 10).map((submission: any) => (
                            <tr key={submission.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {submission.firstName} {submission.lastName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {submission.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-xs">
                                {submission.subject}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(submission.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge 
                                  variant={submission.status === 'responded' ? 'default' : 'secondary'}
                                  className={submission.status === 'responded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                                >
                                  {submission.status}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  data-testid={`view-submission-${submission.id}`}
                                >
                                  <i className="bi bi-eye"></i>
                                </Button>
                              </td>
                            </tr>
                          ))}
                          {contactSubmissions.length === 0 && (
                            <tr>
                              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                No submissions yet
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
