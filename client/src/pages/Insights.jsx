import Layout from '../components/Layout';

const Insights = () => {
  return (
    <Layout title="AI Insights" subtitle="Intelligent expense recommendations">
      <div className="card">
        <div className="card-header" style={{ marginBottom: '16px' }}>
          <h3><span>💡</span> Smart Tips</h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          Your intelligent expense insights will appear here soon. Add more data to get personalized financial advice!
        </p>
      </div>
    </Layout>
  );
};

export default Insights;
