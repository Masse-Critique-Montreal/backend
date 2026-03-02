import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';

function HorizontalBarChart({ title, data }: {
    title: string,
    data: {
        datasets: {
            data: number[],
            label?: string,
            borderWidth?: number
        }[],
        labels: string[]
    }
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart(ctx, {
            type: 'bar',
            data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        min: 0,
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            precision: 0
                        }
                    }
                },
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: title }
                }
            }
        });

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };
    }, [data]);

    return <canvas style={{ width: '100%', height: '100%' }} ref={canvasRef} />;
}

export default HorizontalBarChart;