import { Table } from 'reactstrap';

export function ArtworkList ({ artworks, onEditItem, onRemoveItem }) {
  return (
    <>
      {artworks.length === 0 &&
        <h4>No tienes obras creadas. Agrega una! </h4>}
      {artworks.length > 0 &&
        <Table striped>
          <thead>
            <tr>
              <th />
              <th>
                Obra
              </th>
              <th>
                Precio
              </th>
              <th>
                Categoría
              </th>
              <th>
                Creada en
              </th>
              <th>
                Certificado
              </th>
            </tr>
          </thead>
          <tbody>
            {artworks.map(item =>
              <tr key={item.id}>
                <th scope='row'>
                  <h4>
                    <a
                      className='pointer mx-3'
                      onClick={() => onEditItem(item)}
                    >
                      <span><i className='fa fa-edit' /></span>
                    </a>
                    <a
                      className='pointer'
                      onClick={() => onRemoveItem(item)}
                    >
                      <span><i className='fa fa-trash' /></span>
                    </a>
                  </h4>
                </th>
                <td>
                  {item.name}
                </td>
                <td>
                  ${item.price.toFixed(2)}
                </td>
                <td>
                  {item.category.name}
                </td>
                <td>
                  {(new Date(item.createdAt * 1000).toLocaleDateString())}
                </td>
                <td>
                  {(new Date(item.createdAt * 1000).toLocaleDateString())}
                </td>
              </tr>)}
          </tbody>
        </Table>}
    </>
  );
}
