export type ServiceResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string };
