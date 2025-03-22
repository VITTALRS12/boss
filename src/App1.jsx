import React, { useState, useEffect } from 'react';
import axios from 'axios';
 import './App.css'; 


const App1 = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [editUserId, setEditUserId] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users');
      console.log('Fetched Data:', response.data); 
      setData(response.data);
    } catch (error) { 
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createUser = async () => {
    try {
      await axios.post('http://localhost:5000/users', formData);
      fetchData(); 
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const editUser = async (id) => {
    try {
      await axios.put(`http://localhost:5000/users/${id}`, formData);
      fetchData(); 
      setEditUserId(null); 
    } catch (error) {
      console.error('Error editing user:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      fetchData();  
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editUserId !== null) {
      editUser(editUserId);
    } else {
      createUser();
    }
    setFormData({ name: '', email: '' }); 
  };

  const handleEdit = (id, name, email) => {
    setFormData({ name, email }); 
    setEditUserId(id); 
  };

  return ( 
    <>
      <div className='container mt-4'>
        <h2 className="title">{editUserId !== null ? 'Edit User' : 'Create User'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type='text' name='name' value={formData.name} onChange={handleChange} />
          </label>
          <label>
            Email:
            <input type='email' name='email' value={formData.email} onChange={handleChange} />
          </label>
          <button type='submit' className="button">{editUserId !== null ? 'Save' : 'Add User'}</button>
        </form>
      </div>
      <div className='container mt-4'>
        <h2 className="title">User List</h2>
        <table border={1} className='table-success'>
          <thead>
            <tr>
              <td>ID</td>
              <td>NAME</td>
              <td>EMAIL</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button onClick={() => handleEdit(user.id, user.name, user.email)} className="editButton">Edit</button>
                    <button onClick={() => deleteUser(user.id)} className="deleteButton">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No users available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default App1;
