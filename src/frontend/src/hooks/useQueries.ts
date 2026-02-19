import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Video, Photo, Package, Booking, UserProfile, Category, BookingStatus, HomepageContent, SpecialMomentGallery, GalleryCategoryMeta, SitewideContent } from '../backend';
import { ExternalBlob } from '../backend';
import { Principal } from '@dfinity/principal';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin Check
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// Video Queries
export function useGetVideos() {
  const { actor, isFetching } = useActor();

  return useQuery<Video[]>({
    queryKey: ['videos'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVideos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (details: { title: string; category: Category; blob: ExternalBlob }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addVideo(details);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}

export function useDeleteVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteVideo(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}

export function useSetVideoFeatured() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isFeatured }: { id: string; isFeatured: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setVideoFeatured(id, isFeatured);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}

// Photo Queries
export function useGetPhotos() {
  const { actor, isFetching } = useActor();

  return useQuery<Photo[]>({
    queryKey: ['photos'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPhotos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (details: { title: string; category: Category; blob: ExternalBlob }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPhoto(details);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
}

export function useDeletePhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePhoto(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
}

export function useSetPhotoFeatured() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isFeatured }: { id: string; isFeatured: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setPhotoFeatured(id, isFeatured);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
}

// Package Queries
export function useGetAllPackages() {
  const { actor, isFetching } = useActor();

  return useQuery<Package[]>({
    queryKey: ['packages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPackages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePackage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (details: { name: string; description: string; price: bigint; isVideo: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPackage(details);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
  });
}

export function useUpdatePackage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, details }: { id: string; details: { name: string; description: string; price: bigint; isVideo: boolean } }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePackage(id, details);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
  });
}

export function useDeletePackage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePackage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
  });
}

// Booking Queries
export function useCreateBooking() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (request: { packageId: string; customerName: string; customerEmail: string; eventDate: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createBooking(request);
    },
  });
}

export function useGetAllBookings() {
  const { actor, isFetching } = useActor();

  return useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveBooking(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useRejectBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectBooking(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: BookingStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBookingStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useAssignPhotographer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, photographer }: { id: string; photographer: Principal }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignPhotographer(id, photographer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

// Homepage Content Queries
export function useHomepageContent() {
  const { actor, isFetching } = useActor();

  return useQuery<HomepageContent>({
    queryKey: ['homepageContent'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getHomepageContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateHomepageContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newContent: HomepageContent) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateHomepageContent(newContent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepageContent'] });
    },
  });
}

// Special Moment Galleries Queries
export function useSpecialMomentGalleries() {
  const { actor, isFetching } = useActor();

  return useQuery<SpecialMomentGallery[]>({
    queryKey: ['specialMomentGalleries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSpecialMomentGalleries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateSpecialMomentGallery() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (directory: { date: string; title: string; description: string; photoIds: string[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createSpecialMomentGallery(directory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialMomentGalleries'] });
    },
  });
}

export function useUpdateSpecialMomentGallery() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updated }: { id: string; updated: SpecialMomentGallery }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSpecialMomentGallery(id, updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialMomentGalleries'] });
    },
  });
}

// Category Meta Queries
export function useAllCategoryMeta() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[Category, GalleryCategoryMeta]>>({
    queryKey: ['categoryMeta'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCategoryMeta();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateCategoryMeta() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ category, meta }: { category: Category; meta: GalleryCategoryMeta }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCategoryMeta(category, meta);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categoryMeta'] });
    },
  });
}

// Sitewide Content Queries
export function useSitewideContent() {
  const { actor, isFetching } = useActor();

  return useQuery<SitewideContent>({
    queryKey: ['sitewideContent'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSitewideContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateSitewideContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newContent: SitewideContent) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSitewideContent(newContent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitewideContent'] });
    },
  });
}
