import { StatusCodes } from 'http-status-codes';
import { Payment, User } from '../models.js';
import stripe from '../stripe.js';
import { InvalidRequest } from 'art-marketplace-common';

export async function createPayment (req, res, next) {
  const cartId = req.body.id;
  const { id: paymentMethodId } = req.body.paymentMethod;
  const items = req.body.items;
  const amount = items.reduce((a, b) => a + b.price, 0);

  const user = await getCurrentUser(req);
  const { stripeAccount: customerStripeId } = user;

  if (!items || !cartId || !paymentMethodId) {
    return next(new InvalidRequest('Revisar los campos requeridos.'));
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: 'EUR',
      amount: amount,
      payment_method: paymentMethodId,
      customer: customerStripeId
    });

    const paymentIntentConfirmed = await stripe.paymentIntents.confirm(
      paymentIntent.id
    );

    if (paymentIntentConfirmed.status === 'succeeded') {
      const paymentModel = new Payment({
        amount: amount,
        stripePaymentId: paymentIntent.id,
        createdAt: Date.now(),
        items: items,
        cartId: cartId,
        userId: user._id
      });

      await paymentModel.save();
      await res.publish('payment-success', paymentModel);

      res.status(StatusCodes.OK).json(paymentModel.toClient());
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(paymentIntentConfirmed);
    }
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
  }
}

/**
 * @param {String} email
 * @param {String} username
 * @param {String} firstname
 * @param {String} lastname
 * @returns {Object} customer
 */
export async function createCustomer ({ login: { email }, username, firstname, lastname }) {
  const customer = await stripe.customers.create({
    email: email,
    name: username,
    description: `Cliente ${firstname} ${lastname}`
  });

  return customer;
}

/**
 * Retorna los métodos de pago del usuario
 */
export async function getPaymentMethods (req, res) {
  const { stripeAccount: customerId } = await getCurrentUser(req);

  try {
    const { data: paymentMethods } = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card'
    });
    const customer = await stripe.customers.retrieve(customerId);
    if (customer && customer.default_source) {
      const defaultPaymentMethod = paymentMethods.find(e => e.id === customer.default_source);
      if (defaultPaymentMethod) {
        defaultPaymentMethod.default = true;
      }
    }

    res.status(StatusCodes.OK).json(paymentMethods);
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
  }
}

export async function createPaymentMethod (req, res) {
  const { stripeAccount: customerId } = await getCurrentUser(req);
  const token = req.body.token;

  try {
    const paymentMethodResult = await stripe.customers.createSource(customerId, { source: token.id });
    res.status(StatusCodes.CREATED).json(paymentMethodResult);
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
  }
}

export async function deletePaymentMethod (req, res) {
  const { stripeAccount: customerId } = await getCurrentUser(req);

  try {
    await stripe.customers.deleteSource(customerId, req.params.cardId);
    res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
  }
}

async function getCurrentUser (req) {
  return User.findById(req.app.locals.user.id);
}
