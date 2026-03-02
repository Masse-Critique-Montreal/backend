import { useFetchClient } from "@strapi/strapi/admin";
import ChartComponent from "../ChartComponent";
import { useEffect, useState } from "react";
import { PLUGIN_ID } from "../../pluginId";


export default function ViewLineChart() {

    const [data, setData] = useState<{data:{
        count: number,
        day: string
    }[]}>();
    const [dataViews, setDataViews] = useState<{data:{
        count: number
    }[]}>();

    const { get } = useFetchClient();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // The URL is automatically prefixed with /plugin-name
                const response = await get(`/${PLUGIN_ID}/sessions`);
                setData(response.data);

                const responseViews = await get(`/${PLUGIN_ID}/page-views`);
                setDataViews(responseViews.data)


            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [get]);


    const chartData = {
        datasets: [{
            label: 'New Users',
            data: data ? data.data.map(c => c.count) : [],

            borderWidth: 1,
        },
        {
            label: 'Page Views',
            data: dataViews ? dataViews.data.map(c => c.count) : [],

            borderWidth: 1,
        }],

        labels: data ? data.data.map(c => c.day) : [],
    }

    return (
        <ChartComponent data={chartData} title="New Users" />
    );
}