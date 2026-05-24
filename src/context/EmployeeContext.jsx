import { createContext, useContext, useState, useEffect } from 'react'

const EmployeeContext = createContext()

export function EmployeeProvider({ children }) {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedEmployees = localStorage.getItem('employees')
    if (savedEmployees) {
      try {
        const parsedEmployees = JSON.parse(savedEmployees)
        if (Array.isArray(parsedEmployees) && parsedEmployees.length > 0) {
          setEmployees(parsedEmployees.map(({id, name, contact}) => ({id, name, contact})) )
        } else {
          // Fallback if data is invalid
          setEmployees([
            { id: 1, name: 'John Doe', contact: '1234567890' },
            { id: 2, name: 'Jane Smith', contact: '9876543210' },
          ])
        }
      } catch (error) {
        console.error('Error parsing employees from localStorage:', error)
        // Fallback on error
        setEmployees([
          { id: 1, name: 'John Doe', contact: '1234567890' },
          { id: 2, name: 'Jane Smith', contact: '9876543210' },
        ])
      }
    } else {
      setEmployees([
        { id: 1, name: 'John Doe', contact: '1234567890' },
        { id: 2, name: 'Jane Smith', contact: '9876543210' },
      ])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('employees', JSON.stringify(employees))
    }
  }, [employees, loading])

  const addEmployee = (employee) => {
    const { name, contact } = employee
    setEmployees(prev => [...prev, { name, contact, id: Date.now() }])
  }

  const updateEmployee = (id, updatedEmployee) => {
    const { name, contact } = updatedEmployee
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, name, contact } : emp))
  }

  const deleteEmployee = (id) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id))
  }

  const getTotalEmployees = () => employees.length

  const value = {
    employees,
    loading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getTotalEmployees
  }

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  )
}

export function useEmployees() {
  const context = useContext(EmployeeContext)
  if (!context) {
    throw new Error('useEmployees must be used within an EmployeeProvider')
  }
  return context
}
