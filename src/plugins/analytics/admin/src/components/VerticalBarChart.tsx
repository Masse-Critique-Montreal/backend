import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';

function VerticalBarChart({ title, data }: {
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
                indexAxis: 'x',
                scales: {
                    y: {
                        min: 0,
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            precision: 0
                        },
                        display: false
                    }
                },
                plugins: {
                    legend: { display: false },
                    title: { display: false }
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

export default VerticalBarChart;