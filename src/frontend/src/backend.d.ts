import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Video {
    id: string;
    title: string;
    blob: ExternalBlob;
    isFeatured: boolean;
    category: Category;
}
export interface UserProfile {
    name: string;
    email: string;
}
export interface Package {
    id: string;
    name: string;
    description: string;
    price: bigint;
    isVideo: boolean;
}
export interface GalleryCategoryMeta {
    name: string;
    description: string;
}
export interface SitewideContent {
    servicesDescription: string;
    bookingIntro: string;
    footerContent: string;
}
export interface HomepageContent {
    heroSubtitle: string;
    callOutButtonText: string;
    heroTitle: string;
    heroBackgroundImage: string;
}
export interface SpecialMomentGallery {
    id: string;
    title: string;
    date: string;
    description: string;
    photoIds: Array<string>;
}
export interface Booking {
    id: string;
    customerName: string;
    status: BookingStatus;
    assignedPhotographer?: Principal;
    customerEmail: string;
    packageId: string;
    eventDate: string;
}
export interface Photo {
    id: string;
    title: string;
    blob: ExternalBlob;
    isFeatured: boolean;
    category: Category;
}
export enum BookingStatus {
    pending = "pending",
    completed = "completed",
    rejected = "rejected",
    confirmed = "confirmed"
}
export enum Category {
    receptions = "receptions",
    weddings = "weddings",
    preWedding = "preWedding"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addPhoto(details: {
        title: string;
        blob: ExternalBlob;
        category: Category;
    }): Promise<string>;
    /**
     * / Portfolio management - Admin only
     */
    addVideo(details: {
        title: string;
        blob: ExternalBlob;
        category: Category;
    }): Promise<string>;
    approveBooking(id: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignPhotographer(id: string, photographer: Principal): Promise<void>;
    /**
     * / Booking system - Public, customers can book without authentication
     */
    createBooking(request: {
        customerName: string;
        customerEmail: string;
        packageId: string;
        eventDate: string;
    }): Promise<string>;
    /**
     * / Package management - Admin only
     */
    createPackage(details: {
        name: string;
        description: string;
        price: bigint;
        isVideo: boolean;
    }): Promise<string>;
    /**
     * / Special Moments Gallery Management
     */
    createSpecialMomentGallery(directory: {
        title: string;
        date: string;
        description: string;
        photoIds: Array<string>;
    }): Promise<string>;
    deletePackage(id: string): Promise<void>;
    deletePhoto(id: string): Promise<void>;
    deleteVideo(id: string): Promise<void>;
    /**
     * / Admin Booking Management - Admin only
     */
    getAllBookings(): Promise<Array<Booking>>;
    getAllCategoryMeta(): Promise<Array<[Category, GalleryCategoryMeta]>>;
    getAllPackages(): Promise<Array<Package>>;
    getAllSpecialMomentGalleries(): Promise<Array<SpecialMomentGallery>>;
    /**
     * / User Profile Management
     */
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategoryMeta(category: Category): Promise<GalleryCategoryMeta | null>;
    getHomepageContent(): Promise<HomepageContent>;
    /**
     * / Package browsing - Public, no authentication required
     */
    getPackages(isVideo: boolean): Promise<Array<Package>>;
    getPhotos(): Promise<Array<Photo>>;
    getPhotosByCategory(category: Category): Promise<Array<Photo>>;
    getSitewideContent(): Promise<SitewideContent>;
    getSpecialMomentGalleriesByDate(date: string): Promise<Array<SpecialMomentGallery>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    /**
     * / Public portfolio access - No authentication required
     */
    getVideos(): Promise<Array<Video>>;
    getVideosByCategory(category: Category): Promise<Array<Video>>;
    isCallerAdmin(): Promise<boolean>;
    rejectBooking(id: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setPhotoFeatured(id: string, isFeatured: boolean): Promise<void>;
    setVideoFeatured(id: string, isFeatured: boolean): Promise<void>;
    updateBookingStatus(id: string, status: BookingStatus): Promise<void>;
    /**
     * / Gallery Category Meta Management
     */
    updateCategoryMeta(category: Category, meta: GalleryCategoryMeta): Promise<void>;
    /**
     * / Homepage Content Management
     */
    updateHomepageContent(newContent: HomepageContent): Promise<void>;
    updatePackage(id: string, details: {
        name: string;
        description: string;
        price: bigint;
        isVideo: boolean;
    }): Promise<void>;
    /**
     * / Sitewide Content Management
     */
    updateSitewideContent(newContent: SitewideContent): Promise<void>;
    updateSpecialMomentGallery(id: string, updated: SpecialMomentGallery): Promise<void>;
}
