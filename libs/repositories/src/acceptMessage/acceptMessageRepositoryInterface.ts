import type { AcceptMessage, AcceptMessageUpdateBody } from '@rpg-together/models'

export interface IAcceptMessageRepository {
  createAcceptMessage(acceptMessage: AcceptMessage): Promise<AcceptMessage | null>

  getAcceptMessage(acceptMessageId: string): Promise<AcceptMessage | null>

  updateAcceptMessage(acceptMessageId: string, acceptMessageUpdateBody: AcceptMessageUpdateBody): Promise<void>

  deleteAcceptMessage(acceptMessageId: string): Promise<void>
}
