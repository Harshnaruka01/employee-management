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
  const [firestoreAvailable, setFirestoreAvailable] = useState(false)

  const loadLocalEmployees = () => {
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
  }

  useEffect(() => {
    let unsubscribe = null

    if (isFirebaseConfigured && db) {
      const employeesRef = collection(db, 'employees')
      getDocs(employeesRef)
        .then((snapshot) => {
          const records = snapshot.docs.map((doc) => doc.data())
          setEmployees(records)
          setFirestoreAvailable(true)
          setLoading(false)

          unsubscribe = onSnapshot(
            query(employeesRef, orderBy('id')),
            (liveSnapshot) => {
              const liveRecords = liveSnapshot.docs.map((doc) => doc.data())
              setEmployees(liveRecords)
            },
            (error) => {
              console.error('Error listening to Firestore employees:', error)
              setFirestoreAvailable(false)
              loadLocalEmployees()
            }
          )
        })
        .catch((error) => {
          console.error('Error loading employees from Firestore:', error)
          setFirestoreAvailable(false)
          loadLocalEmployees()
        })

      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe()
        }
      }
    }

    loadLocalEmployees()
  }, [])

  useEffect(() => {
    if (!loading && !firestoreAvailable) {
      localStorage.setItem('employees', JSON.stringify(employees))
    }
  }, [employees, loading, firestoreAvailable])

  const addEmployee = async (employee) => {
    const { name, contact } = employee
    const newEmployee = { name, contact, id: Date.now() }
    if (firestoreAvailable && db) {
      try {
        await addDoc(collection(db, 'employees'), newEmployee)
      } catch (error) {
        console.error('Error adding employee to Firestore:', error)
        setFirestoreAvailable(false)
        setEmployees((prev) => [...prev, newEmployee])
      }
    } else {
      setEmployees((prev) => [...prev, newEmployee])
    }
  }

  const updateEmployee = async (id, updatedEmployee) => {
    if (firestoreAvailable && db) {
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
        setFirestoreAvailable(false)
        const { name, contact } = updatedEmployee
        setEmployees((prev) => prev.map((emp) => (emp.id === id ? { ...emp, name, contact } : emp)))
      }
    } else {
      const { name, contact } = updatedEmployee
      setEmployees((prev) => prev.map((emp) => (emp.id === id ? { ...emp, name, contact } : emp)))
    }
  }

  const deleteEmployee = async (id) => {
    if (firestoreAvailable && db) {
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
        setFirestoreAvailable(false)
        setEmployees((prev) => prev.filter((emp) => emp.id !== id))
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
