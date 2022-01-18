import { Button, CardImg, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { useForm } from '../../../hooks/useForm';
import FieldGroup from '../../../components/field-group/FieldGroup';

export function AddArtworkModal ({ isOpen, toggle, categories, onAddArtwork }) {
  const { state, onSubmit, onInputChange } = useForm({
    name: 'artwork',
    onSubmit: onAddArtwork,
    initState: {
      loaded: true,
      model: {
        image: null,
        name: '',
        description: '',
        price: 0,
        category: ''
      },
      error: {}
    }
  });

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
    >
      <ModalHeader toggle={toggle}>
        <i className='fa fa-plus-circle' /> Agregar una obra
      </ModalHeader>
      <ModalBody>
        <form className='form' name='artwork'>
          <div>
            {state.model.image && <CardImg
              alt='Card image cap'
              src={URL.createObjectURL(state.model.image)}
              top
                                  />}
            <FieldGroup
              id='image'
              name='image'
              type='file'
              label='Imagen de la obra'
              required
              onChange={onInputChange}
              help={state.error.image}
            />
          </div>
          <FieldGroup
            id='name'
            name='name'
            type='text'
            placeholder='Título de mi obra'
            required
            onChange={onInputChange}
            help={state.error.name}
          />
          <FieldGroup
            id='description'
            name='description'
            type='text'
            placeholder='Descripción de mi obra'
            required
            onChange={onInputChange}
            help={state.error.description}
          />
          <FieldGroup
            id='price'
            name='price'
            type='number'
            min='1'
            step='any'
            placeholder='Precio de mi obra'
            required
            onChange={onInputChange}
            help={state.error.price}
          />
          <div>
            <Label for='category'>
              Categoría
            </Label>
            <FieldGroup
              id='category'
              name='category'
              type='select'
              value={state.model.category ?? ''}
              options={categories.map(e => ({ text: e.name, value: e.id }))}
              required
              onChange={onInputChange}
              help={state.error.category}
            />
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button onClick={toggle}>
          Cancelar
        </Button>
        {' '}
        <Button
          color='success'
          onClick={onSubmit}
        >
          Agregar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
