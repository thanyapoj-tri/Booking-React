import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './App.css'

function Table() {
    const [data, setData] = useState([])
    const [name, setName] = useState('')
    const [machine, setMachine] = useState('')

    useEffect(()=>{
        axios.get('http://localhost:3000/users')
        .then(res => setData(res.data))
        .catch(er => console.log(er));
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3000/users', {name: name, machine: machine})
        .then(res => {location.reload()})
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
                            <button >edit</button>
                            <button>delete</button>
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