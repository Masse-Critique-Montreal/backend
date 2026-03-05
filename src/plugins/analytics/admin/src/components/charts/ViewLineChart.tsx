import { useFetchClient } from "@strapi/strapi/admin";
import ChartComponent from "../ChartComponent";
import { useEffect, useState } from "react";
import { PLUGIN_ID } from "../../pluginId";
import QueryString from "qs";
import { SingleSelect } from "@strapi/design-system";
import { SingleSelectOption } from "@strapi/design-system";
import { group } from "console";


export default function ViewLineChart() {

    const [frequency, setFrequency] = useState<'day'|'week'|'month'>('day');

    const [data, setData] = useState<{
        data: {
            count: number,
            day: string
        }[]
    }>();
    const [dataViews, setDataViews] = useState<{
        data: {
            count: number
        }[]
    }>();
    const [bottomViews, setBottomViews] = useState<{
        data: {
            count: number
        }[]
    }>();

    const { get, post } = useFetchClient();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // The URL is automatically prefixed with /plugin-name
                const response = await get(`/${PLUGIN_ID}/sessions?${QueryString.stringify({
                    groupBy: frequency
                })}`);
                setData(response.data);

                const responseViews = await get(`/${PLUGIN_ID}/page-views?${QueryString.stringify({
                    groupBy: frequency
                })}`);
                setDataViews(responseViews.data)
                console.log(responseViews.data)


                const responseBottomViews = await get(`/${PLUGIN_ID}/page-views?${QueryString.stringify({
                    where: { 'bottom': true },
                    groupBy: frequency
                })}`);
                console.log(responseBottomViews)
                setBottomViews(responseBottomViews.data)



            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };


        fetchData();
    }, [get, post, frequency]);

    
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
        },
        {
            label: 'Engaged Users',
            data: bottomViews ? bottomViews.data.map(c => c.count) : [],

            borderWidth: 1,
        }],

        labels: data ? data.data.map(c => c.day) : [],
    }

    return (
        <div style={{ minHeight: '350px', maxHeight: '450px', height: '100%', paddingBottom: '4rem', paddingTop: '4rem'}}>
            <div style={{display:'flex', justifyContent:'space-between', margin: '0 1.5rem 3rem 1.5rem '}}>
                <h3 style={{fontSize: '3rem', fontWeight: 'bold'}}>Views</h3>
                <SingleSelect label="frequency" placeholder="Select..." value={frequency} onChange={(value: string) => setFrequency(value as 'day'|'week'|'month')}>
                    <SingleSelectOption value="day">Day</SingleSelectOption>
                    <SingleSelectOption value="week">Week</SingleSelectOption>
                    <SingleSelectOption value="month">Month</SingleSelectOption>
                </SingleSelect>
            </div>

            <ChartComponent data={chartData} title="" />
        </div>
    );
}