import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

export function AddPaymentMethodModal ({ isOpen, toggle, onAddPaymentMethod }) {
  const stripe = useStripe();
  const elements = useElements();

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
    >
      <ModalHeader toggle={toggle}>
        <i className='fa fa-plus-circle' /> Agrega método de pago
      </ModalHeader>
      <ModalBody>
        <CardElement />
      </ModalBody>
      <ModalFooter>
        <Button onClick={toggle}>
          Cancelar
        </Button>
        {' '}
        <Button
          color='success'
          onClick={(event) => onAddPaymentMethod({ event, elements, stripe })}
        >
          Agregar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
