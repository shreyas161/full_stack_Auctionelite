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
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import { auth, rtdb } from '../config/firebase';
import { ref, get, set, remove, push } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

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
  backgroundColor: 'white',
  color: 'black',
  borderColor: 'black',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderColor: 'black'
  }
}));

const TableWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2)
}));

function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    startingPrice: '',
    auctionDate: '',
    category: '',
    images: []
  });

  useEffect(() => {
    fetchItems();
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

  const handleAddItem = async () => {
    try {
      const itemsRef = ref(rtdb, 'items');
      const newItemRef = push(itemsRef);
      await set(newItemRef, {
        ...newItem,
        currentPrice: parseFloat(newItem.startingPrice),
        status: 'upcoming',
        createdAt: new Date().toISOString()
      });
      setOpen(false);
      fetchItems();
      setNewItem({
        title: '',
        description: '',
        startingPrice: '',
        auctionDate: '',
        category: '',
        images: []
      });
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await remove(ref(rtdb, `items/${itemId}`));
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
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

  return (
    <>
      <TopBar>
        <LogoutButton
          variant="outlined"
          onClick={handleLogout}
        >
          Logout
        </LogoutButton>
      </TopBar>

      <Container>
        <Box sx={{ 
          mt: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <Typography variant="h4" gutterBottom align="center">
            Admin Dashboard
          </Typography>
          
          <StyledPaper>
            <TableWrapper>
              <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2 }}
                onClick={() => setOpen(true)}
              >
                Add New Item
              </Button>

              <TableContainer sx={{ maxHeight: 'calc(30vh - 100px)' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Starting Price</TableCell>
                      <TableCell>Auction Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>${item.startingPrice}</TableCell>
                        <TableCell>
                          {new Date(item.auctionDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{item.status}</TableCell>
                        <TableCell>
                          <Button
                            color="secondary"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TableWrapper>

            <Dialog open={open} onClose={() => setOpen(false)}>
              <DialogTitle>Add New Item</DialogTitle>
              <DialogContent>
                <FormContainer>
                  <TextField
                    label="Title"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    label="Description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    multiline
                    rows={4}
                    fullWidth
                  />
                  <TextField
                    label="Starting Price"
                    type="number"
                    value={newItem.startingPrice}
                    onChange={(e) => setNewItem({ ...newItem, startingPrice: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    label="Auction Date"
                    type="datetime-local"
                    value={newItem.auctionDate}
                    onChange={(e) => setNewItem({ ...newItem, auctionDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                  <TextField
                    label="Category"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    fullWidth
                  />
                </FormContainer>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpen(false)} color="secondary">
                  Cancel
                </Button>
                <Button onClick={handleAddItem} color="primary">
                  Add Item
                </Button>
              </DialogActions>
            </Dialog>
          </StyledPaper>
        </Box>
      </Container>
    </>
  );
}

export default AdminDashboard; 
