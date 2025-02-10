import { Message, PBB, User } from '../generated/schema';
import { UserAuthorized as UserAuthorizedEvent, MessageAdded as MessageAddedEvent, UserRevoked as UserRevokedEvent} from '../generated/templates/PublicBulletinBoard/PBB';


export function handleMessageAdded(event: MessageAddedEvent): void {

  let message = new Message(event.transaction.hash.toHex() + "-" + event.logIndex.toString());

  let pbb = PBB.load(event.address.toHex());

  if (!pbb) {
    // Si no encuentra la PBB, evita continuar
    return;
  }

  message.pbb = pbb.id;

  let user = User.load(event.params.sender.toHex());
  if (!user) {
    user = new User(event.params.sender.toHex());
    user.save();
  }
  
  message.sender = user.id;
  message.topic = event.params.topic;
  message.content = event.params.content;
  message.timestamp = event.block.timestamp;
  message.save();

  // Asociar el mensaje a la PBB
  let messages = pbb.messages || []; 
  messages.push(message.id);
  pbb.messages = messages;
  pbb.save();  

}

export function handleUserAuthorized(event: UserAuthorizedEvent): void {
  let user = User.load(event.params.newUser.toHex());
  if (!user) {
    user = new User(event.params.newUser.toHex());
    user.authorizedPBBs = new Array<string>();  // Inicializa el arreglo de PBBs autorizados
  }

  let pbb = PBB.load(event.address.toHex());
  if (pbb) {
    // Añadir el PBB a la lista de PBBs autorizados del usuario
    if (!user.authorizedPBBs) {
      user.authorizedPBBs = new Array<string>();
    }
    if (!user.authorizedPBBs!.includes(pbb.id)) {
      user.authorizedPBBs = user.authorizedPBBs!.concat([pbb.id]);
    }

    // Añadir el usuario a la lista de usuarios autorizados del PBB
    if (!pbb.authorizedUsers) {
      pbb.authorizedUsers = new Array<string>();
    }
    if (!pbb.authorizedUsers.includes(user.id)) {
      pbb.authorizedUsers = pbb.authorizedUsers.concat([user.id]);
    }

    // Guardar el usuario y el PBB actualizados
    user.save();
    pbb.save();
  }
}





export function handleUserRevoked(event: UserRevokedEvent): void {
  let pbb = PBB.load(event.address.toHex());
  if (pbb) {
    if (!pbb.authorizedUsers) {
      pbb.authorizedUsers = [];  // Inicializa si es null o undefined
    }

    let index = pbb.authorizedUsers.indexOf(event.params.user.toHex());
    if (index > -1) {
      let updatedUsers = pbb.authorizedUsers.slice(0); // Crea una copia para evitar problemas al modificar directamente
      updatedUsers.splice(index, 1);
      pbb.authorizedUsers = updatedUsers;
      pbb.save();
    }
  }
}

