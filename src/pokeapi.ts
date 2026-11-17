import { z } from "zod";
import { Cache } from "./pokecache.js";

const PokemonSchema = z.object({
  name: z.string(),
  base_experience: z.number(),
});

const PokemonEncounterSchema = z.object({
  pokemon: z.object({
    name: z.string()
  })
})

const LocationSchema = z.object({
  id: z.number(),
  name: z.string(),
  pokemon_encounters: z.array(PokemonEncounterSchema),
});

const ShallowLocationSchema = z.object({
  name: z.string()
});

const ShallowLocationsSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(ShallowLocationSchema),
});

export type Location = z.infer<typeof LocationSchema>;
export type Pokemon = z.infer<typeof PokemonSchema>;
export type PokemonEncounter = z.infer<typeof PokemonEncounterSchema>;
export type ShallowLocation = z.infer<typeof ShallowLocationSchema>;
export type ShallowLocations = z.infer<typeof ShallowLocationsSchema>;


export class PokeAPI {
  private static readonly BASE_URL = "https://pokeapi.co/api/v2";
  private static readonly ALL_LOCATION_AREAS_URL =`${PokeAPI.BASE_URL}/location-area`;
  private static readonly LOCATION_AREA_URL =`${PokeAPI.BASE_URL}/location-area/{locationName}`;
  private static readonly POKEMON_INFO_URL =`${PokeAPI.BASE_URL}/pokemon/{pokemonName}`;
  public static readonly PAGE_SIZE = 20;

  requestCache: Cache;

  constructor(cacheRefreshMs: number) {
      this.requestCache = new Cache(cacheRefreshMs);
  }

  async fetchData(url: string, schema: z.ZodType): Promise<unknown> {

      let cachedResponse = this.requestCache.get(url);

      if (!cachedResponse) {
        // delay useful to test caching behavior
        // await new Promise(resolve => setTimeout(resolve, 3000));

        const response = await fetch(`${url}`, { method: "GET" });
        const responseData = await response.json();
        cachedResponse = schema.parse(responseData);

        this.requestCache.add(url, cachedResponse);
      }

      return cachedResponse;
  }

  closeCache() {
        this.requestCache.stopReapLoop();
  }

  async fetchLocations(pageURL?: string | null): Promise<ShallowLocations> {
    if (!pageURL) {
        pageURL = PokeAPI.ALL_LOCATION_AREAS_URL;
    }

    const data = await this.fetchData(pageURL, ShallowLocationsSchema);
    return data as ShallowLocations;
  }

  async fetchLocation(locationName: string): Promise<Location> {
      const data = await this.fetchData(PokeAPI.LOCATION_AREA_URL.replace("{locationName}", locationName), LocationSchema);
      return LocationSchema.parse(data) as Location;
  }

  async fetchPokemon(pokemonName: string): Promise<Pokemon> {
      const data = await this.fetchData(PokeAPI.POKEMON_INFO_URL.replace("{pokemonName}", pokemonName), PokemonSchema);
      return PokemonSchema.parse(data) as Pokemon;
  }
}
