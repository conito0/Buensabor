import { useState } from 'react';
import {BaseNavBar} from "../../ui/common/BaseNavBar.tsx";

const images = [
  'img1.jpg',
  'img2.jpeg',
  'img3.jpg',
  'img4.jpg'
];

export const Inicio = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  return (
    <>
      <BaseNavBar />
      <div>
        <h1 className='text-center m-3'>El Buen Sabor</h1>
        <div id="carouselExample" className="carousel slide">
          <div className="carousel-inner">
            {images.map((image, index) => (
              <div className={`carousel-item ${index === currentImageIndex ? 'active' : ''}`} key={index}>
                <img src={`../../public/images/ui/${image}`} className="d-block w-100 img-fluid" alt={`Slide ${index + 1}`} style={{ objectFit: 'cover', maxHeight: '500px' }} />
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev" onClick={prevImage}>
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next" onClick={nextImage}>
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
        <div className='col-md-12'>
          <p className='text-center h5 m-3 mb-5'>
            Restaurante El Buen Sabor
          </p>
          <p className='text-center m-3 mb-5'>
            Ubicado en el corazón de la ciudad, El Buen Sabor es el destino perfecto para los amantes de la gastronomía que buscan una experiencia culinaria auténtica y memorable. Con una decoración acogedora y moderna, nuestro restaurante ofrece un ambiente cálido y familiar donde cada detalle ha sido cuidadosamente pensado para brindarte el máximo confort.
          </p>
          <p className='text-center m-3 mb-5'>
            <strong>Nuestra Cocina</strong>
          </p>
          <p className='text-center m-3 mb-5'>
            En El Buen Sabor, nos especializamos en una fusión de cocina tradicional y contemporánea, utilizando ingredientes frescos y de la más alta calidad. Nuestro menú, diseñado por chefs expertos, incluye una variedad de platos que van desde suculentos asados y mariscos frescos hasta opciones vegetarianas innovadoras y saludables.
          </p>
        </div>
        <hr />
      </div>
    </>
  );
};
export default Inicio;
