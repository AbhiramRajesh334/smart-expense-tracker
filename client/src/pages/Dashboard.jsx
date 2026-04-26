import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

const API_URL = 'http://localhost:5000/api/expenses';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: Number(amount), category, date, note }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to add expense');

      setAmount('');
      setCategory('');
      setDate('');
      setNote('');
      
      await fetchExpenses();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete expense');
      }

      await fetchExpenses();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Computations
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const categoryBreakdown = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  let topCategory = 'N/A';
  let topCategoryPercentage = 0;
  if (totalExpenses > 0) {
    const sortedCategories = Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1]);
    if (sortedCategories.length > 0) {
      topCategory = sortedCategories[0][0];
      topCategoryPercentage = Math.round((sortedCategories[0][1] / totalExpenses) * 100);
    }
  }

  const lastExpense = expenses.length > 0 ? expenses[0] : null;

  const filteredExpenses = expenses.filter(exp => 
    exp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (exp.note && exp.note.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getCategoryBadgeClass = (cat) => {
    const lowerCat = cat.toLowerCase();
    if (lowerCat.includes('food')) return 'category-badge cat-food';
    if (lowerCat.includes('transport')) return 'category-badge cat-transport';
    if (lowerCat.includes('shop')) return 'category-badge cat-shopping';
    if (lowerCat.includes('entertain')) return 'category-badge cat-entertainment';
    if (lowerCat.includes('utilit')) return 'category-badge cat-utilities';
    return 'category-badge cat-default';
  };

  return (
    <Layout title="Dashboard" subtitle="Manage your expenses">
      {error && <div className="error-message">{error}</div>}

      {/* Top Stats Grid */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon icon-purple">💳</div>
          <div className="stat-info">
            <p>Total Expenses</p>
            <h3>₹{totalExpenses.toLocaleString()}</h3>
            <span className="stat-subtitle">This Month <span className="badge-purple">↑ 12.5%</span></span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon icon-green">💵</div>
          <div className="stat-info">
            <p>Total Transactions</p>
            <h3>{expenses.length}</h3>
            <span className="stat-subtitle">This Month <span className="badge-green">↑ 8.3%</span></span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-orange">🥧</div>
          <div className="stat-info">
            <p>Top Category</p>
            <h3>{topCategory}</h3>
            <span className="stat-subtitle">{topCategoryPercentage}% of total</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-blue">📅</div>
          <div className="stat-info">
            <p>Last Expense</p>
            <h3>{lastExpense ? new Date(lastExpense.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : 'N/A'}</h3>
            <span className="stat-subtitle">{lastExpense ? `₹${lastExpense.amount}` : '-'}</span>
          </div>
        </div>
      </section>

      {/* Two Column Layout */}
      <section className="content-grid">
        {/* Add Expense Form */}
        <div className="card">
          <div className="card-header">
            <h3><span>⊕</span> Add New Expense</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select 
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled>Select category</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Note (Optional)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter a note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Expense'}
            </button>
          </form>
        </div>

        {/* Your Expenses Table */}
        <div className="card">
          <div className="card-header">
            <h3><span>⊜</span> Your Expenses</h3>
            <input 
              type="text" 
              className="search-input" 
              placeholder="🔍 Search expenses..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="table-container">
            {isFetching ? (
              <p style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading expenses...</p>
            ) : filteredExpenses.length === 0 ? (
              <p style={{ padding: '20px', color: 'var(--text-secondary)' }}>No expenses found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Note</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense) => (
                    <tr key={expense._id}>
                      <td>{new Date(expense.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td>
                        <span className={getCategoryBadgeClass(expense.category)}>
                          {expense.category}
                        </span>
                      </td>
                      <td>{expense.note || '-'}</td>
                      <td>₹{expense.amount}</td>
                      <td>
                        <button 
                          className="btn-delete" 
                          onClick={() => handleDelete(expense._id)}
                          disabled={isSubmitting}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

      <footer className="footer">
        © 2025 SpendWise. All rights reserved.
      </footer>
    </Layout>
  );
};

export default Dashboard;
