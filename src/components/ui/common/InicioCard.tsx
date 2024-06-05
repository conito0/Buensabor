import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

interface Content {
  url: string;
  title: string;
  content: string;
  verMasUrl: string; // Nueva propiedad para la URL del botón "Ver más"
}

const InicioCard: React.FC<{ content: Content }> = ({ content }) => {
  const { url, title, content: cardContent, verMasUrl } = content;
  

  return (
    <Card sx={{ maxWidth: 345, my: 2 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={url}
        title={title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {cardContent}
        </Typography>
      </CardContent>
      <CardActions>
        <Link to={verMasUrl} style={{ textDecoration: 'none', color: 'inherit' }}> {/* Utiliza la propiedad verMasUrl para construir el enlace */}
          <Button sx={{ color: '#FB6376' }} size="small">Ver más</Button>
        </Link>
      </CardActions>

      
    </Card>
  );
}

export default InicioCard;
