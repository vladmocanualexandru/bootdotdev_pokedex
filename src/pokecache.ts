export type CacheEntry<T> = {
    createdAt: number;
    val: T;
}

export class Cache {
    #cache = new Map<string, CacheEntry<unknown>>();
    #interval: number;
    #reapIntervalId: NodeJS.Timeout | undefined;

    constructor(intervalMs: number) {
        this.#interval = intervalMs;
        this.#reapIntervalId = setInterval(() => this.#reap(), 1000);
    }

    add<T>(key: string, val: T) {
        this.#cache.set(key, {createdAt: Date.now(), val: val});
    }

    get<T>(key: string):T | undefined {
        if (this.#cache.has(key)) {
            const entry = this.#cache.get(key);
            return entry ? entry.val as T : undefined;
        } else {
            return undefined;
        }
    }

    #reap() {
        for (let [key, value] of  this.#cache.entries()) {
            if (value == undefined) {
                continue;
            }

            if ( Date.now() - value.createdAt >= this.#interval) {
                this.#cache.delete(key);
            }
        }
    }

    stopReapLoop() {
        if (this.#reapIntervalId) {
            clearInterval(this.#reapIntervalId);
            this.#reapIntervalId = undefined;
        }
    }

    getCache() {
        return this.#cache;
    }
}
