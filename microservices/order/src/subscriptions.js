import { User } from './models/models.js';
import {create_a_order} from './controller/order_controller.js';

export default [
  {
  service: 'identity',
  channels: [
    {
      name: 'user-create',
      on: async (user) => {
        const userModel = new User({
          _id: user._id,
          email: user.login.email,
          username: user.username
        });
        await userModel.save();
      }
    },
    {
      name: 'user-update',
      on: async (user) => {
        const userModel = await User.findById(user._id);
        if (userModel) {
          userModel.email = user.email;
          userModel.username = user.username;
          await userModel.save();
        }
      }
    }
  ]
},
{
  service: 'payment',
  channels: [
    {
      name: 'payment-success',
      on: create_a_order
    }
  ]
},

];
