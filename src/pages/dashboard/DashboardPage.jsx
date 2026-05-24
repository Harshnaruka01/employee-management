import {
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { useEmployees } from '../../context/EmployeeContext.jsx'
import { useSalaries } from '../../context/SalaryContext.jsx'
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'

function StatCard({ title, value, icon }) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.5,
              display: 'grid',
              placeItems: 'center',
              bgcolor: (t) =>
                t.palette.mode === 'dark'
                  ? 'rgba(79, 70, 229, 0.18)'
                  : 'rgba(79, 70, 229, 0.10)',
              color: 'primary.main',
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.25 }}>
              {value}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export function DashboardPage() {
  const { getTotalEmployees, loading: employeeLoading } = useEmployees()
  const { getCurrentMonthExpense, getCurrentMonthOvertime, loading: salaryLoading } = useSalaries()

  const isLoading = employeeLoading || salaryLoading

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Dashboard
        </Typography>
        <Typography color="text.secondary">
          Overview of employees and monthly salary activity.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Employees"
            value={isLoading ? "—" : getTotalEmployees()}
            icon={<PeopleOutlinedIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monthly Salary Expense"
            value={isLoading ? "—" : `$${getCurrentMonthExpense().toLocaleString()}`}
            icon={<PaidOutlinedIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Overtime Payments"
            value={isLoading ? "—" : `$${getCurrentMonthOvertime().toLocaleString()}`}
            icon={<AccessTimeOutlinedIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Analytics"
            value="Coming Soon"
            icon={<TrendingUpOutlinedIcon />}
          />
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
            Recent Salary Records
          </Typography>
          <Typography color="text.secondary">
            Next: we’ll load this from Firestore and add charts + tables.
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  )
}

