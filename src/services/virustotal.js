// lightweight helper for calling VirusTotal IP endpoints
// this module is intentionally free of any Node-specific globals so that
// importing it from browser code won't crash with "process is not defined".

const BASE_URL = "https://www.virustotal.com/api/v3";

/**
 * Build a validator bound to a particular API key.
 *
 * The returned function accepts an array of IP strings and returns a promise
 * resolving to an object keyed by IP address.  Each value will either be the
 * parsed JSON response from VT or an object containing an `error` message if
 * the request failed.
 *
 * @param {string} apiKey - VirusTotal API key (required)
 * @returns {(ips: string[]) => Promise<Record<string, any>>}
 */
export function createValidator(apiKey) {
  if (!apiKey || typeof apiKey !== "string") {
    throw new Error("apiKey string is required to create a validator");
  }

  const headers = { "x-apikey": apiKey };

  return async function validateIps(ips) {
    if (!Array.isArray(ips)) {
      throw new TypeError("validateIps expects an array of IP strings");
    }

    const results = {};

    await Promise.all(
      ips.map(async (ip) => {
        try {
          const resp = await fetch(
            `${BASE_URL}/ip_addresses/${encodeURIComponent(ip)}`,
            { headers },
          );

          if (!resp.ok) {
            const text = await resp.text();
            throw new Error(`VT ${resp.status}: ${text}`);
          }

          results[ip] = await resp.json();
        } catch (err) {
          results[ip] = { error: err.message };
        }
      }),
    );

    return results;
  };
}

export default { createValidator };
