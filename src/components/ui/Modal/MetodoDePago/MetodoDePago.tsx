import React, { useState } from 'react';

enum TipoEnvio {
  DELIVERY = "DELIVERY",
  TAKEAWAY = "TAKE_AWAY"
}

const TipoEnvioComponent: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<TipoEnvio>(TipoEnvio.DELIVERY);

  return (
    <div>
      <label>
        <input 
          type="radio" 
          value={TipoEnvio.DELIVERY} 
          checked={selectedOption === TipoEnvio.DELIVERY} 
          onChange={() => setSelectedOption(TipoEnvio.DELIVERY)} 
        /> Delivery
      </label>
      <label>
        <input 
          type="radio" 
          value={TipoEnvio.TAKEAWAY} 
          checked={selectedOption === TipoEnvio.TAKEAWAY} 
          onChange={() => setSelectedOption(TipoEnvio.TAKEAWAY)} 
        /> Takeaway
      </label>

      {selectedOption === TipoEnvio.TAKEAWAY && (
        <div>
          <button> Pago en Efectivo </button>
          <button> Mercado Pago </button>
        </div>
      )}

      {selectedOption === TipoEnvio.DELIVERY && (
        <div>
          <button> Mercado Pago </button>
        </div>
      )}
    </div>
  );
};

export default TipoEnvioComponent;
