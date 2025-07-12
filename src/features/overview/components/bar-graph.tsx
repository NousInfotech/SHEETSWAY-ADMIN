'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

export const description = 'An interactive bar chart';

const chartData = [
  { date: '2024-04-01', completed: 222, pending: 150 },
  { date: '2024-04-02', completed: 97, pending: 180 },
  { date: '2024-04-03', completed: 167, pending: 120 },
  { date: '2024-04-04', completed: 242, pending: 260 },
  { date: '2024-04-05', completed: 373, pending: 290 },
  { date: '2024-04-06', completed: 301, pending: 340 },
  { date: '2024-04-07', completed: 245, pending: 180 },
  { date: '2024-04-08', completed: 409, pending: 320 },
  { date: '2024-04-09', completed: 59, pending: 110 },
  { date: '2024-04-10', completed: 261, pending: 190 },
  { date: '2024-04-11', completed: 327, pending: 350 },
  { date: '2024-04-12', completed: 292, pending: 210 },
  { date: '2024-04-13', completed: 342, pending: 380 },
  { date: '2024-04-14', completed: 137, pending: 220 },
  { date: '2024-04-15', completed: 120, pending: 170 },
  { date: '2024-04-16', completed: 138, pending: 190 },
  { date: '2024-04-17', completed: 446, pending: 360 },
  { date: '2024-04-18', completed: 364, pending: 410 },
  { date: '2024-04-19', completed: 243, pending: 180 },
  { date: '2024-04-20', completed: 89, pending: 150 },
  { date: '2024-04-21', completed: 137, pending: 200 },
  { date: '2024-04-22', completed: 224, pending: 170 },
  { date: '2024-04-23', completed: 138, pending: 230 },
  { date: '2024-04-24', completed: 387, pending: 290 },
  { date: '2024-04-25', completed: 215, pending: 250 },
  { date: '2024-04-26', completed: 75, pending: 130 },
  { date: '2024-04-27', completed: 383, pending: 420 },
  { date: '2024-04-28', completed: 122, pending: 180 },
  { date: '2024-04-29', completed: 315, pending: 240 },
  { date: '2024-04-30', completed: 454, pending: 380 },
  { date: '2024-05-01', completed: 165, pending: 220 },
  { date: '2024-05-02', completed: 293, pending: 310 },
  { date: '2024-05-03', completed: 247, pending: 190 },
  { date: '2024-05-04', completed: 385, pending: 420 },
  { date: '2024-05-05', completed: 481, pending: 390 },
  { date: '2024-05-06', completed: 498, pending: 520 },
  { date: '2024-05-07', completed: 388, pending: 300 },
  { date: '2024-05-08', completed: 149, pending: 210 },
  { date: '2024-05-09', completed: 227, pending: 180 },
  { date: '2024-05-10', completed: 293, pending: 330 },
  { date: '2024-05-11', completed: 335, pending: 270 },
  { date: '2024-05-12', completed: 197, pending: 240 },
  { date: '2024-05-13', completed: 197, pending: 160 },
  { date: '2024-05-14', completed: 448, pending: 490 },
  { date: '2024-05-15', completed: 473, pending: 380 },
  { date: '2024-05-16', completed: 338, pending: 400 },
  { date: '2024-05-17', completed: 499, pending: 420 },
  { date: '2024-05-18', completed: 315, pending: 350 },
  { date: '2024-05-19', completed: 235, pending: 180 },
  { date: '2024-05-20', completed: 177, pending: 230 },
  { date: '2024-05-21', completed: 82, pending: 140 },
  { date: '2024-05-22', completed: 81, pending: 120 },
  { date: '2024-05-23', completed: 252, pending: 290 },
  { date: '2024-05-24', completed: 294, pending: 220 },
  { date: '2024-05-25', completed: 201, pending: 250 },
  { date: '2024-05-26', completed: 213, pending: 170 },
  { date: '2024-05-27', completed: 420, pending: 460 },
  { date: '2024-05-28', completed: 233, pending: 190 },
  { date: '2024-05-29', completed: 78, pending: 130 },
  { date: '2024-05-30', completed: 340, pending: 280 },
  { date: '2024-05-31', completed: 178, pending: 230 },
  { date: '2024-06-01', completed: 178, pending: 200 },
  { date: '2024-06-02', completed: 470, pending: 410 },
  { date: '2024-06-03', completed: 103, pending: 160 },
  { date: '2024-06-04', completed: 439, pending: 380 },
  { date: '2024-06-05', completed: 88, pending: 140 },
  { date: '2024-06-06', completed: 294, pending: 250 },
  { date: '2024-06-07', completed: 323, pending: 370 },
  { date: '2024-06-08', completed: 385, pending: 320 },
  { date: '2024-06-09', completed: 438, pending: 480 },
  { date: '2024-06-10', completed: 155, pending: 200 },
  { date: '2024-06-11', completed: 92, pending: 150 },
  { date: '2024-06-12', completed: 492, pending: 420 },
  { date: '2024-06-13', completed: 81, pending: 130 },
  { date: '2024-06-14', completed: 426, pending: 380 },
  { date: '2024-06-15', completed: 307, pending: 350 },
  { date: '2024-06-16', completed: 371, pending: 310 },
  { date: '2024-06-17', completed: 475, pending: 520 },
  { date: '2024-06-18', completed: 107, pending: 170 },
  { date: '2024-06-19', completed: 341, pending: 290 },
  { date: '2024-06-20', completed: 408, pending: 450 },
  { date: '2024-06-21', completed: 169, pending: 210 },
  { date: '2024-06-22', completed: 317, pending: 270 },
  { date: '2024-06-23', completed: 480, pending: 530 },
  { date: '2024-06-24', completed: 132, pending: 180 },
  { date: '2024-06-25', completed: 141, pending: 190 },
  { date: '2024-06-26', completed: 434, pending: 380 },
  { date: '2024-06-27', completed: 448, pending: 490 },
  { date: '2024-06-28', completed: 149, pending: 200 },
  { date: '2024-06-29', completed: 103, pending: 160 },
  { date: '2024-06-30', completed: 446, pending: 400 }
];

