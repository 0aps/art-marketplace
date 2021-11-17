import mongoose from 'mongoose';
import Schemas from './schemas.js';

class PaymentModel {
}

export const Payment = mongoose.model('Payment', Schemas.Payment.loadClass(PaymentModel));
