import { AppRouter } from './routes/AppRouter.jsx'
import { EmployeeProvider } from './context/EmployeeContext.jsx'
import { SalaryProvider } from './context/SalaryContext.jsx'

export default function App() {
  return (
    <EmployeeProvider>
      <SalaryProvider>
        <AppRouter />
      </SalaryProvider>
    </EmployeeProvider>
  )
}
