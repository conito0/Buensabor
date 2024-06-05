import { Dispatch, SetStateAction } from 'react';

export const handleSearch = (
    query: string,
    data: any[],
    setData: Dispatch<SetStateAction<any[]>>
) => {
  const filteredData = data.filter((item) => {
    // Convierte cada valor del objeto en un array de strings y los concatena en un solo array
    const values = Object.values(item).flatMap((value) =>
        Array.isArray(value) ? value.map(String) : [String(value)]
    );

    // Verifica si alguno de los valores incluye la consulta
    return values.some((value) =>
        value.toLowerCase().includes(query.toLowerCase())
    );
  });

  setData(filteredData);
};

