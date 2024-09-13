import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import './Read.css'

function Read() {
  // const ip = '10.12.3.100';
  const ip = '10.12.1.71';
  const [data, setData] = useState([])
  const {id} = useParams();
  const naviagte = useNavigate();

  useEffect(()=>{
        axios.get(`http://${ip}:3000/users/` + id)
        .then(res => setData(res.data))
        .catch(er => console.log(er));
  }, [])


  const handleDelete = (id) => {
      
      axios.delete(`http://${ip}:3000/users/` + id)
        .then(() => {
          // location.reload();
          console.log('user returned');
          
          //wrn data != pendingData
          if (data && Array.isArray(data.machinenumber)) {
            data.machinenumber.forEach(machine => handleAddMachine(machine));
          }else {
            console.log('machinenumber is undefined or not an array');
          }
          window.alert("user returned");
          naviagte('/');
        })
      .catch(er => console.log(er));
  }

  const handleAddMachine = (machine) => {
    console.log(machine);
    axios.post(`http://${ip}:3000/machines`, { value: machine.value, id: machine.id })
      .then(res => {
        console.log(`Added machine with value: ${machine.value} and id: ${machine.id}`);
      })
      .catch(er => console.log(er));
  }

  return (
    <div className='readBox'>
      <div className='card'>
        <div className='readForm'>
        <img src="https://mahidol.ac.th/temp/2019/06/logo-MU_Color.png" alt="Logo" />
        <div className='readTitle'>
        <h2>รายละเอียดการใช้บริการเทคโนโลยีสารสนเทศด้านโสตทัศนูปกรณ์</h2>
        <h4>คณะสังคมศาสตร์และมนุษยศาสตร์ มหาวิทยาลัยมหิดล</h4>
        </div>
        </div>
        <h3>ชื่อผู้ยืม</h3>
        <div className='mbOne'>
          <strong>ชื่อ-นามสกุล: {data.name}</strong>
        </div>
        <div className='mbOne'>
          <strong>ประเภทบุคคล: {data.identity}</strong>
        </div>
        <div className='mbOne'>
          <strong>หน่วยงาน/ภาควิชา: {data.department}</strong>
        </div>
        <div className='mbOne'>
          <strong>โทร: {data.tel}</strong>
        </div>
        <h3>อุปกรณ์โสต</h3>
        <div className='mbOne'>
          <strong>Notebook: {data.machine} เครื่อง</strong>
        </div>
        <div className='mbOne'>
          <strong>เลขเครื่อง: {Array.isArray(data.machinenumber) && data.machinenumber.length > 0 ? data.machinenumber.map(machine => machine.label).join(', ') : 'ไม่มีข้อมูล'}</strong>
        </div>
        <div className='mbOne'>
          <strong>เครื่องเสียง: {data.stereo} เครื่อง</strong>
        </div>
        <div className='mbOne'>
          <strong>เครื่องไมโครโฟนชนิดไร้สาย: {data.wirelessmic} เครื่อง</strong>
        </div>
        <div className='mbOne'>
          <strong>เครื่องบันทึกเสียง: {data.voicerec} เครื่อง</strong>
        </div>
        <h3>ความประสงค์,เวลา,สภานที่</h3>
        <div className='mbOne'>
          <strong>วัตถุประสงค์เพื่อ: {data.objective}</strong>
        </div>
        <div className='mbOne'>
          <strong>วันที่: {data.startdate}</strong>
        </div>
        <div className='mbOne'>
          <strong>ถึง วันที่: {data.enddate}</strong>
        </div>
        <div className='mbOne'>
          <strong>สถานที่: {data.location}</strong>
        </div>
        <h3>ผู้รับทราบการยืม</h3>
        <div className='mbOne'>
          <strong>ชื่อเจ้าหน้าที่: {data.approvedBy}</strong>
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
