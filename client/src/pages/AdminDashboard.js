import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Tab,
  Tabs,
  IconButton,
  MenuItem,
  Switch,
  Alert,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import { auth, rtdb } from '../config/firebase';
import { ref, get, set, remove, push } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { formatPrice } from '../utils/formatPrice';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
  height: '30vh',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}));

const FormContainer = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2)
}));

const TopBar = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  right: 0,
  padding: theme.spacing(2),
  zIndex: 1100,
  display: 'flex',
  justifyContent: 'flex-end'
}));

const LogoutButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: 'white',
  color: 'black',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  }
}));

const TableWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2)
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '500px',
    maxWidth: '90%',
    borderRadius: '12px',
    padding: theme.spacing(2)
  }
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
  fontSize: '1.5rem'
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  '& .MuiTextField-root': {
    marginBottom: theme.spacing(2)
  }
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderTop: `1px solid ${theme.palette.divider}`,
  gap: theme.spacing(2)
}));

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    startingPrice: '',
    auctionDate: '',
    category: '',
  });

  useEffect(() => {
    fetchItems();
    fetchUsers();
  }, []);

  const fetchItems = async () => {
    try {
      const itemsRef = ref(rtdb, 'items');
      const snapshot = await get(itemsRef);
      const itemsList = [];
      snapshot.forEach((child) => {
        itemsList.push({ id: child.key, ...child.val() });
      });
      setItems(itemsList);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersRef = ref(rtdb, 'users');
      const snapshot = await get(usersRef);
      const usersList = [];
      snapshot.forEach((child) => {
        usersList.push({ id: child.key, ...child.val() });
      });
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddItem = async () => {
    try {
      setLoading(true);
      
      const itemsRef = ref(rtdb, 'items');
      const newItemRef = push(itemsRef);
      await set(newItemRef, {
        ...newItem,
        currentPrice: parseFloat(newItem.startingPrice),
        status: 'upcoming',
        createdAt: new Date().toISOString(),
      });

      setOpen(false);
      fetchItems();
      setNewItem({
        title: '',
        description: '',
        startingPrice: '',
        auctionDate: '',
        category: '',
      });
      setNotification({
        open: true,
        message: 'Item added successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Error adding item:', error);
      setNotification({
        open: true,
        message: 'Error adding item',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendAuction = async (itemId) => {
    try {
      await set(ref(rtdb, `items/${itemId}/status`), 'suspended');
      fetchItems();
      setNotification({
        open: true,
        message: 'Auction suspended successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Error suspending auction:', error);
      setNotification({
        open: true,
        message: 'Error suspending auction',
        type: 'error'
      });
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await set(ref(rtdb, `users/${userId}/suspended`), !currentStatus);
      fetchUsers();
      setNotification({
        open: true,
        message: `User ${currentStatus ? 'activated' : 'suspended'} successfully`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      setNotification({
        open: true,
        message: 'Error updating user status',
        type: 'error'
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await remove(ref(rtdb, `items/${itemId}`));
      fetchItems();
      setNotification({
        open: true,
        message: 'Item deleted successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      setNotification({
        open: true,
        message: 'Error deleting item',
        type: 'error'
      });
    }
  };

  return (
    <>
      <LogoutButton 
        variant="outlined"
        onClick={handleLogout}
      >
        Logout
      </LogoutButton>

      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Admin Dashboard
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Auction Items" />
              <Tab label="Users" />
              <Tab label="Feedbacks" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Button
              variant="contained"
              color="primary"
              sx={{ mb: 3 }}
              onClick={() => setOpen(true)}
            >
              Add New Item
            </Button>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Starting Price</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{formatPrice(item.startingPrice)}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleSuspendAuction(item.id)}>
                          <BlockIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteItem(item.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Typography
                          sx={{ 
                            color: user.suspended ? 'error.main' : 'success.main'
                          }}
                        >
                          {user.suspended ? 'Suspended' : 'Active'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          onClick={() => handleToggleUserStatus(user.id, user.suspended)}
                          color={user.suspended ? 'success' : 'error'}
                          title={user.suspended ? 'Activate User' : 'Suspend User'}
                        >
                          <BlockIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Feedback Settings
            </Typography>
            {/* Add feedback settings here */}
          </TabPanel>
        </Box>
      </Container>

      {/* Add Item Dialog */}
      <StyledDialog open={open} onClose={() => setOpen(false)}>
        <StyledDialogTitle>
          Add New Auction Item
        </StyledDialogTitle>
        <StyledDialogContent>
          <FormContainer>
            <TextField
              label="Title"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              fullWidth
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 1 }
              }}
            />
            <TextField
              label="Description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 1 }
              }}
            />
            <TextField
              label="Starting Price"
              type="number"
              value={newItem.startingPrice}
              onChange={(e) => setNewItem({ ...newItem, startingPrice: e.target.value })}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <span style={{ marginRight: 8 }}>₹</span>,
                sx: { borderRadius: 1 }
              }}
            />
            <TextField
              label="Category"
              select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              fullWidth
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 1 }
              }}
            >
              <MenuItem value="art">Art & Collectibles</MenuItem>
              <MenuItem value="jewelry">Jewelry & Watches</MenuItem>
              <MenuItem value="vehicles">Vehicles & Automobiles</MenuItem>
              <MenuItem value="real-estate">Real Estate & Properties</MenuItem>
            </TextField>
            <TextField
              label="Auction Date"
              type="datetime-local"
              value={newItem.auctionDate}
              onChange={(e) => setNewItem({ ...newItem, auctionDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 1 }
              }}
            />
          </FormContainer>
        </StyledDialogContent>
        <StyledDialogActions>
          <Button 
            onClick={() => setOpen(false)} 
            variant="outlined"
            color="secondary"
            sx={{ 
              borderRadius: 1.5,
              px: 2.5
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddItem} 
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ 
              borderRadius: 1.5,
              px: 2.5
            }}
          >
            {loading ? 'Adding...' : 'Add Item'}
          </Button>
        </StyledDialogActions>
      </StyledDialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.type} onClose={() => setNotification({ ...notification, open: false })}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default AdminDashboard; 
