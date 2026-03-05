import { Main } from "@strapi/design-system";
import ViewLineChart from "../components/charts/ViewLineChart";
import PagesBarChart from "../components/charts/PagesBarChart";
import ReffererBarChart from "../components/charts/ReffererBarChart";
import PagesViewTable from "../components/charts/PageViewTable";
import PieChart from "../components/PieChart";
import RealTimeChart from "../components/charts/RealTimeChart";


const HomePage = () => {

  return (
    <Main>
      <div className="container" style={{ margin: '1rem 3rem' }}>
        <h1 className="title" style={{ fontWeight: 'bolder', fontSize: '4rem', marginLeft: '2rem' }}>Analytics</h1>

        {/* 2x2 Responsive Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '14rem',
          width: '86%',
          margin: '4rem auto 8rem auto',
        }}
          className="charts-grid"
        >
          <div style={{ width: '100%', minHeight: '350px', maxHeight: '450px', height: '100%' }}>
            <RealTimeChart />
          </div>

          <div style={{ minHeight: '350px', maxHeight: '450px', height: '100%', marginBottom: '6rem' }}>
            <ViewLineChart />
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
            margin: 0rem auto !important;
            
          }

          h1.title {
            display: none;
          }

          .charts-grid {
            width: 92% !important;
            gap: 2rem !important;
            margin: auto !important;
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