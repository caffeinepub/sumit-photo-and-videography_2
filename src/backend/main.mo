import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  include MixinStorage();

  /// Types for portfolio organization
  type Category = {
    #weddings;
    #preWedding;
    #receptions;
  };

  module Category {
    public func compare(category1 : Category, category2 : Category) : Order.Order {
      switch (category1, category2) {
        case (#weddings, #weddings) { #equal };
        case (#weddings, _) { #less };
        case (#preWedding, #weddings) { #greater };
        case (#preWedding, #preWedding) { #equal };
        case (#preWedding, #receptions) { #less };
        case (#receptions, #receptions) { #equal };
        case (#receptions, _) { #greater };
      };
    };
  };

  type Video = {
    id : Text;
    title : Text;
    category : Category;
    isFeatured : Bool;
    blob : Storage.ExternalBlob;
  };

  type Photo = {
    id : Text;
    title : Text;
    category : Category;
    isFeatured : Bool;
    blob : Storage.ExternalBlob;
  };

  /// Store Portfolio Content
  let videos = Map.empty<Text, Video>();
  let photos = Map.empty<Text, Photo>();
  var videoCounter : Nat = 0;
  var photoCounter : Nat = 0;

  /// Packages for bookings
  type Package = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    isVideo : Bool;
  };

  let packages = Map.empty<Text, Package>();
  var packageCounter : Nat = 0;

  /// Booking management
  type BookingStatus = {
    #pending;
    #confirmed;
    #completed;
    #rejected;
  };

  type Booking = {
    id : Text;
    packageId : Text;
    customerName : Text;
    customerEmail : Text;
    eventDate : Text;
    status : BookingStatus;
    assignedPhotographer : ?Principal;
  };

  let bookings = Map.empty<Text, Booking>();
  var bookingCounter : Nat = 0;

  /// User profiles
  public type UserProfile = {
    name : Text;
    email : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  /// Homepage content
  type HomepageContent = {
    heroTitle : Text;
    heroSubtitle : Text;
    callOutButtonText : Text;
    heroBackgroundImage : Text;
  };

  var homepageContent : HomepageContent = {
    heroTitle = "Capture Your Special Moments";
    heroSubtitle = "Professional Wedding Photography & Videography";
    callOutButtonText = "Book Now";
    heroBackgroundImage = "";
  };

  /// Special Moments Galleries
  type SpecialMomentGallery = {
    id : Text;
    date : Text; // ISO date format
    title : Text;
    description : Text;
    photoIds : [Text];
  };

  let specialMomentsGalleries = Map.empty<Text, SpecialMomentGallery>();

  /// Gallery Category Metadata
  type GalleryCategoryMeta = {
    name : Text;
    description : Text;
  };

  let galleryCategoryMeta = Map.empty<Category, GalleryCategoryMeta>();

  /// Sitewide Text Content
  type SitewideContent = {
    servicesDescription : Text;
    bookingIntro : Text;
    footerContent : Text;
  };

  var sitewideContent : SitewideContent = {
    servicesDescription = "We offer a range of photography and videography services tailored to your special day.";
    bookingIntro = "Fill out the form below to book your event with us.";
    footerContent = "Copyright 2024 Cedars Digital";
  };

  /// Authentication system with AccessControl module
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  /// User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  /// Portfolio management - Admin only
  public shared ({ caller }) func addVideo(details : { title : Text; category : Category; blob : Storage.ExternalBlob }) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let id = "video_" # videoCounter.toText();
    videoCounter += 1;

    let video : Video = {
      id;
      title = details.title;
      category = details.category;
      blob = details.blob;
      isFeatured = false;
    };
    videos.add(id, video);
    id;
  };

  public shared ({ caller }) func addPhoto(details : { title : Text; category : Category; blob : Storage.ExternalBlob }) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let id = "photo_" # photoCounter.toText();
    photoCounter += 1;

    let photo : Photo = {
      id;
      title = details.title;
      category = details.category;
      blob = details.blob;
      isFeatured = false;
    };
    photos.add(id, photo);
    id;
  };

  public shared ({ caller }) func deleteVideo(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (videos.get(id)) {
      case (null) { Runtime.trap("Video not found") };
      case (?_) { videos.remove(id) };
    };
  };

  public shared ({ caller }) func deletePhoto(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (photos.get(id)) {
      case (null) { Runtime.trap("Photo not found") };
      case (?_) { photos.remove(id) };
    };
  };

  public shared ({ caller }) func setVideoFeatured(id : Text, isFeatured : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (videos.get(id)) {
      case (null) { Runtime.trap("Video not found") };
      case (?video) {
        let updated : Video = {
          video with isFeatured = isFeatured;
        };
        videos.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func setPhotoFeatured(id : Text, isFeatured : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (photos.get(id)) {
      case (null) { Runtime.trap("Photo not found") };
      case (?photo) {
        let updated : Photo = {
          photo with isFeatured = isFeatured;
        };
        photos.add(id, updated);
      };
    };
  };

  /// Public portfolio access - No authentication required
  public query func getVideos() : async [Video] {
    let featured = List.empty<Video>();
    let nonFeatured = List.empty<Video>();

    for (video in videos.values()) {
      if (video.isFeatured) {
        featured.add(video);
      } else {
        nonFeatured.add(video);
      };
    };

    featured.toArray().concat(nonFeatured.toArray());
  };

  public query func getPhotos() : async [Photo] {
    let featured = List.empty<Photo>();
    let nonFeatured = List.empty<Photo>();

    for (photo in photos.values()) {
      if (photo.isFeatured) {
        featured.add(photo);
      } else {
        nonFeatured.add(photo);
      };
    };

    featured.toArray().concat(nonFeatured.toArray());
  };

  public query func getVideosByCategory(category : Category) : async [Video] {
    let filtered = List.empty<Video>();
    for (video in videos.values()) {
      if (Category.compare(video.category, category) == #equal) {
        filtered.add(video);
      };
    };
    filtered.toArray();
  };

  public query func getPhotosByCategory(category : Category) : async [Photo] {
    let filtered = List.empty<Photo>();
    for (photo in photos.values()) {
      if (Category.compare(photo.category, category) == #equal) {
        filtered.add(photo);
      };
    };
    filtered.toArray();
  };

  /// Package management - Admin only
  public shared ({ caller }) func createPackage(details : { name : Text; description : Text; price : Nat; isVideo : Bool }) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let id = "package_" # packageCounter.toText();
    packageCounter += 1;

    let package : Package = {
      id;
      name = details.name;
      description = details.description;
      price = details.price;
      isVideo = details.isVideo;
    };
    packages.add(id, package);
    id;
  };

  public shared ({ caller }) func updatePackage(id : Text, details : { name : Text; description : Text; price : Nat; isVideo : Bool }) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (packages.get(id)) {
      case (null) { Runtime.trap("Package not found") };
      case (?_) {
        let package : Package = {
          id;
          name = details.name;
          description = details.description;
          price = details.price;
          isVideo = details.isVideo;
        };
        packages.add(id, package);
      };
    };
  };

  public shared ({ caller }) func deletePackage(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (packages.get(id)) {
      case (null) { Runtime.trap("Package not found") };
      case (?_) { packages.remove(id) };
    };
  };

  /// Package browsing - Public, no authentication required
  public query func getPackages(isVideo : Bool) : async [Package] {
    let filtered = List.empty<Package>();
    for (package in packages.values()) {
      if (package.isVideo == isVideo) {
        filtered.add(package);
      };
    };
    filtered.toArray();
  };

  public query func getAllPackages() : async [Package] {
    let allPackages = List.empty<Package>();
    for (package in packages.values()) {
      allPackages.add(package);
    };
    allPackages.toArray();
  };

  /// Booking system - Public, customers can book without authentication
  public shared ({ caller }) func createBooking(request : { packageId : Text; customerName : Text; customerEmail : Text; eventDate : Text }) : async Text {
    // No authentication required - guests can create bookings
    switch (packages.get(request.packageId)) {
      case (null) {
        Runtime.trap("Package not found");
      };
      case (?_) {
        let id = "booking_" # bookingCounter.toText();
        bookingCounter += 1;

        let booking : Booking = {
          id;
          packageId = request.packageId;
          customerName = request.customerName;
          customerEmail = request.customerEmail;
          eventDate = request.eventDate;
          status = #pending;
          assignedPhotographer = null;
        };
        bookings.add(id, booking);
        id;
      };
    };
  };

  /// Admin Booking Management - Admin only
  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let allBookings = List.empty<Booking>();
    for (booking in bookings.values()) {
      allBookings.add(booking);
    };
    allBookings.toArray();
  };

  public shared ({ caller }) func approveBooking(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        switch (booking.status) {
          case (#pending) {
            let updated : Booking = {
              booking with status = #confirmed;
            };
            bookings.add(id, updated);
          };
          case (_) {
            Runtime.trap("Booking cannot be approved in its current state");
          };
        };
      };
    };
  };

  public shared ({ caller }) func rejectBooking(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        switch (booking.status) {
          case (#pending) {
            let updated : Booking = {
              booking with status = #rejected;
            };
            bookings.add(id, updated);
          };
          case (_) {
            Runtime.trap("Booking cannot be rejected in its current state");
          };
        };
      };
    };
  };

  public shared ({ caller }) func updateBookingStatus(id : Text, status : BookingStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let updated : Booking = {
          booking with status = status;
        };
        bookings.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func assignPhotographer(id : Text, photographer : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let updated : Booking = {
          booking with assignedPhotographer = ?photographer;
        };
        bookings.add(id, updated);
      };
    };
  };

  /// Homepage Content Management
  public shared ({ caller }) func updateHomepageContent(newContent : HomepageContent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    homepageContent := newContent;
  };

  public query func getHomepageContent() : async HomepageContent {
    homepageContent;
  };

  /// Special Moments Gallery Management
  public shared ({ caller }) func createSpecialMomentGallery(directory : { date : Text; title : Text; description : Text; photoIds : [Text] }) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let id = "smg_" # directory.date # "_" # directory.title;
    let gallery : SpecialMomentGallery = {
      id;
      date = directory.date;
      title = directory.title;
      description = directory.description;
      photoIds = directory.photoIds;
    };
    specialMomentsGalleries.add(id, gallery);
    id;
  };

  public query func getAllSpecialMomentGalleries() : async [SpecialMomentGallery] {
    specialMomentsGalleries.values().toArray();
  };

  public query func getSpecialMomentGalleriesByDate(date : Text) : async [SpecialMomentGallery] {
    let matching = List.empty<SpecialMomentGallery>();
    for ((_, gallery) in specialMomentsGalleries.entries()) {
      if (gallery.date == date) {
        matching.add(gallery);
      };
    };
    matching.toArray();
  };

  public shared ({ caller }) func updateSpecialMomentGallery(id : Text, updated : SpecialMomentGallery) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (specialMomentsGalleries.get(id)) {
      case (null) { Runtime.trap("Gallery not found") };
      case (?_) {
        specialMomentsGalleries.add(id, updated);
      };
    };
  };

  /// Gallery Category Meta Management
  public shared ({ caller }) func updateCategoryMeta(category : Category, meta : GalleryCategoryMeta) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    galleryCategoryMeta.add(category, meta);
  };

  public query func getCategoryMeta(category : Category) : async ?GalleryCategoryMeta {
    galleryCategoryMeta.get(category);
  };

  public query func getAllCategoryMeta() : async [(Category, GalleryCategoryMeta)] {
    galleryCategoryMeta.toArray();
  };

  /// Sitewide Content Management
  public shared ({ caller }) func updateSitewideContent(newContent : SitewideContent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    sitewideContent := newContent;
  };

  public query func getSitewideContent() : async SitewideContent {
    sitewideContent;
  };
};
