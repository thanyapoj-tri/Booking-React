import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './App.css'

function Table() {
    const [data, setData] = useState([])
    const [machines, setMachines] = useState([]);
    const [name, setName] = useState('')
    const [machine, setMachine] = useState('') // Updated to hold a single value
    const [editID, setEditID] = useState(-1)

    useEffect(()=>{
        axios.get('http://localhost:3000/users')
        .then(res => setData(res.data || []))
        .catch(er => console.log(er));
    }, [])
    useEffect(()=>{
        axios.get('http://localhost:3000/machines')
        .then(res => setMachines(res.data || []))
        .catch(er => console.log(er));
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        const newMachine = machine;
        const selectedMachineObj = machines.find(machine => machine.value === newMachine);
        axios.post('http://localhost:3000/users', { name: name, machine: machine })
            .then(res => {
                // location.reload();       
                console.log('added user');
                console.log(`machine num. ${machine} has been borrow`);
                handleDeleteMachine(selectedMachineObj.id);
            })
            .catch(er => console.log(er));
    }
    const handleDeleteMachine = (machineId) => {
        console.log('http://localhost:3000/machines/'+machineId);
        axios.delete(`http://localhost:3000/machines/${machineId}`)
            .then(() => {
                console.log(`Deleted machine with id ${machineId} from machines array.`);
            })
            .catch(error => {
                console.error('Error deleting machine:', error);
            });
    }

    const handleEdit = (id) => {
        
    }

    const handleDelete = (id) => {
        console.log('http://localhost:3000/users/'+id)
        console.log(data.find(data => data.id === id))
        const selectedUserObj = data.find(data => data.id === id)
        axios.delete('http://localhost:3000/users/'+id)
        .then(res => {
            // location.reload();
            console.log('user returned');
            handleAddMachine(selectedUserObj.machine)
        })
        .catch(er => console.log(er));
    }
    const handleAddMachine = (machineValue) => {
        console.log(machineValue)
        axios.post('http://localhost:3000/machines', { value: machineValue })
            .then(res => {
                // location.reload();       
                console.log(`added ${machineValue} machine dropdown`);
            })
            .catch(er => console.log(er));
    }

    return (
        <div className='container'>
            <div className='form-div'>
            <form onSubmit={handleSubmit}>
                    <input type="text" placeholder='Enter Name' onChange={e => setName(e.target.value)}/>
                    <select value={machine} onChange={(e) => setMachine(e.target.value)}>
                        {machines && machines.length > 0 ? (
          machines.map(machine => (
            <option key={machine.id} value={machine.value}>
              {machine.value}
            </option>
          ))
        ) : (
          <option value="">Loading...</option>
        )}
                    </select>
                    <button>Add</button> 
                </form>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Machine</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((user, index) => (
                        <tr key={index}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.machine}</td>
                            <td>
                                <button onClick={() => handleDelete(user.id)}>return</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Table
