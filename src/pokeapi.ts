import { z } from "zod";
import { Cache } from "./pokecache.js";

// const LocationSchema = z.object({
//   id: z.number(),
//   name: z.string(),
//   region: z.object({
//     name: z.string(),
//     url: z.string(),
//   }),
// });

const ShallowLocationSchema = z.object({
  name: z.string(),
  url: z.string(),
});

const ShallowLocationsSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(ShallowLocationSchema),
});

// export type Location = z.infer<typeof LocationSchema>;
export type ShallowLocation = z.infer<typeof ShallowLocationSchema>;
export type ShallowLocations = z.infer<typeof ShallowLocationsSchema>;

export class PokeAPI {
  private static readonly baseURL = "https://pokeapi.co/api/v2";

  requestCache: Cache;

  constructor(cacheRefreshMs: number) {
      this.requestCache = new Cache(cacheRefreshMs);
  }

  async fetchLocations(pageURL?: string | null): Promise<ShallowLocations> {
    if (!pageURL) {
        pageURL = `${PokeAPI.baseURL}/location-area`;
    }

      let cachedResponse = this.requestCache.get(pageURL);
      if (!cachedResponse) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch(`${pageURL}`, { method: "GET" });
        const responseData = await response.json();
        cachedResponse = ShallowLocationsSchema.parse(responseData) as ShallowLocations;

        this.requestCache.add(pageURL, cachedResponse);
      }

      return cachedResponse as ShallowLocations;
  }

    closeCache() {
        this.requestCache.stopReapLoop();
  }

  // async fetchLocation(locationName: string): Promise<Location> {
  //     const response = await fetch(`${PokeAPI.baseURL}/location/${locationName}`, { method: "GET" });
  //     const responseData = await response.json();

  //     return LocationSchema.parse(responseData) as Location;
  // }
}
