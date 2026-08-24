/**
 * The API answers every endpoint with the same envelope:
 *
 *   { message, data, meta? }
 *
 * `data` is an object for a single record and an array for a list; `meta`
 * carries pagination and is present only on paginated lists.
 */

export function unwrapItem(response) {
  return response?.data?.data ?? null;
}

export function unwrapList(response) {
  const body = response?.data ?? {};

  return {
    items: Array.isArray(body.data) ? body.data : [],
    meta: body.meta ?? null,
  };
}
