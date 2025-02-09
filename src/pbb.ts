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
  }

  let pbb = PBB.load(event.address.toHex());
  if (pbb) {
    pbb.authorizedUsers = pbb.authorizedUsers.concat([user.id]);
    pbb.save();
  }

  user.save();
}

export function handleUserRevoked(event: UserRevokedEvent): void {

  let pbb = PBB.load(event.address.toHex());
  if (pbb) {
    let index = pbb.authorizedUsers.indexOf(event.params.user.toHex());
    if (index > -1) {
      let updatedUsers = pbb.authorizedUsers;
      updatedUsers.splice(index, 1);
      pbb.authorizedUsers = updatedUsers;
      pbb.save();
    }
  }
}
