import type { ExerciseMedia } from "@bellgrinda/domain";

export const exerciseMediaCacheName = "exercise-media-v1";

export async function isMediaSaved(media: ExerciseMedia) {
  if (!("caches" in window)) return false;
  const cache = await caches.open(exerciseMediaCacheName);
  return Boolean(await cache.match(media.videoUrl));
}

export async function saveMediaForOffline(media: ExerciseMedia) {
  if (!("caches" in window)) throw new Error("Offline media is not supported by this browser.");
  const response = await fetch(media.videoUrl, { signal: AbortSignal.timeout(60000) });
  if (!response.ok || response.status === 206) throw new Error(`Complete video download failed (${response.status}).`);
  if (!response.headers.get("Content-Type")?.startsWith("video/")) throw new Error("The video is unavailable.");
  const cache = await caches.open(exerciseMediaCacheName);
  await cache.put(media.videoUrl, response);
}

export async function getSavedMedia(media: ExerciseMedia) {
  if (!("caches" in window)) return null;
  const cache = await caches.open(exerciseMediaCacheName);
  const response = await cache.match(media.videoUrl);
  return response ? response.blob() : null;
}
