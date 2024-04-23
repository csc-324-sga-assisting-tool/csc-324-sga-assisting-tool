import 'server-only';
import {JWTPayload, SignJWT, jwtVerify} from 'jose';
// import { SessionPayload } from '@/app/lib/definitions'
import {cookies} from 'next/headers';

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

type SessionPayload = {userId: string; expiresAt: Date};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(encodedKey);
}

export async function decrypt(
  session: string | undefined = ''
): Promise<JWTPayload | void> {
  try {
    const {payload} = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.log('Failed to verify session');
  }
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 4 * 7 * 24 * 60 * 60 * 1000); // 4 weeks
  const session = await encrypt({userId, expiresAt});

  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    // sameSite: 'lax', // Not sure what this does
    path: '/', //'/dashboard',
  });
}

export function deleteSession() {
  cookies().delete('session');
}
