import { afterEach, describe, expect, it, vi } from "vitest";
import { getExerciseMedia } from "./exerciseMedia";
import { getSavedMedia, isMediaSaved, saveMediaForOffline } from "./mediaCache";

const media = getExerciseMedia("skipping")!;
afterEach(() => vi.unstubAllGlobals());

describe("offline media", () => {
  it("saves a complete video and reads it back as a playable blob", async () => {
    const stored = new Map<string, Response>();
    const put = vi.fn(async (url: string, response: Response) => { stored.set(url, response); });
    vi.stubGlobal("caches", { open: vi.fn(async () => ({ put, match: async (url: string) => stored.get(url)?.clone() })) });
    vi.stubGlobal("fetch", vi.fn(async () => new Response("video bytes", { headers: { "Content-Type": "video/mp4" } })));
    expect(await isMediaSaved(media)).toBe(false);
    await saveMediaForOffline(media);
    expect(await isMediaSaved(media)).toBe(true);
    expect((await getSavedMedia(media))?.type).toBe("video/mp4");
    expect(put).toHaveBeenCalledOnce();
  });

  it.each([
    [200, "text/html"],
    [206, "video/mp4"],
    [404, "text/html"]
  ])("rejects invalid or incomplete downloads (%s, %s)", async (status, type) => {
    const put = vi.fn();
    vi.stubGlobal("caches", { open: vi.fn(async () => ({ put })) });
    vi.stubGlobal("fetch", vi.fn(async () => new Response("not a complete video", { status, headers: { "Content-Type": type } })));
    await expect(saveMediaForOffline(media)).rejects.toThrow();
    expect(put).not.toHaveBeenCalled();
  });
});
