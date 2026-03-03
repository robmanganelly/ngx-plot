import { ResolveFn } from '@angular/router';

/**
 * A resolver function that fetches a JSON file from the specified path and returns its content as a typed object.
 *
 * @param source - The path to the JSON file to be fetched.
 * @returns A resolver function that returns a Promise resolving to the parsed JSON content of the JSON file.
 */
export const fetchResolver = <T>(source: string): ResolveFn<T> => async () =>  await (await fetch(source)).json();
