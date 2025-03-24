import AbstractMiddleware from "@bootstrap/AbstractMiddleware";
import Chat from "@models/Chat";

class AdminMiddleware extends AbstractMiddleware
{
     async handle() {
         return Chat.findAll({
             where: {
                 chat_id: this.message.chat.id,
                 is_admin: true
             }
         })
             .then(chats => {
                 return chats.length > 0
             })
             .catch(() => {
                 return false
             })
    }
}

module.exports = AdminMiddleware;