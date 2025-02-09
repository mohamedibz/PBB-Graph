import { DataSourceTemplate } from "@graphprotocol/graph-ts"
import {
  ImplementationAdded as ImplementationAddedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PBBCreated as PBBCreatedEvent
} from "../generated/PBBFactory/PBBFactory"
import {
  PBB,
  User,
} from "../generated/schema"

export function handlePBBCreated(event: PBBCreatedEvent): void {
  let pbb = new PBB(event.params.pbbAddress.toHex());

  let user = User.load(event.params.creator.toHex());
  
  if (!user) {
    user = new User(event.params.creator.toHex());  // Solo creas el `User` si no existe
    user.save();
  }

  pbb.creator = user.id;
  pbb.name = event.params.name;
  pbb.timestamp = event.block.timestamp;
  pbb.authorizedUsers = [];  // Inicializa el array vacío para evitar el error
  pbb.messages = [];         // Inicializa como array vacío
  pbb.save();

  DataSourceTemplate.create("PublicBulletinBoard", [event.params.pbbAddress.toHex()]);
}
