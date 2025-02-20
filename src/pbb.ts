import { Message, PBB, User } from '../generated/schema';
import { 
        MemberAdded as MemberAddedEvent,
        MemberRemoved as MemberRemovedEvent,
        MessageAdded as MessageAddedEvent,
        AdminAdded as AdminAddedEvent,
        AdminRevoked as AdminRevokedEvent,
        } from '../generated/templates/PublicBulletinBoard/PBB';


export function handleMemberAdded(event: MemberAddedEvent): void {

  let user = User.load(event.params.newMember.toHex());
  if (!user) {
    user = new User(event.params.newMember.toHex());
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
    if (!pbb.members) {
      pbb.members = new Array<string>();
    }
    if (!pbb.members.includes(user.id)) {
      pbb.members = pbb.members.concat([user.id]);
    }

    // Guardar el usuario y el PBB actualizados
    user.save();
    pbb.save();
  }

}

export function handleMemberRemoved(event: MemberRemovedEvent): void {

  let pbb = PBB.load(event.address.toHex());
  if (pbb) {
    if (!pbb.members) {
      pbb.members = [];  // Inicializa si es null o undefined
    }

    let index = pbb.members.indexOf(event.params.revokedMember.toHex());
    if (index > -1) {
      let updatedUsers = pbb.members.slice(0); // Crea una copia para evitar problemas al modificar directamente
      updatedUsers.splice(index, 1);
      pbb.members = updatedUsers;
      pbb.save();
    }
  }

}

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
  message.txHash = event.transaction.hash;
  message.save();

  // Asociar el mensaje a la PBB
  let messages = pbb.messages || []; 
  messages.push(message.id);
  pbb.messages = messages;
  pbb.save();  

}

export function handleAdminAdded(event: AdminAddedEvent): void {

  let user = User.load(event.params.newAdmin.toHex());
  if (!user) {
    user = new User(event.params.newAdmin.toHex());
    user.authorizedPBBs = new Array<string>();  // Inicializa el arreglo de PBBs autorizados
  }

  let pbb = PBB.load(event.address.toHex());
  if (pbb) {

    // Añadir el usuario a la lista de usuarios autorizados del PBB
    if (!pbb.admins) {
      pbb.admins = new Array<string>();
    }

    pbb.admins = pbb.admins.concat([user.id]);

    // Guardar el usuario y el PBB actualizados
    user.save();
    pbb.save();
  }

}

export function handleAdminRevoked(event: AdminRevokedEvent): void {

  let pbb = PBB.load(event.address.toHex());
  if (pbb) {
    if (!pbb.members) {
      pbb.members = [];  // Inicializa si es null o undefined
    }

    let index = pbb.admins.indexOf(event.params.revokedAdmin.toHex());
    if (index > -1) {
      let updatedAdmins = pbb.admins.slice(0); // Crea una copia para evitar problemas al modificar directamente
      updatedAdmins.splice(index, 1);
      pbb.admins = updatedAdmins;
      pbb.save();
    }
  }  

}

