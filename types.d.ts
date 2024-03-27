import type { DefaultUser } from '@auth/core/types'

declare module '@auth/core/types' {
  export interface User extends Omit<DefaultUser, 'id'> {
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

export type { Message } from '~/server/api/messages/index.get'

export {}
