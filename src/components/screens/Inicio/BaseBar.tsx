import { Box } from '@mui/material'
import { BarChart } from '@mui/x-charts'
const BaseBar = () => {
  return (
    
    <Box>
         <BarChart
             colors={['#B19CD9', '#D9A6B1', '#B1D9D1']} 
                    xAxis={[
                        {
                            id: 'barCategories',
                            data: ['bar 1', 'bar 2', 'bar 3'],
                            scaleType: 'band',
                        },
                    ]}
                    series={[
                        {
                            data: [5, 9, 1],
                        },
                    ]}
                    width={500}
                    height={300}
                />

    </Box>
  )
}

export default BaseBar