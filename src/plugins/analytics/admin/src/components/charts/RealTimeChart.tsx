import { useFetchClient } from "@strapi/strapi/admin";
import { useEffect, useState } from "react";
import { PLUGIN_ID } from "../../pluginId";

import VerticalBarChart from "../VerticalBarChart";


export default function RealTimeChart() {

    const [pageBarViews, setPageBarViews] = useState<{
        data: {
            minute: number,
            views: number
        }[]
    }>();

    const { get } = useFetchClient();

    useEffect(() => {
        const fetchData = async () => {
            try {

                const responseViewsBar = await get(`/${PLUGIN_ID}/page-views-realtime`);
                console.log(responseViewsBar)
                setPageBarViews(responseViewsBar.data)


            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [get]);

    const barChart = {
        labels: pageBarViews ? pageBarViews.data.reverse().map((view: any) => view.minute + 1) : [],
        datasets: [
            {
                label: "Views",

                data: pageBarViews ? pageBarViews.data.map((view: any) => (view.views)) : [],
                borderWidth: 1
            }
        ]
    }

    console.log(barChart)

    const total = pageBarViews ? pageBarViews.data.reduce((acc, view) => {
        return view.views + acc
    }, 0) : 0;

    return (
        <div className="realtime-container" style={{ display: 'flex', height: '100%', flexDirection: 'column', justifyContent: 'space-between', alignItems:'flex-start' }}>
            <h3 style={{ fontSize: '3rem', fontWeight: 'normal', lineHeight: '1.95rem', position: 'relative', margin: '1rem', padding:'3rem 0rem', minWidth: '10rem' }}>
                {total} view{(total > 1 || total === 0) ? 's' : ''} <br />
                <span style={{ fontSize: '1.5rem', fontWeight: 'lighter', marginLeft: '0.6rem' }}>Last 30 mins</span>
            </h3>
            <div className="realtime-chart" style={{ minHeight: '180px', maxHeight: '300px', width: '70%', height: '100%' }}>
                <VerticalBarChart data={barChart} title="Last 30 minutes" />
            </div>
            {/* Inline responsive styles */}
            <style>{`
        @media (max-width: 768px) {
            .realtime-container {
                flex-direction: column;
                padding: 1rem;

            }

            .realtime-chart {
                width: 100% !important;

                min-height: 180px !important;
                max-height: 200px !important;
            }
        }
      `}</style>
        </div>
    );
}