import type { AcceptMessage } from '@rpg-together/models'

export interface IAcceptMessageRepository {
  createAcceptMessage(acceptMessage: AcceptMessage): Promise<AcceptMessage | null>

  getAcceptMessage(acceptMessageId: string): Promise<AcceptMessage | null>

  updateAcceptMessage(acceptMessage: AcceptMessage): Promise<void>

  deleteAcceptMessage(acceptMessageId: string): Promise<void>
}
