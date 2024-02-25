import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './App.css'

function Table() {
    const [data, setData] = useState([])
    const [name, setName] = useState('')
    const [machine, setMachine] = useState('')
    const [editID, setEditID] = useState(-1)

    useEffect(()=>{
        axios.get('http://localhost:3000/users')
        .then(res => setData(res.data))
        .catch(er => console.log(er));
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        // id = data.length + 1;
        axios.post('http://localhost:3000/users', {name: name, machine: machine})
        .then(res => {
            location.reload()
        })
        .catch(er => console.log(er));
    }
    const handleEdit = (id) => {
        
    }

    const handleDelte = (id) => {
        console.log(id);
        axios.delete('http://localhost:3000/users/'+id)
        .then(res => {
            location.reload();
            console.log('deleted lew');
        })
        .catch(er => console.log(er));
    }

  return (
    <div className='container'>
        <div className='form-div'>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='Enter Name' onChange={e => setName(e.target.value)}/>
                <input type="text" placeholder='Enter Machine' onChange={e => setMachine(e.target.value)}/>
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
            {
                data.map((user, index) => (
                    <tr key={index}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.machine}</td>
                        <td>
                            {/* <button onClick={() => handleEdit(user.id)}>edit</button> */}
                            <button onClick={() => handleDelte(user.id)}>return</button>
                        </td>
                    </tr>
                ))
            }
        </tbody>
      </table>
    </div>
  )
}

export default Table