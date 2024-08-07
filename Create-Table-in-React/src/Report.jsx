import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './Report.css'
import { Link } from 'react-router-dom'

function report() {
    // const ip = '10.12.3.100';
    const ip = '10.12.1.71';
    const [data, setData] = useState([])

    useEffect(()=>{
        axios.get(`http://${ip}:4000/usersreport`)
        .then(res => setData(res.data || []))
        .catch(er => console.log(er));
    }, [])

  return (
    <div>
      <h2>report</h2>
      <div className='reportContainer'>
                <table>
                    <thead>
                        <tr>
                            <th>ลำดับที่</th>
                            <th>ชื่อผู้ยืม</th>
                            <th>Notebook</th>
                            <th>เครื่องเสียง</th>
                            <th>เครื่องไมโครโฟน</th>
                            <th>เครื่องบันทึกเสียง</th>
                            <th>สถานะการยืม</th>
                            <th>เข้าสู่การคืน</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((user, index) => 
                            (
                            <tr key={index}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.machine} เครื่อง</td>
                                <td>{user.stereo} เครื่อง</td>
                                <td>{user.wirelessmic} เครื่อง</td>
                                <td>{user.voicerec} เครื่อง</td>
                                <td>{new Date(user.enddate) < new Date() ? 'เกินกำหนด' : 'อยู่ในกำหนดการยืม'}</td>
                                <td>
                                    <Link to={`/reportread/${user.id}`} >รายละเอียด</Link>
                                </td>
                            </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
            <div class="bottom-bar">
            <Link to={`/`} className='button'>กลับหน้าหลัก</Link>
            <p class="signature">Created by Thanyapoj v1.0</p>
            </div>
    </div>
  )
}

export default report
