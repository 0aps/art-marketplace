import { User } from './models.js';
import { createCustomer } from './controller/payment_controller.js';

export default [
  {
    service: 'identity',
    channels: [
      {
        name: 'user-create',
        on: async (user) => {
          const customer = await createCustomer(user);

          const userModel = new User({
            _id: user._id,
            email: user.login.email,
            username: user.username,
            stripeAccount: customer.id
          });

          await userModel.save();
        }
      }
    ]
  }
];
