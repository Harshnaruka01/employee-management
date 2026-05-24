import { useState } from 'react'
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItem, ListItemText, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useEmployees } from '../../context/EmployeeContext.jsx'

export function EmployeesPage() {
  const { employees, addEmployee, updateEmployee, deleteEmployee, loading } = useEmployees()
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ name: '', contact: '' })

  const handleOpen = (employee = null) => {
    setEditId(employee ? employee.id : null)
    if (employee) setForm({ name: employee.name, contact: employee.contact || '' })
    else setForm({ name: '', contact: '' })
    setOpen(true)
  }
  const handleClose = () => setOpen(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSave = () => {
    // Check for duplicate contact number
    const isDuplicate = employees.some(emp => emp.contact === form.contact && emp.id !== editId)
    if (isDuplicate) {
      alert('Contact number must be unique for each employee.')
      return
    }
    if (editId) {
      updateEmployee(editId, form)
    } else {
      addEmployee(form)
    }
    setOpen(false)
  }

  const handleDelete = (id) => {
    deleteEmployee(id)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>Employees</Typography>
        <Button variant="contained" onClick={() => handleOpen()}>Add Employee</Button>
      </Box>
      <List>
        {employees.map((emp) => (
          <ListItem key={emp.id} secondaryAction={
            <>
              <IconButton edge="end" aria-label="edit" onClick={() => handleOpen(emp)}><EditIcon /></IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(emp.id)}><DeleteIcon /></IconButton>
            </>
          }>
            <ListItemText primary={emp.name} secondary={`Contact: ${emp.contact || '-'}`} />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" name="name" label="Name" fullWidth value={form.name} onChange={handleChange} />
          <TextField margin="dense" name="contact" label="Contact No." fullWidth value={form.contact} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
