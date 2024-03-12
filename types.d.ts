import type { DefaultUser } from '@auth/core/types'

declare module '@auth/core/types' {
  interface User extends Omit<DefaultUser, 'id'> {
    id: number
    username: string
  }

  interface Session {
    user?: User
  }

}

declare module '@auth/core/jwt' {
  interface JWT {
    id?: number
    username?: string
  }
}

export {}
