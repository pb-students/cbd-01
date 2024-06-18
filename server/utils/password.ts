import { randomBytes } from 'crypto'
import { z } from 'zod'
import { hash } from '@node-rs/argon2'
export { hash, verify } from '@node-rs/argon2'

export const generateSubstrings = function* (password: string) {
  const maxK = Math.max(5, password.length / 2 | 0)
  for (let k = 5; k < maxK + 1; ++k) {
    for (let i = 0; i < password.length - k; ++i) {
      yield { i, k, password: password.slice(i, i + k) }
    }
  }
}

export const passwordSchema = z.string().min(8).max(16).transform(async (password) => {
  // NOTE: Should the salt be unique per user or per partial-password?
  const salt = randomBytes(32)

  const partialPasswords = Array.from(generateSubstrings(password))
    .map(({ i, k, password }) => hash(password, { salt })
      .then((hashedPassword) => ({ i, k, hashedPassword }))
    )

  return Promise.all(partialPasswords)
})
