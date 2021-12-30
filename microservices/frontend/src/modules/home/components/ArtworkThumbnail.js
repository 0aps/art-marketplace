import { Badge, Button, Card, CardBody, CardImg, CardSubtitle, CardText, CardTitle, Row } from 'reactstrap';

export function ArtworkThumbnail ({ artwork, onAddToCart }) {
  return (
    <Card className='grid-item'>
      <CardImg
        className='artwork-card-image'
        alt='Card image cap'
        src='https://picsum.photos/318/180'
        top
      />
      <CardBody>
        <CardTitle tag='h4'>
          {artwork.name}
        </CardTitle>
        <CardSubtitle
          className='mb-2 text-muted'
          tag='h5'
        >
          <Badge
            color='info mx-3'
            href='#'
          > {artwork.category.name}
          </Badge>
          <Badge
            color='info mx-3'
            href='#'
          > {artwork.user.username}
          </Badge>
          <Badge
            color='info mx-3'
            href='#'
          > {(new Date(artwork.createdAt * 1000).toLocaleDateString())}
          </Badge>
        </CardSubtitle>
        <CardText>
          {artwork.description}
        </CardText>
        <Row>
          <h3>${artwork.price.toFixed(2)}</h3>
        </Row>
        <Row>
          <Button
            className='btn btn-sm btn-success'
            onClick={() => onAddToCart(artwork)}
          >
            <h5><i className='fa fa-cart-plus' aria-hidden='true'> Añadir al carrito</i></h5>
          </Button>
        </Row>

      </CardBody>
    </Card>
  );
}
