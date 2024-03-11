import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import './Read.css'

function Read() {

  const [data, setData] = useState([])
    const {id} = useParams();
    const naviagte = useNavigate();
    useEffect(()=>{
        axios.get('http://localhost:3000/users/' + id)
        .then(res => setData(res.data))
        .catch(er => console.log(er));
    }, [])


    const handleDelete = (id) => {
      
  axios.delete('http://localhost:3000/users/' + id)
      .then(res => {
          // location.reload();
          console.log('user returned');
          // handleAddMachine(selectedUserObj.machine);
          window.alert("user returned");
          naviagte('/');
      })
      .catch(er => console.log(er));
  }

  return (
    <div className='readBox'>
      <div className='card'>
        <h2>ลายละเอียดผู้ใช้งานอุปกรณ์โสต</h2>
        <h3>บุคลากร</h3>
        <div className='mb-2'>
          <strong>ชื่อผู้ยืม: {data.name}</strong>
        </div>
        <div className='mb-2'>
          <strong>ประเภทบุคคล: {data.identity}</strong>
        </div>
        <div className='mb-3'>
          <strong>หน่วยงาน/ภาควิชา: {data.department}</strong>
        </div>
        <div className='mb-3'>
          <strong>โทร: {data.tel}</strong>
        </div>
        <h3>อุปกรณ์โสต</h3>
        <div className='mb-3'>
          <strong>Notebook: {data.machine} เครื่อง</strong>
        </div>
        <div className='mb-3'>
          <strong>เครื่องเสียง: {data.stereo} เครื่อง</strong>
        </div>
        <div className='mb-3'>
          <strong>เครื่องไมโครโฟนชนิดไร้สาย: {data.wirelessmic} เครื่อง</strong>
        </div>
        <div className='mb-3'>
          <strong>เครื่องบันทึกเสียง: {data.voicerec} เครื่อง</strong>
        </div>
        <h3>ความประสงค์,เวลา,สภานที่</h3>
        <div className='mb-3'>
          <strong>วัตถุประสงค์เพื่อ: {data.objective}</strong>
        </div>
        <div className='mb-3'>
          <strong>วันที่: {data.startdate}</strong>
        </div>
        <div className='mb-3'>
          <strong>ถึง วันที่: {data.enddate}</strong>
        </div>
        <div className='mb-3'>
          <strong>สถานที่: {data.location}</strong>
        </div>
        <div>
        <Link to={`/`} className='button'>Back</Link>

        <button onClick={e => handleDelete(data.id)} className='btn-danger'>คืน</button>
        
        </div>
      </div>
    </div>
  )

  
}

export default Read
