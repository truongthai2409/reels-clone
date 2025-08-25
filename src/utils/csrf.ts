// // CSRF Token Management Utility
// // This file provides utilities to manage CSRF tokens for secure file uploads

// /**
//  * Set CSRF token in meta tag
//  * @param token - The CSRF token to set
//  */
// export function setCSRFTokenInMeta(token: string): void {
//   let metaTag = document.querySelector('meta[name="csrf-token"]');

//   if (!metaTag) {
//     metaTag = document.createElement('meta');
//     metaTag.setAttribute('name', 'csrf-token');
//     document.head.appendChild(metaTag);
//   }

//   metaTag.setAttribute('content', token);
//   console.log('CSRF token set in meta tag');
// }

// /**
//  * Set CSRF token in cookies
//  * @param token - The CSRF token to set
//  * @param options - Cookie options
//  */
// export function setCSRFCookie(
//   token: string,
//   options: {
//     path?: string;
//     secure?: boolean;
//     sameSite?: 'strict' | 'lax' | 'none';
//     expires?: Date;
//   } = {}
// ): void {
//   const {
//     path = '/',
//     secure = true,
//     sameSite = 'strict',
//     expires
//   } = options;

//   let cookieString = `csrf-token=${token}; path=${path}; secure=${secure.toString()}; samesite=${sameSite}`;

//   if (expires) {
//     cookieString += `; expires=${expires.toUTCString()}`;
//   }

//   document.cookie = cookieString;
//   console.log('CSRF token set in cookies');
// }

// /**
//  * Get CSRF token from various sources
//  * @returns The CSRF token if found, null otherwise
//  */
// export function getCSRFToken(): string | null {
//   // Try meta tag first
//   const metaTag = document.querySelector('meta[name="csrf-token"]');
//   if (metaTag) {
//     const token = metaTag.getAttribute('content');
//     if (token) return token;
//   }

//   // Try cookies
//   const cookies = document.cookie.split(';');
//   for (const cookie of cookies) {
//     const [name, value] = cookie.trim().split('=');
//     if (name === 'csrf-token' || name === 'XSRF-TOKEN') {
//       return value;
//     }
//   }

//   return null;
// }

// /**
//  * Check if CSRF token is available
//  * @returns Object with token availability and value
//  */
// export function checkCSRFToken(): { hasToken: boolean; tokenValue: string | null } {
//   const token = getCSRFToken();
//   return {
//     hasToken: !!token,
//     tokenValue: token
//   };
// }

// /**
//  * Refresh CSRF token from server
//  * @param endpoint - The endpoint to fetch new CSRF token
//  * @returns The new CSRF token if successful, null otherwise
//  */
// export async function refreshCSRFToken(endpoint: string = '/api/csrf-token'): Promise<string | null> {
//   try {
//     const response = await fetch(endpoint, {
//       method: 'GET',
//       credentials: 'include',
//       headers: {
//         'Accept': 'application/json',
//       }
//     });

//     if (response.ok) {
//       const data = await response.json();
//       const token = data.csrfToken || data.token || data.csrf_token;

//       if (token) {
//         // Auto-set the token in meta tag and cookies
//         setCSRFTokenInMeta(token);
//         setCSRFCookie(token);
//         console.log('CSRF token refreshed successfully');
//         return token;
//       }
//     }
//   } catch (error) {
//     console.error('Failed to refresh CSRF token:', error);
//   }

//   return null;
// }

// /**
//  * Auto-refresh CSRF token at regular intervals
//  * @param intervalMinutes - Interval in minutes (default: 5)
//  * @param endpoint - The endpoint to fetch new CSRF token
//  * @returns Function to stop the auto-refresh
//  */
// export function startCSRFAutoRefresh(
//   intervalMinutes: number = 5,
//   endpoint: string = '/api/csrf-token'
// ): () => void {
//   const intervalMs = intervalMinutes * 60 * 1000;

//   const intervalId = setInterval(async () => {
//     const newToken = await refreshCSRFToken(endpoint);
//     if (newToken) {
//       console.log(`CSRF token auto-refreshed every ${intervalMinutes} minutes`);
//     }
//   }, intervalMs);

//   // Return function to stop auto-refresh
//   return () => {
//     clearInterval(intervalId);
//     console.log('CSRF auto-refresh stopped');
//   };
// }

// /**
//  * Initialize CSRF token management
//  * @param initialToken - Initial CSRF token (optional)
//  * @param autoRefresh - Whether to enable auto-refresh (default: true)
//  * @param refreshInterval - Auto-refresh interval in minutes (default: 5)
//  * @param endpoint - CSRF token endpoint (default: '/api/csrf-token')
//  */
// export function initializeCSRF(
//   initialToken?: string,
//   autoRefresh: boolean = true,
//   refreshInterval: number = 5,
//   endpoint: string = '/api/csrf-token'
// ): { stopAutoRefresh: () => void } {
//   console.log('Initializing CSRF token management...');

//   // Set initial token if provided
//   if (initialToken) {
//     setCSRFTokenInMeta(initialToken);
//     setCSRFCookie(initialToken);
//   }

//   // Check current token status
//   const status = checkCSRFToken();
//   console.log('CSRF token status:', status);

//   let stopAutoRefresh: () => void = () => {};

//   // Start auto-refresh if enabled
//   if (autoRefresh) {
//     stopAutoRefresh = startCSRFAutoRefresh(refreshInterval, endpoint);
//   }

//   return { stopAutoRefresh };
// }

// /**
//  * Remove CSRF token from meta tag and cookies
//  */
// export function clearCSRFToken(): void {
//   // Remove from meta tag
//   const metaTag = document.querySelector('meta[name="csrf-token"]');
//   if (metaTag) {
//     metaTag.remove();
//   }

//   // Remove from cookies
//   document.cookie = 'csrf-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
//   document.cookie = 'XSRF-TOKEN=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

//   console.log('CSRF token cleared');
// }

// /**
//  * Validate CSRF token format (basic validation)
//  * @param token - The token to validate
//  * @returns Whether the token format is valid
//  */
// export function validateCSRFTokenFormat(token: string): boolean {
//   // Basic validation: token should be non-empty and have reasonable length
//   return token && token.length > 10 && token.length < 1000;
// }

// /**
//  * Get CSRF token with validation
//  * @returns Valid CSRF token or null
//  */
// export function getValidCSRFToken(): string | null {
//   const token = getCSRFToken();

//   if (token && validateCSRFTokenFormat(token)) {
//     return token;
//   }

//   return null;
// }

// // Export all functions
// export default {
//   setCSRFTokenInMeta,
//   setCSRFCookie,
//   getCSRFToken,
//   checkCSRFToken,
//   refreshCSRFToken,
//   startCSRFAutoRefresh,
//   initializeCSRF,
//   clearCSRFToken,
//   validateCSRFTokenFormat,
//   getValidCSRFToken
// };
