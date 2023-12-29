import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private _cache;

  private _hitCount;

  private _missCount;

  private _size;

  private _debug;

  constructor() {
    this._cache = Object.create(null);
    this._hitCount = 0;
    this._missCount = 0;
    this._size = 0;
    this._debug = false;
  }

  public put(key: any, value: any, time: any, timeoutCallback?: any) {
    if (
      typeof time !== 'undefined' &&
      (typeof time !== 'number' || Number.isNaN(time) || time <= 0)
    ) {
      throw new Error('Cache timeout must be a positive number');
    }

    const oldRecord = this._cache[key];

    if (oldRecord) {
      clearTimeout(oldRecord.timeout);
    } else {
      this._size++;
    }

    const record: any = {
      value,
      expire: time + Date.now(),
    };

    if (!Number.isNaN(record.expire)) {
      record.timeout = setTimeout(() => {
        this._del(key);

        if (timeoutCallback) {
          timeoutCallback(key, value);
        }
      }, time);
    }

    this._cache[key] = record;

    return value;
  }

  public updateCache(key, newValue) {
    if (this._cache[key]) {
      this._cache[key].value = newValue;
    }
  }

  public del(key) {
    let canDelete = true;

    const oldRecord = this._cache[key];

    if (oldRecord) {
      clearTimeout(oldRecord.timeout);

      if (!isNaN(oldRecord.expire) && oldRecord.expire < Date.now()) {
        canDelete = false;
      }
    } else {
      canDelete = false;
    }

    if (canDelete) {
      this._del(key);
    }

    return canDelete;
  }

  private _del(key) {
    this._size--;
    delete this._cache[key];
  }

  public clear() {
    for (const key in this._cache) {
      if (this._cache.hasOwnProperty(key)) {
        clearTimeout(this._cache[key].timeout);
      }
    }
    this._size = 0;
    this._cache = Object.create(null);

    if (this._debug) {
      this._hitCount = 0;
      this._missCount = 0;
    }
  }

  public get(key) {
    const data = this._cache[key];

    if (typeof data !== 'undefined') {
      if (isNaN(data.expire) || data.expire >= Date.now()) {
        if (this._debug) this._hitCount++;
        return data.value;
      }
      // free some space
      if (this._debug) this._missCount++;
      this._size--;
      delete this._cache[key];
    } else if (this._debug) {
      this._missCount++;
    }
    return null;
  }

  public size() {
    return this._size;
  }

  public memsize() {
    let size = 0;
    let key;

    for (key in this._cache) {
      if (this._cache.hasOwnProperty(key)) {
        size++;
      }
    }
    return size;
  }

  public debug(bool) {
    this._debug = bool;
  }

  public hits() {
    return this._hitCount;
  }

  public misses() {
    return this._missCount;
  }

  public keys() {
    return Object.keys(this._cache);
  }

  public exportJson() {
    const plainJsCache = {};

    // Discard the `timeout` property.
    // Note: JSON doesn't support `NaN`, so convert it to `'NaN'`.
    for (const key in this._cache) {
      if (this._cache.hasOwnProperty(key)) {
        const record = this._cache[key];
        plainJsCache[key] = {
          value: record.value,
          expire: record.expire || 'NaN',
        };
      }
    }

    return JSON.stringify(plainJsCache);
  }

  public importJson(jsonToImport, options) {
    const cacheToImport = JSON.parse(jsonToImport);
    const currTime = Date.now();

    const skipDuplicates = options && options.skipDuplicates;

    for (const key in cacheToImport) {
      if (cacheToImport.hasOwnProperty(key)) {
        if (skipDuplicates) {
          const existingRecord = this._cache[key];

          if (existingRecord) {
            if (this._debug) {
              console.log("Skipping duplicate imported key '%s'", key);
            }
            continue;
          }
        }

        const record = cacheToImport[key];

        // record.expire could be `'NaN'` if no expiry was set.
        // Try to subtract from it; a string minus a number is `NaN`, which is perfectly fine here.
        let remainingTime = record.expire - currTime;

        if (remainingTime <= 0) {
          // Delete any record that might exist with the same key, since this key is expired.
          this.del(key);
          continue;
        }

        // Remaining time must now be either positive or `NaN`,
        // but `put` will throw an error if we try to give it `NaN`.
        remainingTime = remainingTime > 0 ? remainingTime : undefined;

        this.put(key, record.value, remainingTime);
      }
    }

    return this.size();
  }
}
