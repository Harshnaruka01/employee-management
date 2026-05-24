import { useState } from 'react'
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItem, ListItemText, IconButton, Grid, Card, CardContent, InputLabel, MenuItem, FormControl, Select } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import PaidIcon from '@mui/icons-material/Paid'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useEmployees } from '../../context/EmployeeContext.jsx'
import { useSalaries } from '../../context/SalaryContext.jsx'

export function SalaryRecordsPage() {
  const { employees, loading: employeeLoading } = useEmployees()
  const { salaryRecords, addSalaryRecord, updateSalaryRecord, deleteSalaryRecord, getCurrentMonthExpense, getCurrentMonthOvertime } = useSalaries()

  // Debug logging
  console.log('Employees:', employees)
  console.log('Employee loading:', employeeLoading)
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ 
    employeeId: '', 
    baseSalary: '', 
    overtimeHours: '', 
    overtimeRate: '', 
    overtime: '', 
    month: '', 
    year: ''
  })
  const [filters, setFilters] = useState({
    employee: '',
    month: '',
    year: ''
  })

  const handleOpen = (record = null) => {
    setEditId(record ? record.id : null)
    if (record) {
      setForm({
        employeeId: record.employeeId.toString(),
        baseSalary: record.baseSalary.toString(),
        overtimeHours: record.overtimeHours?.toString() || '',
        overtimeRate: record.overtimeRate?.toString() || '25',
        overtime: record.overtime.toString(),
        month: record.month,
        year: record.year.toString()
      })
    } else {
      setForm({ 
        employeeId: '', 
        baseSalary: '', 
        overtimeHours: '', 
        overtimeRate: '25', 
        overtime: '', 
        month: new Date().toLocaleString('default', { month: 'long' }), 
        year: new Date().getFullYear().toString() 
      })
    }
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSave = () => {
    // Validation
    if (!form.employeeId) {
      alert('Please select an employee')
      return
    }
    if (!form.baseSalary || parseFloat(form.baseSalary) <= 0) {
      alert('Please enter a valid base salary')
      return
    }
    if (!form.month) {
      alert('Please select a month')
      return
    }
    if (!form.year) {
      alert('Please enter a year')
      return
    }

    const employee = employees.find(emp => emp.id === parseInt(form.employeeId))
    if (!employee) {
      alert('Selected employee not found')
      return
    }

    const overtimeHours = parseFloat(form.overtimeHours) || 0
    const overtimeRate = parseFloat(form.overtimeRate) || 25
    const calculatedOvertime = overtimeHours * overtimeRate
    const baseSalary = parseFloat(form.baseSalary) || 0
    const recordData = {
      ...form,
      baseSalary,
      overtimeHours,
      overtimeRate,
      overtime: calculatedOvertime,
      totalSalary: baseSalary + calculatedOvertime,
      employeeName: employee.name
    }

    if (editId) {
      updateSalaryRecord(editId, recordData)
    } else {
      addSalaryRecord(recordData)
    }
    setOpen(false)
  }

  const handleDelete = (id) => {
    deleteSalaryRecord(id)
  }

  const handleFilterChange = (field) => (e) => {
    setFilters(prev => ({ ...prev, [field]: e.target.value }))
  }

  const getFilteredRecords = () => {
    return salaryRecords.filter(record => {
      const matchesEmployee = !filters.employee || record.employeeName.toLowerCase().includes(filters.employee.toLowerCase())
      const matchesMonth = !filters.month || record.month === filters.month
      const matchesYear = !filters.year || record.year === filters.year
      return matchesEmployee && matchesMonth && matchesYear
    })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>Salary Records</Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {/* Test dropdown */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="test-select-label">Test</InputLabel>
            <Select
              labelId="test-select-label"
              value="test"
              label="Test"
              onChange={() => {}}
            >
              <MenuItem value="test">Test Option</MenuItem>
              <MenuItem value="test2">Test Option 2</MenuItem>
            </Select>
          </FormControl>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />} 
            onClick={() => window.location.reload()}
            disabled={employeeLoading}
          >
            Refresh
          </Button>
          <Button variant="contained" startIcon={<PaidIcon />} onClick={() => handleOpen()}>
            Add Salary Record
          </Button>
        </Box>
      </Box>

      {/* Filter Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Search Employee"
                value={filters.employee}
                onChange={handleFilterChange('employee')}
                placeholder="Type employee name..."
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="filter-month-label">Month</InputLabel>
                <Select
                  labelId="filter-month-label"
                  value={filters.month}
                  label="Month"
                  onChange={handleFilterChange('month')}
                >
                  <MenuItem value="">All Months</MenuItem>
                  {['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
                    <MenuItem key={month} value={month}>{month}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Year"
                value={filters.year}
                onChange={handleFilterChange('year')}
                placeholder="e.g., 2024"
                size="small"
                type="number"
              />
            </Grid>
          </Grid>
          {(filters.employee || filters.month || filters.year) && (
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={() => setFilters({ employee: '', month: '', year: '' })}
              >
                Clear Filters
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {getFilteredRecords().length > 0 ? (
        <List>
          {getFilteredRecords().map((record) => (
            <ListItem key={record.id} secondaryAction={
              <>
                <IconButton edge="end" aria-label="edit" onClick={() => handleOpen(record)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(record.id)}>
                  <DeleteIcon />
                </IconButton>
              </>
            }>
              <ListItemText 
                primary={`${record.employeeName} - ${record.month} ${record.year}`}
                secondary={
                  <>
                    Base: ${record.baseSalary.toLocaleString()} | 
                    Overtime: {record.overtimeHours || 0}h × ${record.overtimeRate || 25}/h = ${record.overtime.toLocaleString()} | 
                    <strong> Total: ${record.totalSalary.toLocaleString()}</strong>
                  </>
                } 
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            {salaryRecords.length === 0 
              ? 'No salary records found. Add your first salary record to get started.'
              : 'No salary records match your filters. Try adjusting your search criteria.'
            }
          </Typography>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Edit Salary Record' : 'Add Salary Record'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" disabled={employeeLoading} error={!employeeLoading && employees.length === 0}>
            <InputLabel id="employee-select-label">Employee</InputLabel>
            <Select
              labelId="employee-select-label"
              name="employeeId"
              value={form.employeeId}
              label="Employee"
              onChange={(e) => {
                console.log('Employee selected:', e.target.value);
                setForm({ ...form, employeeId: e.target.value });
              }}
            >
              <MenuItem value="">
                <em>Select Employee</em>
              </MenuItem>
              {employees.map((employee) => (
                <MenuItem key={employee.id} value={employee.id.toString()}>
                  {employee.name}
                </MenuItem>
              ))}
            </Select>
            {employeeLoading && <Typography variant="caption" color="text.secondary">Loading employees...</Typography>}
            {!employeeLoading && employees.length === 0 && <Typography variant="caption" color="error">No employees found</Typography>}
          </FormControl>
          <TextField
            margin="dense"
            name="baseSalary"
            label="Base Salary"
            type="number"
            fullWidth
            value={form.baseSalary}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="overtimeHours"
            label="Overtime Hours"
            type="number"
            fullWidth
            value={form.overtimeHours}
            onChange={handleChange}
            helperText="Number of overtime hours worked"
          />
          <TextField
            margin="dense"
            name="overtimeRate"
            label="Overtime Rate ($/hour)"
            type="number"
            fullWidth
            value={form.overtimeRate}
            onChange={handleChange}
            helperText={`Overtime pay: ${(parseFloat(form.overtimeHours) || 0) * (parseFloat(form.overtimeRate) || 25)}`}
          />
          
          <FormControl fullWidth margin="dense">
            <InputLabel id="month-select-label">Month</InputLabel>
            <Select
              labelId="month-select-label"
              name="month"
              value={form.month}
              label="Month"
              onChange={(e) => {
                console.log('Month selected:', e.target.value);
                setForm({ ...form, month: e.target.value });
              }}
            >
              <MenuItem value="">
                <em>Select Month</em>
              </MenuItem>
              {['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
                <MenuItem key={month} value={month}>{month}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="year"
            label="Year"
            type="number"
            fullWidth
            value={form.year}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
