export const todayISO = () => new Date().toISOString().slice(0, 10);
export const STORAGE_KEY = 'profile-form-draft';
export const THEME_STORAGE_KEY = 'theme';
export const GRAPHQL_ENDPOINT =
  import.meta.env.VITE_GRAPHQL_ENDPOINT || '/graphql';

export { httpInstance, uploadInstance } from './http';
