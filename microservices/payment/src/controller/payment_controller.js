import dotenv from 'dotenv';

import stripeLib from 'stripe';

import { Payment, User } from '../models.js';
dotenv.config();

const stripe = stripeLib(process.env.STRIPE_SECRET_KEY);

export async function createPaymentIntent (req, res) {
  const amount = req.body.amount;
  const paymentMethodId = req.body.paymentMethodId;
  const cart = req.body.cart;

  const user = await getCurrentUser(req);
  const customerStripeId = user.stripeAccount;

  if (amount === null) {
    return res.status(400).send({
      error: {
        message: 'La variable ammount debe contener datos'
      }
    });
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
        id_pago_stripe: paymentIntent.id,
        date: Date.now(),
        items: cart.items,
        cart_id: cart.id,
        user_id: user.id
      });

      await paymentModel.save();
      await res.publish('payment-success', paymentModel);

      res.status(200).send({
        payment: paymentIntentConfirmed
      });
    } else {
      return res.status(500).send({
        error: {
          message: 'Ha ocurrido un error durante el pago',
          payment: paymentIntentConfirmed
        }
      });
    }
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message
      }
    });
  }
}

/**
* @param {String} email
* @param {String} phone
* @param {String} name
* @returns {Object} customer
*/
export async function createCustomer (email, phone, name) {
  const customer = await stripe.customers.create({
    description: name,
    email: email,
    name: name,
    phone: phone
  });

  return customer;
}

/**
* Retorna los métodos de pago del usuario
*
* @param {Object} data objeto que contiene customerId
* @param {functions.EventContext} context EventContext
* @returns {Object} metodos de pago y método de pago principal
*/
export async function getCustomerPaymentMethods (req, res) {
  // const customerId = req.params.customerId;
  const customerId = (await getCurrentUser(req)).stripeAccount;

  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card'
    });

    const customer = await stripe.customers.retrieve(customerId);

    res.status(200).send({
      status: 'ok',
      code: 200,
      data: {
        paymentMethods: paymentMethods,
        defaultPaymentMethod: customer.invoice_settings.default_payment_method
      }
    });
  } catch (error) {
    return res.status(400).send({
      error: {
        message: error
      }
    });
  }
}

export async function createPaymentMethod (req, res) {
  // const customerId = req.params.customerId;
  const customerId = (await getCurrentUser(req)).stripeAccount;
  const cardNumber = req.body.cardNumber;
  const expMonth = req.body.expMonth;
  const expYear = req.body.expYear;
  const cvc = req.body.cvc;

  try {
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: cardNumber,
        exp_month: expMonth,
        exp_year: expYear,
        cvc: cvc
      }
    });

    const paymentMethodResult = await stripe.paymentMethods.attach(
      paymentMethod.id,
      { customer: customerId }
    );

    res.status(200).send({ status: 'ok', code: 200, data: paymentMethodResult });
  } catch (error) {
    return res.status(400).send({
      section: 'Attaching card',
      error: {
        message: error
      }
    });
  }
}

async function getCurrentUser (req) {
  const existingUser = req.app.locals.user;
  return await User.findById(existingUser._id);
}
