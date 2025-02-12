import { DataSourceTemplate } from "@graphprotocol/graph-ts"
import { PBB, User } from "../generated/schema"
import { 
        PBBCreated as PBBCreatedEvent, 
        ImplementationAdded as ImplementationAddedEvent,
        PBBUpdated as PBBUpdatedEvent 
        } from "../generated/PBBFactory/PBBFactory"


export function handlePBBCreated(event: PBBCreatedEvent): void {
  let pbb = new PBB(event.params.pbbAddress.toHex());

  let user = User.load(event.params.creator.toHex());
  
  if (!user) {
    user = new User(event.params.creator.toHex());  // Solo creas el `User` si no existe
    user.save();
  }

  pbb.creator = user.id;
  pbb.name = event.params.name;
  pbb.admins = [user.id];
  pbb.timestamp = event.block.timestamp;
  pbb.members = [];  // Inicializa el array vacío para evitar el error
  pbb.messages = [];
  pbb.version = event.params.version;         // Inicializa como array vacío
  pbb.save();

  DataSourceTemplate.create("PublicBulletinBoard", [event.params.pbbAddress.toHex()]);
}

export function handleImplementationAdded(event: ImplementationAddedEvent): void {
  // Usamos la versión como identificador único (si cada versión es única).
  /*
  let id = event.params.version.toString();
  let impl = new ImplementationAdded(id);
  
  impl.implementation = event.params.implementation.toHex();
  impl.version = event.params.version;
  impl.timestamp = event.block.timestamp;
  
  impl.save();
  */
}

export function handlePBBUpdated(event: PBBUpdatedEvent): void {
  // Cargamos la entidad PBB usando la dirección del PBB
  let pbb = PBB.load(event.params.pbbAddress.toHex());
  
  if (pbb == null) {
    // Si no se encuentra la entidad, se puede omitir o loguear la situación
    return;
  }
  
  // Actualizamos la versión del PBB
  pbb.version = event.params.version;
  pbb.save();
}
