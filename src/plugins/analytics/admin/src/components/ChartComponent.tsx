import { useIsMobile } from '@strapi/strapi/admin';
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
    const isMobile  = useIsMobile();

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
     
                pointRadius: 5,
                pointHoverRadius: 8,
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        min: 0,
                        suggestedMax: 10,
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            precision: 0
                        }
                    },
                    x: {
                        ticks: {
                            autoSkipPadding: 3,
                            minRotation: isMobile ? 75 : 0, 
                            maxRotation: isMobile ? 90 : 0,
                        }
                    }
                },



                plugins: {
                    legend: { position: 'top' },
                    title: { display: false, text: title }
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