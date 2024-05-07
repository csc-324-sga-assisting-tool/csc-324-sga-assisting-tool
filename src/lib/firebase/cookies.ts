import {decodeJwt, decodeProtectedHeader, importX509, jwtVerify} from 'jose';
// fetchPublicKey is a helper method intended to fetch google's public signing keys
// to verify that firebase cookie was singed by google
async function fetchPublicKey(
  address: string
): Promise<{[key: string]: string}> {
  const res = await fetch(address);
  return await res.json();
}

// Constants used to verify cookies
const GOOGLE_PUBLIC_KEY =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
const PROJECT_ID = 'gbudget-324';
const KEY_ISSUER = `https://securetoken.google.com/${PROJECT_ID}`;

// verifyCookie checks that an auth cookie is valid and not expired
// if succesfull, return the email for the verified user
// https://firebase.google.com/docs/auth/admin/verify-id-tokens#verify_id_tokens_using_a_third-party_jwt_library
export async function verifyCookie(
  session?: string,
  uid?: string
): Promise<string> {
  if (!session || !uid) {
    return Promise.reject(new Error('no session cookie available'));
  }
  const keys = await fetchPublicKey(GOOGLE_PUBLIC_KEY);
  try {
    const header = decodeProtectedHeader(session);
    const keyString = keys[header.kid!];
    const key = await importX509(keyString, 'RS256');
    const {payload} = await jwtVerify(session, key);
    const now = Date.now() / 1000;
    if (payload.exp! <= now) {
      return Promise.reject(new Error('session cookie has expired'));
    }
    if (payload.aud !== PROJECT_ID) {
      return Promise.reject(
        new Error('session cookie contains invalid project id')
      );
    }
    if (payload.iat! > now) {
      return Promise.reject(
        new Error('session cookie was issued in the future')
      );
    }
    if (payload.iss! !== KEY_ISSUER) {
      return Promise.reject(
        new Error('session cookie contains invalid issuer')
      );
    }
    if (payload.sub !== uid) {
      return Promise.reject(
        new Error('session cookie contains invalid user information')
      );
    }
    return payload.email as string;
  } catch (error) {
    return Promise.reject(error);
  }
}

// decodeCookies returns the email from a firebase auth cookie WITHOUT verifiying
// for testing only
export async function decodeCookie(session?: string): Promise<string> {
  if (!session) {
    return Promise.reject(new Error('no session cookie available'));
  }
  const payload = decodeJwt(session);
  return payload.email as string;
}
