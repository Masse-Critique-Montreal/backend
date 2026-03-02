import { useFetchClient } from "@strapi/strapi/admin";
import { useEffect, useState } from "react";
import { PLUGIN_ID } from "../../pluginId";
import HorizontalBarChart from "../BarChart";


export default function PagesBarChart() {

    const [pageBarViews, setPageBarViews] = useState<{data:{
        url: string,
        views: number
    }[]}>();

    const { get } = useFetchClient();

    useEffect(() => {
        const fetchData = async () => {
            try {
     
                const responseViewsBar = await get(`/${PLUGIN_ID}/page-views-url`);
                setPageBarViews(responseViewsBar.data)
    

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [get]);

    const barChart = {
        labels: pageBarViews ? pageBarViews.data.map((view: any) => view.url) : [],
        datasets: [
            {
                label: "Views",
                data: pageBarViews ? pageBarViews.data.map((view: any) => view.views) : [],
                borderWidth: 1
            }
        ]
    }


    return (
        <HorizontalBarChart data={barChart} title="Page Views per URL" />
    );
}