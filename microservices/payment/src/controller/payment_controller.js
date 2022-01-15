import dotenv from "dotenv";
dotenv.config();

import stripeLib from "stripe";

const stripe = stripeLib(process.env.STRIPE_SECRET_KEY);

export async function createPaymentIntent(req, res) {
  const amount = req.body.amount;
  const paymentMethodId = req.body.paymentMethodId;
  const customerId = req.body.customerId;

  if (amount === null) {
    return res.status(400).send({
      error: {
        message: 'La variable ammount debe contener datos',
      },
    });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "EUR",
      amount: amount,
      payment_method: paymentMethodId,
      customer: customerId
      // automatic_payment_methods: { enabled: true },
    });

    const paymentIntentConfirmed = await stripe.paymentIntents.confirm(
      paymentIntent.id,
    );

    // Send publishable key and PaymentIntent details to client
    res.status(200).send({
      payment: paymentIntentConfirmed,
    });

  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
}

/**
* Crea un usuario
*/
export async function createCustomer(req, res) {
  const email = req.body.email;
  const phone = req.body.phone;
  const name = req.body.name;
  const idempotencyKey = req.body.idempotencyKey;

  try {
    const customer = await stripe.customers.create({
      description: name,
      email: email,
      name: name,
      phone: phone
    }, {
      idempotencyKey: idempotencyKey,
    });

    res.status(200).send({ status: 'ok', code: 200, data: customer });

  } catch (error) {
    return res.status(400).send({
      error: {
        message: error,
      },
    });
  }
};

/**
* Retorna los métodos de pago del usuario
*
* @param {Object} data objeto que contiene customerId
* @param {functions.EventContext} context EventContext
* @returns {Object} metodos de pago y método de pago principal
*/
export async function getCustomerPaymentMethods(req, res) {

  const customerId = req.params.customerId;

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
        defaultPaymentMethod: customer.invoice_settings.default_payment_method,
      }
    });

  } catch (error) {
    return res.status(400).send({
      error: {
        message: error,
      },
    });
  }

};

export async function createPaymentMethod(req, res) {
  const customerId = req.body.customerId;
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
        cvc: cvc,
      },
    });

    const paymentMethodResult = await stripe.paymentMethods.attach(
      paymentMethod.id,
      { customer: customerId }
    );

    res.status(200).send({ status: 'ok', code: 200, data: paymentMethodResult });

  } catch (error) {
    return res.status(400).send({
      section: "Attaching card",
      error: {
        message: error,
      },
    });
  }
};
