import React, { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';

const images = [
  'img1.jpg',
  'img2.jpg',
  'img3.jpg',
];

export const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  return (
    <Box>
      <Typography variant="h1" align="center" gutterBottom>
        Musical Hendrix
      </Typography>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <img
            src={`../../public/img/${images[currentImageIndex]}`}
            alt={`Slide ${currentImageIndex + 1}`}
            style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
          />
        </Grid>
      </Grid>
      <Box mt={2} textAlign="center">
        <Button onClick={prevImage} variant="contained">Previous</Button>
        <Button onClick={nextImage} variant="contained">Next</Button>
      </Box>
      <Typography variant="body1" align="center" gutterBottom mt={5}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, aliquam. Quia omnis quo assumenda vero. Doloremque vel debitis inventore natus dignissimos placeat ullam eius perspiciatis, voluptates blanditiis, voluptas repellendus sit!
      </Typography>
    </Box>
  );
};

