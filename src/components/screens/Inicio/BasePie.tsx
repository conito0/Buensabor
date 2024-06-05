import { PieChart } from '@mui/x-charts/PieChart';

export default function BasePie() {
  return (
    <PieChart
    colors={['#B19CD9', '#D9A6B1', '#B1D9D1']}


      series={[
        {
          data: [
            { id: 0, value: 10, label: 'producto 1' },
            { id: 1, value: 15, label: 'producto 2' },
            { id: 2, value: 20, label: 'producto 3' },
          ],
        },
      ]}
      width={400}
      height={200}
    />
  );
}