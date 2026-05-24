import { createContext, useContext, useState, useEffect } from 'react'

const SalaryContext = createContext()

export function SalaryProvider({ children }) {
  const [salaryRecords, setSalaryRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedRecords = localStorage.getItem('salaryRecords')
    if (savedRecords) {
      try {
        const parsed = JSON.parse(savedRecords)
        if (Array.isArray(parsed)) {
          // Normalize records to remove any legacy `deductions` and recompute totalSalary
          const normalized = parsed.map(r => {
            const baseSalary = parseFloat(r.baseSalary) || 0
            const overtime = typeof r.overtime === 'number' ? r.overtime : (parseFloat(r.overtime) || 0)
            const totalSalary = baseSalary + overtime
            return {
              id: r.id,
              employeeId: r.employeeId,
              employeeName: r.employeeName,
              baseSalary,
              overtimeHours: r.overtimeHours || 0,
              overtimeRate: r.overtimeRate || 25,
              overtime,
              month: r.month,
              year: r.year,
              totalSalary
            }
          })
          setSalaryRecords(normalized)
        } else {
          // Fallback default data
          setSalaryRecords([
            { id: 1, employeeId: 1, employeeName: 'John Doe', baseSalary: 5000, overtimeHours: 20, overtimeRate: 25, overtime: 500, month: 'January', year: '2024', totalSalary: 5500 },
            { id: 2, employeeId: 2, employeeName: 'Jane Smith', baseSalary: 6000, overtimeHours: 12, overtimeRate: 25, overtime: 300, month: 'January', year: '2024', totalSalary: 6300 },
          ])
        }
      } catch (e) {
        console.error('Error parsing salaryRecords:', e)
        setSalaryRecords([
          { id: 1, employeeId: 1, employeeName: 'John Doe', baseSalary: 5000, overtimeHours: 20, overtimeRate: 25, overtime: 500, month: 'January', year: '2024', totalSalary: 5500 },
          { id: 2, employeeId: 2, employeeName: 'Jane Smith', baseSalary: 6000, overtimeHours: 12, overtimeRate: 25, overtime: 300, month: 'January', year: '2024', totalSalary: 6300 },
        ])
      }
    } else {
      setSalaryRecords([
        { id: 1, employeeId: 1, employeeName: 'John Doe', baseSalary: 5000, overtimeHours: 20, overtimeRate: 25, overtime: 500, month: 'January', year: '2024', totalSalary: 5500 },
        { id: 2, employeeId: 2, employeeName: 'Jane Smith', baseSalary: 6000, overtimeHours: 12, overtimeRate: 25, overtime: 300, month: 'January', year: '2024', totalSalary: 6300 },
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
