const Message = require('../models/message-model');
const User = require('../models/user-model');

const jwt = require('jsonwebtoken');

const secret_key=process.env.SECRET_KEY

const sendMessage = async (req, res, next) => {
  try {
    const message = req.body.message.message;
    const token = req.body.message.token;

    const io = req.app.get('io');
    jwt.verify(token, secret_key, async (err, decoded) => {

      if (err) {
          res.status(401).json({ error: 'Unauthorized' });
      } else { 
          const data = await Message.create({ message: message,userId: decoded.userId });
          const user = await User.findOne({where:{ id:decoded.userId}})
          
          io.emit('recieve-message', {data,user});
          res.status(200).json({ newMessage: data});
        }
      });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}







// const getMessage = async (req, res, next) => {
//   try {
//     const messages = await Message.findAll({
//       include: [
//         {
//           model: User,
//           attribute: ['name'],
//         },
//       ],
//     });
//     console.log(messages);
//     res.status(200).json({ allMessage: messages, success: true });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// }

//  const allMessage = async function (req, res) {
//   let messageId = req.params.id;
//   try {
//       const newMessages = await Message.findAll({
//           where: {
//               id: {
//                   [sequelize.Op.gt]: messageId
//               }
//           }
//       })
//       res.status(200).json({ newMessages });
//       console.log(newMessages);
//   }
//   catch (error) {
//       console.log(error);
//   }
// }

module.exports = {
  sendMessage,
  // getMessage,
  // allMessage
}