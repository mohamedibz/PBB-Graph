import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ImplementationAdded,
  OwnershipTransferred,
  PBBCreated
} from "../generated/PBBFactory/PBBFactory"

export function createImplementationAddedEvent(
  version: BigInt,
  implementation: Address
): ImplementationAdded {
  let implementationAddedEvent = changetype<ImplementationAdded>(newMockEvent())

  implementationAddedEvent.parameters = new Array()

  implementationAddedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(version)
    )
  )
  implementationAddedEvent.parameters.push(
    new ethereum.EventParam(
      "implementation",
      ethereum.Value.fromAddress(implementation)
    )
  )

  return implementationAddedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPBBCreatedEvent(
  creator: Address,
  pbbAddress: Address,
  version: BigInt,
  name: string
): PBBCreated {
  let pbbCreatedEvent = changetype<PBBCreated>(newMockEvent())

  pbbCreatedEvent.parameters = new Array()

  pbbCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  pbbCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "pbbAddress",
      ethereum.Value.fromAddress(pbbAddress)
    )
  )
  pbbCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(version)
    )
  )
  pbbCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )

  return pbbCreatedEvent
}
