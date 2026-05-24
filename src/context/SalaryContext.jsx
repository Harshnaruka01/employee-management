import { createContext, useContext, useState, useEffect } from 'react'

const SalaryContext = createContext()

export function SalaryProvider({ children }) {
  const [salaryRecords, setSalaryRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedRecords = localStorage.getItem('salaryRecords')
    if (savedRecords) {
      setSalaryRecords(JSON.parse(savedRecords))
    } else {
      setSalaryRecords([
        { id: 1, employeeId: 1, employeeName: 'John Doe', baseSalary: 5000, overtimeHours: 20, overtimeRate: 25, overtime: 500, deductions: 200, month: 'January', year: '2024', totalSalary: 5300 },
        { id: 2, employeeId: 2, employeeName: 'Jane Smith', baseSalary: 6000, overtimeHours: 12, overtimeRate: 25, overtime: 300, deductions: 150, month: 'January', year: '2024', totalSalary: 6150 },
      ])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('salaryRecords', JSON.stringify(salaryRecords))
    }
  }, [salaryRecords, loading])

  const addSalaryRecord = (record) => {
    setSalaryRecords(prev => [...prev, { ...record, id: Date.now() }])
  }

  const updateSalaryRecord = (id, updatedRecord) => {
    setSalaryRecords(prev => prev.map(record => record.id === id ? { ...record, ...updatedRecord } : record))
  }

  const deleteSalaryRecord = (id) => {
    setSalaryRecords(prev => prev.filter(record => record.id !== id))
  }

  const getCurrentMonthExpense = () => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' })
    const currentYear = new Date().getFullYear().toString()
    return salaryRecords
      .filter(record => record.month === currentMonth && record.year === currentYear)
      .reduce((sum, record) => sum + (record.totalSalary || 0), 0)
  }

  const getCurrentMonthOvertime = () => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' })
    const currentYear = new Date().getFullYear().toString()
    return salaryRecords
      .filter(record => record.month === currentMonth && record.year === currentYear)
      .reduce((sum, record) => sum + (record.overtime || 0), 0)
  }

  const value = {
    salaryRecords,
    loading,
    addSalaryRecord,
    updateSalaryRecord,
    deleteSalaryRecord,
    getCurrentMonthExpense,
    getCurrentMonthOvertime
  }

  return (
    <SalaryContext.Provider value={value}>
      {children}
    </SalaryContext.Provider>
  )
}

export function useSalaries() {
  const context = useContext(SalaryContext)
  if (!context) {
    throw new Error('useSalaries must be used within a SalaryProvider')
  }
  return context
}
