import {
  ImplementationAdded as ImplementationAddedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PBBCreated as PBBCreatedEvent
} from "../generated/PBBFactory/PBBFactory"
import {
  ImplementationAdded,
  OwnershipTransferred,
  PBBCreated
} from "../generated/schema"

export function handleImplementationAdded(
  event: ImplementationAddedEvent
): void {
  let entity = new ImplementationAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.version = event.params.version
  entity.implementation = event.params.implementation

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePBBCreated(event: PBBCreatedEvent): void {
  let entity = new PBBCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.creator = event.params.creator
  entity.pbbAddress = event.params.pbbAddress
  entity.version = event.params.version
  entity.name = event.params.name

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
