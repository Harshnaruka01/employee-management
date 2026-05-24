import { createContext, useContext, useState, useEffect } from 'react'
import { db, isFirebaseConfigured } from '../firebase/firebase.js'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  where,
  getDocs,
  doc
} from 'firebase/firestore'

const EmployeeContext = createContext()

export function EmployeeProvider({ children }) {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isFirebaseConfigured && db) {
      const employeesQuery = query(collection(db, 'employees'), orderBy('id'))
      const unsubscribe = onSnapshot(
        employeesQuery,
        (snapshot) => {
          const records = snapshot.docs.map((doc) => doc.data())
          setEmployees(records)
          setLoading(false)
        },
        (error) => {
          console.error('Error loading employees from Firestore:', error)
          setLoading(false)
        }
      )
      return unsubscribe
    }

    const savedEmployees = localStorage.getItem('employees')
    if (savedEmployees) {
      try {
        const parsedEmployees = JSON.parse(savedEmployees)
        if (Array.isArray(parsedEmployees) && parsedEmployees.length > 0) {
          setEmployees(parsedEmployees.map(({ id, name, contact }) => ({ id, name, contact })))
        } else {
          setEmployees([
            { id: 1, name: 'John Doe', contact: '1234567890' },
            { id: 2, name: 'Jane Smith', contact: '9876543210' },
          ])
        }
      } catch (error) {
        console.error('Error parsing employees from localStorage:', error)
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
    if (!loading && !isFirebaseConfigured) {
      localStorage.setItem('employees', JSON.stringify(employees))
    }
  }, [employees, loading])

  const addEmployee = async (employee) => {
    const { name, contact } = employee
    const newEmployee = { name, contact, id: Date.now() }
    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, 'employees'), newEmployee)
      } catch (error) {
        console.error('Error adding employee to Firestore:', error)
      }
    } else {
      setEmployees((prev) => [...prev, newEmployee])
    }
  }

  const updateEmployee = async (id, updatedEmployee) => {
    if (isFirebaseConfigured && db) {
      try {
        const employeesQuery = query(collection(db, 'employees'), where('id', '==', id))
        const snapshot = await getDocs(employeesQuery)
        const updatePromises = snapshot.docs.map((docSnapshot) => {
          const docRef = doc(db, 'employees', docSnapshot.id)
          return updateDoc(docRef, { ...updatedEmployee, id })
        })
        await Promise.all(updatePromises)
      } catch (error) {
        console.error('Error updating employee in Firestore:', error)
      }
    } else {
      const { name, contact } = updatedEmployee
      setEmployees((prev) => prev.map((emp) => (emp.id === id ? { ...emp, name, contact } : emp)))
    }
  }

  const deleteEmployee = async (id) => {
    if (isFirebaseConfigured && db) {
      try {
        const employeesQuery = query(collection(db, 'employees'), where('id', '==', id))
        const snapshot = await getDocs(employeesQuery)
        const deletePromises = snapshot.docs.map((docSnapshot) => {
          const docRef = doc(db, 'employees', docSnapshot.id)
          return deleteDoc(docRef)
        })
        await Promise.all(deletePromises)
      } catch (error) {
        console.error('Error deleting employee from Firestore:', error)
      }
    } else {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id))
    }
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
