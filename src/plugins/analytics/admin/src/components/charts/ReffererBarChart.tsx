import { useFetchClient } from "@strapi/strapi/admin";
import { useEffect, useState } from "react";
import { PLUGIN_ID } from "../../pluginId";
import HorizontalBarChart from "../BarChart";


export default function ReffererBarChart() {

    const [refferers, setRefferers] = useState<{data:{
        refferer: string,
        count: number
    }[]}>();

    const { get } = useFetchClient();

    useEffect(() => {
        const fetchData = async () => {
            try {


                const responseViewsRefferer = await get(`/${PLUGIN_ID}/page-views-referrer`);
                setRefferers(responseViewsRefferer.data)

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [get]);


    const barChartRefferer = {
        labels: refferers ? refferers.data.map((view: any) => view.referrer || 'None') : [],
        datasets: [
          {
            label: "Views",
            data: refferers ? refferers.data.map((view: any) => view.count) : [],
            borderWidth: 1
          }
        ]
      }
    

    return (

        <HorizontalBarChart data={barChartRefferer} title="Views per Refferer" />
    );
}