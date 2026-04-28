import React, { useState, useMemo } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { employees } from '../../data/mockData';
import { IndianRupee, Receipt } from 'lucide-react';
import SearchableSelect from '../shared/SearchableSelect';
import DatePicker from '../shared/DatePicker';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b'];
const RUPEE = "\u20B9";

export default function AdminExpenseReport() {
  const { expenses } = useAppData();
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('overall');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const employeeOptions = useMemo(() => [
    { value: 'overall', label: 'Overall' },
    ...employees.map(e => ({ value: e.id, label: e.name })),
  ], []);

  const typeOptions = useMemo(() => [
    { value: '', label: 'All Types' },
    { value: 'travel', label: 'Travel' },
    { value: 'food', label: 'Food' },
    { value: 'other', label: 'Other' },
  ], []);

  const statusOptions = useMemo(() => [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ], []);

  const filtered = useMemo(() => {
    return expenses.filter(e => {
      if (fromDate) {
        const from = fromDate.toISOString().split('T')[0];
        if (e.appliedOn < from) return false;
      }
      if (toDate) {
        const to = toDate.toISOString().split('T')[0];
        if (e.appliedOn > to) return false;
      }
      if (selectedEmployee !== 'overall' && e.employeeId !== selectedEmployee) return false;
      if (selectedType && e.type !== selectedType) return false;
      if (selectedStatus && e.status !== selectedStatus) return false;
      return true;
    });
  }, [expenses, fromDate, toDate, selectedEmployee, selectedType, selectedStatus]);

  const statusColors: Record<string, string> = {
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
    pending: 'bg-amber-100 text-amber-700',
  };

  const totalAmount = filtered.reduce((sum, e) => sum + e.amount, 0);
  const approvedAmount = filtered.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0);
  const pendingAmount = filtered.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    filtered.forEach(e => {
      data[e.type] = (data[e.type] || 0) + e.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const employeeSpendData = useMemo(() => {
    const data: Record<string, number> = {};
    filtered.forEach(e => {
      data[e.employeeName] = (data[e.employeeName] || 0) + e.amount;
    });
    return Object.entries(data).map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [filtered]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">From Date</label>
            <DatePicker selected={fromDate} onChange={setFromDate} placeholderText="From date" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">To Date</label>
            <DatePicker selected={toDate} onChange={setToDate} placeholderText="To date" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Employee</label>
            <SearchableSelect
              options={employeeOptions}
              value={employeeOptions.find(o => o.value === selectedEmployee) || null}
              onChange={opt => setSelectedEmployee(opt?.value || 'overall')}
              placeholder="Select employee..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Type</label>
            <SearchableSelect
              options={typeOptions}
              value={typeOptions.find(o => o.value === selectedType) || null}
              onChange={opt => setSelectedType(opt?.value || '')}
              placeholder="All Types"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Status</label>
            <SearchableSelect
              options={statusOptions}
              value={statusOptions.find(o => o.value === selectedStatus) || null}
              onChange={opt => setSelectedStatus(opt?.value || '')}
              placeholder="All Status"
            />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800 mb-6">Spending by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${RUPEE}${value.toLocaleString()}`, "Amount"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800 mb-6">Top Spending Employees</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employeeSpendData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} width={100} />
                <Tooltip formatter={(value: number) => [`${RUPEE}${value.toLocaleString()}`, "Amount"]} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="amount" fill="#6366f1" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total Amount', value: totalAmount, color: 'bg-slate-50 text-slate-700' },
          { label: 'Approved', value: approvedAmount, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Pending', value: pendingAmount, color: 'bg-amber-50 text-amber-700' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-xl p-4 flex items-center gap-3`}>
            <IndianRupee className="w-5 h-5 opacity-50" />
            <div>
              <p className="text-xl font-bold">{RUPEE}{s.value.toLocaleString()}</p>
              <p className="text-xs font-medium mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Employee</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Description</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(exp => (
                <tr key={exp.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 text-sm text-slate-800">{exp.employeeName}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 capitalize hidden sm:table-cell">{exp.type}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{RUPEE}{exp.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 hidden md:table-cell max-w-[200px] truncate">{exp.description}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[exp.status]}`}>
                      {exp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-sm">No records found</div>
        )}
      </div>
    </div>
  );
}
