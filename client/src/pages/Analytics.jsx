import { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Tooltip, Legend, 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer 
} from 'recharts';
import Layout from '../components/Layout';

const API_URL = 'http://localhost:5000/api/expenses';

const Analytics = () => {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  const fetchExpenses = async () => {
    setIsFetching(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch expenses');
      
      setExpenses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // --- EXISTING LOGIC ---
  const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const categoryBreakdown = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const pieChartData = Object.entries(categoryBreakdown).map(([name, value]) => ({
    name,
    value,
  }));

  const getCategoryBadgeClass = (cat) => {
    const lowerCat = cat.toLowerCase();
    if (lowerCat.includes('food')) return 'category-badge cat-food';
    if (lowerCat.includes('transport')) return 'category-badge cat-transport';
    if (lowerCat.includes('shop')) return 'category-badge cat-shopping';
    if (lowerCat.includes('entertain')) return 'category-badge cat-entertainment';
    if (lowerCat.includes('utilit')) return 'category-badge cat-utilities';
    return 'category-badge cat-default';
  };

  // --- NEW LOGIC: DAILY ---
  const today = new Date();
  const dailyExpenses = expenses.filter(exp => {
    return new Date(exp.date).toDateString() === today.toDateString();
  });

  const dailyBreakdown = dailyExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const dailyChartData = Object.entries(dailyBreakdown).map(([name, amount]) => ({
    name,
    amount,
  }));

  // --- NEW LOGIC: WEEKLY (Current Month) ---
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const monthlyExpenses = expenses.filter(exp => {
    const d = new Date(exp.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  const getWeeksData = () => {
    const weeks = [];
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    let currentWeek = [];
    
    for (let i = 1; i <= daysInMonth; i++) {
      const daySum = monthlyExpenses
        .filter(exp => new Date(exp.date).getDate() === i)
        .reduce((sum, exp) => sum + exp.amount, 0);
        
      currentWeek.push({ day: `${i}${getOrdinal(i)}`, amount: daySum });
      
      if (currentWeek.length === 7 || i === daysInMonth) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    }
    return weeks;
  };
  
  const weeklyChartsData = getWeeksData();

  // --- NEW LOGIC: MONTHLY (Last 3 Months) ---
  const getLast3MonthsData = () => {
    const data = [];
    for (let i = 2; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthLabel = d.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      const sum = expenses
        .filter(exp => {
          const expDate = new Date(exp.date);
          return expDate.getMonth() === d.getMonth() && expDate.getFullYear() === d.getFullYear();
        })
        .reduce((s, e) => s + e.amount, 0);
        
      data.push({ name: monthLabel, amount: sum });
    }
    return data;
  };
  
  const monthlyChartData = getLast3MonthsData();

  const dailyTotal = dailyChartData.reduce((sum, item) => sum + item.amount, 0);
  const currentMonthTotal = monthlyExpenses.reduce((sum, item) => sum + item.amount, 0);
  const last3MonthsTotal = monthlyChartData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Layout title="Analytics" subtitle="Analyze your spending patterns">
      {error && <div className="error-message">{error}</div>}

      {isFetching ? (
        <p style={{ color: 'var(--text-secondary)' }}>Loading analytics...</p>
      ) : (
        <>
          {/* Existing Overview Section */}
          <section className="card" style={{ marginBottom: '24px' }}>
            <div className="card-header" style={{ marginBottom: '16px' }}>
              <h3><span>📊</span> Total Spending: ₹{totalSpending}</h3>
            </div>
            
            {expenses.length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', minWidth: '250px' }}>
                  <h4 style={{ margin: '0 0 16px 0', color: 'var(--text-secondary)' }}>Category Breakdown</h4>
                  <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                    {Object.entries(categoryBreakdown).map(([cat, amt]) => (
                      <li key={cat} style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                        <span className={getCategoryBadgeClass(cat)}>{cat}</span>
                        <strong style={{ fontSize: '14px' }}>₹{amt}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
                <PieChart width={300} height={250}>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: 'white' }} />
                  <Legend />
                </PieChart>
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No data to analyze. Add some expenses first!</p>
            )}
          </section>

          {/* New Time-Based Insights Sections */}
          {expenses.length > 0 && (
            <>
              {/* Daily Insights */}
              <section className="card" style={{ marginBottom: '24px' }}>
                <div className="card-header" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3><span>☀️</span> Daily Insights (Today)</h3>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Total: ₹{dailyTotal}</span>
                </div>
                {dailyChartData.length > 0 ? (
                  <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailyChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: 'white' }} />
                        <Bar dataKey="amount" fill="#4ade80" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-secondary)' }}>No expenses recorded for today.</p>
                )}
              </section>

              {/* Weekly Insights */}
              <section className="card" style={{ marginBottom: '24px' }}>
                <div className="card-header" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3><span>📅</span> Weekly Insights (Current Month)</h3>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Total: ₹{currentMonthTotal}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  {weeklyChartsData.map((weekData, index) => (
                    <div key={index} style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
                      <h4 style={{ margin: '0 0 16px 0', color: 'var(--text-secondary)', textAlign: 'center' }}>Week {index + 1}</h4>
                      <div style={{ height: '200px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={weekData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: 'white' }} />
                            <Line type="monotone" dataKey="amount" stroke="#818cf8" strokeWidth={3} dot={{ r: 4, fill: '#818cf8' }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Monthly Insights */}
              <section className="card">
                <div className="card-header" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3><span>📈</span> Monthly Insights (Last 3 Months)</h3>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Total: ₹{last3MonthsTotal}</span>
                </div>
                <div style={{ height: '300px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: 'white' }} />
                      <Bar dataKey="amount" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </>
          )}
        </>
      )}
    </Layout>
  );
};

export default Analytics;
