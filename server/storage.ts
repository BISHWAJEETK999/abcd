import { type User, type InsertUser, type Destination, type InsertDestination, type Content, type InsertContent, type ContactSubmission, type InsertContactSubmission, type NewsletterSubscription, type InsertNewsletterSubscription } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Destinations
  getDestinations(): Promise<Destination[]>;
  getDestinationsByType(type: 'domestic' | 'international'): Promise<Destination[]>;
  getDestination(id: string): Promise<Destination | undefined>;
  createDestination(destination: InsertDestination): Promise<Destination>;
  updateDestination(id: string, destination: Partial<InsertDestination>): Promise<Destination | undefined>;
  deleteDestination(id: string): Promise<boolean>;
  
  // Content
  getContent(): Promise<Content[]>;
  getContentByKey(key: string): Promise<Content | undefined>;
  setContent(content: InsertContent): Promise<Content>;
  updateContent(key: string, value: string): Promise<Content | undefined>;
  
  // Contact Submissions
  getContactSubmissions(): Promise<ContactSubmission[]>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  updateContactSubmissionStatus(id: string, status: string): Promise<ContactSubmission | undefined>;
  
  // Newsletter Subscriptions
  getNewsletterSubscriptions(): Promise<NewsletterSubscription[]>;
  createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private destinations: Map<string, Destination>;
  private content: Map<string, Content>;
  private contactSubmissions: Map<string, ContactSubmission>;
  private newsletterSubscriptions: Map<string, NewsletterSubscription>;

  constructor() {
    this.users = new Map();
    this.destinations = new Map();
    this.content = new Map();
    this.contactSubmissions = new Map();
    this.newsletterSubscriptions = new Map();
    
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create admin user
    const adminId = randomUUID();
    this.users.set(adminId, {
      id: adminId,
      username: "admin",
      password: "8709612003" // In production, this should be hashed
    });

    // Initialize default content
    const defaultContent = [
      { key: "site.name", value: "TTravel Hospitality" },
      { key: "hero.title", value: "Explore the World with TTRAVE" },
      { key: "hero.subtitle", value: "Book your next adventure with us!" },
      { key: "company.name", value: "TTravel Hospitality" },
      { key: "contact.phone", value: "+91 8100331032" },
      { key: "contact.email", value: "ttrave.travelagency@gmail.com" },
      { key: "contact.address", value: "B-12, Shop No. - 111/19, Saptaparni Market, Kalyani Central Park - ward no. 11, Nadia- 741235, West Bengal, India" },
      { key: "social.facebook", value: "#" },
      { key: "social.instagram", value: "#" },
      { key: "social.linkedin", value: "#" },
      { key: "social.twitter", value: "#" },
    ];

    defaultContent.forEach(item => {
      const id = randomUUID();
      this.content.set(item.key, {
        id,
        key: item.key,
        value: item.value,
        updatedAt: new Date()
      });
    });

    // Initialize domestic destinations (Indian states/UTs)
    const domesticDestinations = [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
      "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
      "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
      "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
      "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
      "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
      "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
    ];

    domesticDestinations.forEach(name => {
      const id = randomUUID();
      this.destinations.set(id, {
        id,
        name,
        type: "domestic",
        imageUrl: `https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=200&fit=crop`,
        formUrl: `https://forms.gle/placeholder-${name.toLowerCase().replace(/\s+/g, '-')}`,
        icon: "bi-geo-alt-fill",
        isActive: true,
        createdAt: new Date()
      });
    });

    // Initialize international destinations
    const internationalDestinations = [
      "France", "United Kingdom", "Italy", "Switzerland", "Japan", "Thailand",
      "Australia", "New Zealand", "Singapore", "Malaysia", "Dubai", "Turkey"
    ];

    internationalDestinations.forEach(name => {
      const id = randomUUID();
      this.destinations.set(id, {
        id,
        name,
        type: "international",
        imageUrl: `https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=200&fit=crop`,
        formUrl: `https://forms.gle/placeholder-${name.toLowerCase().replace(/\s+/g, '-')}`,
        icon: "bi-geo-alt-fill",
        isActive: true,
        createdAt: new Date()
      });
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Destination methods
  async getDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values()).filter(d => d.isActive);
  }

  async getDestinationsByType(type: 'domestic' | 'international'): Promise<Destination[]> {
    return Array.from(this.destinations.values()).filter(d => d.type === type && d.isActive);
  }

  async getDestination(id: string): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }

  async createDestination(insertDestination: InsertDestination): Promise<Destination> {
    const id = randomUUID();
    const destination: Destination = {
      ...insertDestination,
      id,
      icon: insertDestination.icon || "bi-geo-alt-fill",
      isActive: insertDestination.isActive ?? true,
      createdAt: new Date()
    };
    this.destinations.set(id, destination);
    return destination;
  }

  async updateDestination(id: string, updates: Partial<InsertDestination>): Promise<Destination | undefined> {
    const destination = this.destinations.get(id);
    if (!destination) return undefined;
    
    const updatedDestination = { ...destination, ...updates };
    this.destinations.set(id, updatedDestination);
    return updatedDestination;
  }

  async deleteDestination(id: string): Promise<boolean> {
    const destination = this.destinations.get(id);
    if (!destination) return false;
    
    const updatedDestination = { ...destination, isActive: false };
    this.destinations.set(id, updatedDestination);
    return true;
  }

  // Content methods
  async getContent(): Promise<Content[]> {
    return Array.from(this.content.values());
  }

  async getContentByKey(key: string): Promise<Content | undefined> {
    return this.content.get(key);
  }

  async setContent(insertContent: InsertContent): Promise<Content> {
    const id = randomUUID();
    const content: Content = {
      ...insertContent,
      id,
      updatedAt: new Date()
    };
    this.content.set(insertContent.key, content);
    return content;
  }

  async updateContent(key: string, value: string): Promise<Content | undefined> {
    const content = this.content.get(key);
    if (!content) return undefined;
    
    const updatedContent = { ...content, value, updatedAt: new Date() };
    this.content.set(key, updatedContent);
    return updatedContent;
  }

  // Contact submission methods
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values()).sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = randomUUID();
    const submission: ContactSubmission = {
      ...insertSubmission,
      id,
      status: "pending",
      createdAt: new Date()
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  async updateContactSubmissionStatus(id: string, status: string): Promise<ContactSubmission | undefined> {
    const submission = this.contactSubmissions.get(id);
    if (!submission) return undefined;
    
    const updatedSubmission = { ...submission, status };
    this.contactSubmissions.set(id, updatedSubmission);
    return updatedSubmission;
  }

  // Newsletter subscription methods
  async getNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    return Array.from(this.newsletterSubscriptions.values()).filter(s => s.isActive);
  }

  async createNewsletterSubscription(insertSubscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    // Check if email already exists
    const existing = Array.from(this.newsletterSubscriptions.values()).find(s => s.email === insertSubscription.email);
    if (existing) {
      if (!existing.isActive) {
        // Reactivate existing subscription
        const reactivated = { ...existing, isActive: true };
        this.newsletterSubscriptions.set(existing.id, reactivated);
        return reactivated;
      }
      return existing;
    }

    const id = randomUUID();
    const subscription: NewsletterSubscription = {
      ...insertSubscription,
      id,
      isActive: true,
      createdAt: new Date()
    };
    this.newsletterSubscriptions.set(id, subscription);
    return subscription;
  }
}

export const storage = new MemStorage();
