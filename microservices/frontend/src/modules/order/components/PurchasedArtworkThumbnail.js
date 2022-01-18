import { Badge, Card, CardBody, CardImg, CardSubtitle, CardText, CardTitle, Row } from 'reactstrap';
import { Link } from 'react-router-dom';

export function PurchasedArtworkThumbnail ({ artwork }) {
  return (
    <Card className='grid-item card-size'>
      <Link to={'/artwork/' + artwork.id}>
        <CardImg
          className='artwork-card-image'
          alt='Card image cap'
          src={artwork.defaultPicture?.path ?? 'https://picsum.photos/318/180'}
          top
        />
      </Link>
      <CardBody>
        <CardTitle tag='h4'>
          <Link to={'/artwork/' + artwork.id}>{artwork.name}</Link>
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

      </CardBody>
    </Card>
  );
}
