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