const chartConfig = {
  views: {
    label: 'Page Views'
  },
  completed: {
    label: 'Completed',
    color: 'var(--primary)'
  },
  pending: {
    label: 'Pending',
    color: 'var(--primary)'
  },
  error: {
    label: 'Error',
    color: 'var(--primary)'
  }
} satisfies ChartConfig;

export function BarGraph() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('completed');

  const total = React.useMemo(
    () => ({
      completed: chartData.reduce((acc, curr) => acc + curr.completed, 0),
      pending: chartData.reduce((acc, curr) => acc + curr.pending, 0)
    }),
    []
  );

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (activeChart === 'error') {
      throw new Error('Mocking Error');
    }
  }, [activeChart]);

  if (!isClient) {
    return null;
  }

  return (
    <Card className='@container/card !pt-3'>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 !py-0'>
          <CardTitle>All Projects</CardTitle>
          <CardDescription>
            <span className='hidden @[540px]/card:block'>
              Total for the last 3 months
            </span>
            <span className='@[540px]/card:hidden'>Last 3 months</span>
          </CardDescription>
        </div>
        <div className='flex'>
          {['completed', 'pending', 'error'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            if (!chart || total[key as keyof typeof total] === 0) return null;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className='data-[active=true]:bg-primary/5 hover:bg-primary/5 relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left transition-colors duration-200 even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6'
                onClick={() => setActiveChart(chart)}
              >
                <span className='text-muted-foreground text-xs'>
                  {chartConfig[chart].label}
                </span>
                <span className='text-lg leading-none font-bold sm:text-3xl'>
                  {total[key as keyof typeof total]?.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <defs>
              <linearGradient id='fillBar' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='0%'
                  stopColor='var(--primary)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='100%'
                  stopColor='var(--primary)'
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <ChartTooltip
              cursor={{ fill: 'var(--primary)', opacity: 0.1 }}
              content={
                <ChartTooltipContent
                  className='w-[150px]'
                  nameKey='views'
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                  }}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill='url(#fillBar)'
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
