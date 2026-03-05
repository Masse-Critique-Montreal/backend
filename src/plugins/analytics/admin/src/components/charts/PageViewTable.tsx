

import { useFetchClient } from "@strapi/strapi/admin";
import { useEffect, useState } from "react";
import { PLUGIN_ID } from "../../pluginId";
import { Table, Thead, Tr, Th, Td, Tbody } from "@strapi/design-system";

function PageViewRow({ view }: { view: any }) {
    return (
      <Tr style={{ fontSize: '1.4rem' }}>
        <Td>{view.url.split('?')[0]}</Td>
        <Td>{view.params ? (view.params.length > 24 ? `${view.params.slice(0,24)}...` : view.params) : '—'}</Td>
        <Td>{view.referrer || '—'}</Td>
        <Td>{view.session_id}</Td>
        <Td>{view.bottom ? 'Yes' : 'No'}</Td>
        <Td>{view.first_visit ? 'Yes' : 'No'}</Td>
        <Td>{new Date(view.created_at).toLocaleString()}</Td>
      </Tr>
    )
  }
  
  function PageViewTable({ views }: { views: any[] }) {
    return (
      <Table >
        {views.length > 0 && (
          <>
            <Thead>
              <Tr>
                <Th>URL</Th>
                <Th>Params</Th>
                <Th>Referrer</Th>
                <Th>Session ID</Th>
                <Th>Seen bottom</Th>
                <Th>First Visit</Th>
                <Th>Visited At</Th>
              </Tr>
            </Thead>
            <Tbody>
              {views.map((view, i) => (
                <PageViewRow key={i} view={view} />
              ))}
            </Tbody>
          </>
        )}
      </Table>
    )
  }

export default function PagesViewTable() {

    const [pageViews, setPageViews] = useState<{data:any[]}>();
    const { get } = useFetchClient();

    useEffect(() => {
        const fetchData = async () => {
            try {

                const responseViewsMeta = await get(`/${PLUGIN_ID}/page-views-meta`);
                setPageViews(responseViewsMeta.data)
        
        

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [get]);


    return (
        <>
            <h1 style={{ fontWeight: 'bolder', fontSize: '3rem', margin: '2rem 0rem' }}>Page Views (Last 50 views)</h1>
            {pageViews && <PageViewTable views={pageViews.data} />}


        </>
    );
}