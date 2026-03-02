import { Main } from "@strapi/design-system";
import ViewLineChart from "../components/charts/ViewLineChart";
import PagesBarChart from "../components/charts/PagesBarChart";
import ReffererBarChart from "../components/charts/ReffererBarChart";
import PagesViewTable from "../components/charts/PageViewTable";
import PieChart from "../components/PieChart";


const HomePage = () => {

  return (
    <Main>
      <div className="container" style={{ margin: '1rem 3rem' }}>
        <h1 className="title" style={{ fontWeight: 'bolder', fontSize: '4rem', marginLeft: '2rem' }}>Analytics</h1>

        {/* 2x2 Responsive Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8rem',
          width: '82%',
          margin: '4rem auto 0px auto'
        }}
          className="charts-grid"
        >
          <div style={{ width: '100%', minHeight: '350px', maxHeight: '450px', height: '100%' }}>
            <ViewLineChart />
          </div>

          <div style={{ minHeight: '350px', maxHeight: '450px', height: '100%' }}>
            <PieChart
              title="Traffic by Device"
              data={{
                labels: ['Mobile', 'Tablet', 'Desktop'],
                datasets: [{
                  data: [42, 28, 18],
                  backgroundColor: ['#3e99d7', '#5062d0', '#4042b9'],
                  borderWidth: 0
                }]
              }}
            />
          </div>

          <div style={{ minHeight: '350px', maxHeight: '450px', height: '100%' }}>

            <PagesBarChart />
          </div>

          <div style={{ minHeight: '350px', maxHeight: '450px', height: '100%' }}>

            <ReffererBarChart />
          </div>
        </div>

        <div style={{ width: '90%', margin: 'auto', marginTop: '6rem' }}>

          <PagesViewTable />
        </div>
      </div>

      {/* Inline responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .container {
            
            margin: 0rem !important;
            margin-right: 2rem !important;
          }

          h1.title {
            display: none;
          }

          .charts-grid {
            width: 100% !important;
            gap: 2rem !important;
            margin: 0px !important;
            grid-template-columns: 1fr !important;
          }

          .charts-grid > div {
            min-height: 45vh !important;
            width: 100%;
          }

          .charts-grid > div:first-child {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </Main>
  );
};

export { HomePage };