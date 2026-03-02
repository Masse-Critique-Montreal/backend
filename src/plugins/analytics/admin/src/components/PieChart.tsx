import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';

function PieChart({ title, data }: {
    title: string,
    data: {
        datasets: {
            data: number[],
            backgroundColor?: string[],
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
            type: 'doughnut',
            data,
            options: {
                cutout: '80%',
                radius: '80%',
                responsive: true,
                maintainAspectRatio: false,
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

export default PieChart;