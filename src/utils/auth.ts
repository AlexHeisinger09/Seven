import type { User } from '../types';

export function mockLogin(email: string): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!email) {
        return reject(new Error('no puede estar en blanco'));
      }
      if (email.includes('@')) {
        resolve({ token: 'demo-token', email });
      } else {
        reject(new Error('formato de email inválido'));
      }
    }, 600);
  });
}