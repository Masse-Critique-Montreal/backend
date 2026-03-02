import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';

function ChartComponent({ title, data }: {
    title: string,
    data: {
        datasets: {
            data: number[],
            label?: string, // Added label property as it's standard
            borderWidth?: number
        }[],
        labels: string[]
    }
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null); // Track the actual chart object

    useEffect(() => {
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        // 1. Destroy previous instance before creating a new one
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        // 2. Create the new chart
        chartInstanceRef.current = new Chart(ctx, {
            type: 'line',
            data,
            options: {

                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        min: 0,
                        suggestedMax: 10, // Try setting a hard number here first to see if it reacts
                        // 1. Force the axis to start at 0 (optional but helpful)
                        beginAtZero: true,
                        ticks: {
                            // 2. Force the gap between numbers to be exactly 1
                            stepSize: 1,
                            // 3. Ensure no decimal points are rendered at all
                            precision: 0
                        }
                    }
                },



                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: title }
                }
            },
        });

        // 3. Cleanup on unmount
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };
    }, [data]);

    return <canvas style={{ position: 'relative', width: '100%', height: '100%' }} ref={canvasRef} />;
}

export default ChartComponent;