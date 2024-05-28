import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './App.css'
import { Link } from 'react-router-dom'

function Table() {
    // const ip = 'localhost';
    const ip = '10.12.3.100';
    const [data, setData] = useState([])
    const [machines, setMachines] = useState([]);
    const [name, setName] = useState('')
    const [machine, setMachine] = useState('') // Updated to hold a single value
    const [editID, setEditID] = useState(-1)
    const [identity, setIdentity] = useState('')
    const [department, setDepartment] = useState('')
    const [tel, setTel] = useState('')
    const [stereo, setStereo] = useState('')
    const [wirelessmic, setWirelessmic] = useState('')
    const [voicerec, setVoicerec] = useState('')
    const [objective, setObjective] = useState('')
    const [startdate, setStartdate] = useState('')
    const [enddate, setEnddate] = useState('')
    const [location, setLocation] = useState('')
    const [report, setReport] = useState([]);

    useEffect(()=>{
        axios.get(`http://${ip}:3000/users`)
        // axios.get(`http://localhost:3000/users`)
        .then(res => {
            console.log("API response:", res.data); // Log the API response
            setData(res.data || []);
        })
        .catch(er => console.log(er));
    }, [])
    useEffect(()=>{
        axios.get(`http://${ip}:3000/machines`)
        // axios.get(`http://localhost:3000/machines`)
        .then(res => {
            const sortedMachines = res.data.sort((a, b) => a.value - b.value);
            setMachines(sortedMachines);
        })
        .catch(er => console.log(er));
    }, [])
    useEffect(()=>{
        axios.get(`http://${ip}:4000/usersreport`)
        .then(res => setReport(res.data))
        .catch(er => console.log(er));
    }, [])
    

    const handleSubmit = (event) => {
        event.preventDefault();
        const id = report.length + 1;
        axios.post(`http://${ip}:4000/users`
        , {id: 'IT-S002-'+id, name: name,identity: identity,department: department,tel: tel, machine: machine,stereo: stereo,wirelessmic: wirelessmic,voicerec: voicerec ,objective: objective,startdate: startdate,enddate: enddate ,location: location})
            .then(res => {    
                console.log('added user report');
            })
            .catch(er => console.log(er));
        const id2 = data.length + 1;
        axios.post(`http://${ip}:3000/users`, {id: 'q-'+id2+name, name: name,identity: identity,department: department,tel: tel, machine: machine,stereo: stereo,wirelessmic: wirelessmic,voicerec: voicerec ,objective: objective,startdate: startdate,enddate: enddate ,location: location})
            .then(res => {    
                console.log('added user');
                window.location.reload(true);
                console.log(`machine num. ${machine} has been borrow`);
                // handleDeleteMachine(selectedMachineObj.id);
            })
            .catch(er => console.log(er));
    }
    const handleDeleteMachine = (machineId) => {
        console.log(`http://${ip}:3000/machines/`+machineId);
        axios.delete(`http://${ip}:3000/machines/${machineId}`)
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
        window.location.reload(true);
    }

    const handleAddMachine = (machineValue) => {
        console.log(machineValue+'thisismachinevalue');
        axios.post(`http://${ip}:3000/machines`, { value: machineValue })
            .then(res => {
                location.reload();       
                console.log(`added ${machineValue} machine dropdown`);
                // After successfully adding the machine, update the 'machines' state
                // setMachines(prevMachines => {
                //     const updatedMachines = [...prevMachines, { "value": machineValue, "id": "NEW_ID" }];
                //     // Sort the machines array based on the 'value' property
                //     updatedMachines.sort((a, b) => a.value - b.value);
                //     return updatedMachines;
                // });
            })
            .catch(er => console.log(er));
    }
    

    return (
        <><div className='titleForm'>
            <img src="https://mahidol.ac.th/temp/2019/06/logo-MU_Color.png" alt="Logo" />
        <h1>แบบฟอร์มยืมคืนอุปกรณ์โสต</h1>
        <h2>คณะสังคมศาสตร์และมนุษยศาสตร์ มหาวิทยาลัยมหิดล</h2>
      </div>
      <div className='container'>
            <div className='form-div'>
                <form onSubmit={handleSubmit}>
                    <div>
                    <label className='lefttitleName'>
                        ชื่อ-นามสกุล <input type="text" placeholder='Enter Name' onChange={e => setName(e.target.value)} />
                        </label>
                        <label className='righttitleIdentity'>
                        ประเภทบุคคล <select value={identity} onChange={(e) => setIdentity(e.target.value)}>
                            <option value={null}>Please select an option...</option>
                            <option value="อาจารย์">อาจารย์</option>
                            <option value="บุคลากร">บุคลากร</option>
                            <option value="นักศึกษา">นักศึกษา</option>
                        </select>
                        </label>
                    </div>
                    <div>
                    <label className='lefttitleDepartment'>
                        หน่วยงาน/ภาควิชา <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                            <option value={null}>Please select an option...</option>
                            <option value="สังคม">ภาควิชาสังคมศาสตร์</option>
                            <option value="ศึกษา">ภาควิชาศึกษาศาสตร์</option>
                            <option value="สังคมและสุขภาพ">ภาควิชาสังคมและสุขภาพ</option>
                            <option value="มนุษย">ภาควิชามนุษยศาสตร์</option>
                            <option value="บริหารทั่วไป">งานบริหารทั่วไป</option>
                            <option value="คลังและสินทรัพย์">งานคลังและสินทรัพย์</option>
                            <option value="ยุทธศาสตร์">งานยุทธศาสตร์แผนและงบประมาณ</option>
                            <option value="ทรัพยากรบุคคล">งานบริหารทรัพยากรบุคคล</option>
                            <option value="วิจัยและบริการวิชาการ">งานบริหารและส่งเสริมการวิจัยและบริการวิชาการ</option>
                            <option value="การศึกษาและกิจการนักศึกษา">งานบริหารการศึกษาและกิจการนักศึกษา</option>
                            <option value="การศึกษาแบบยืดหยุ่นและพัฒนาทักษะ">งานส่งเสริมการศึกษาแบบยืดหยุ่นและพัฒนาทักษะ</option>
                            <option value="บูรณาการวิชาการเพื่อสังคม">สำนักงานบูรณาการวิชาการเพื่อสังคม</option>
                        </select>
                        </label>
                        <label className='righttitleTel'>
                        โทร <input type="text" placeholder='Enter โทร' onChange={e => setTel(e.target.value)}/>
                        </label>
                    </div>
                    <div>
                    <label className='lefttitleMachine'>
                    Notebookจำนวน <select value={machine} onChange={(e) => setMachine(e.target.value)}>
                    <option value={null}>Please select an option...</option>
                        {machines && machines.length > 0 ? (
                            machines.map(machine => (
                                <option key={machine.id} value={machine.value}>
                                    {machine.value} เครื่อง
                                </option>
                            ))
                        ) : (
                            <option value="">Loading...</option>
                        )}
                        
                    </select>
                    </label>
                        <label className='righttitleStereo'>
                    เครื่องเสียงจำนวน <select value={stereo} onChange={(e) => setStereo(e.target.value)}>
                    <option value={null}>Please select an option...</option>
                        {machines && machines.length > 0 ? (
                            machines.map(machine => (
                                <option key={machine.id} value={machine.value}>
                                    {machine.value} เครื่อง
                                </option> 
                            ))
                        ) : (
                            <option value="">Loading...</option>
                        )}
                    </select>
                    
                    </label>
                    </div>
                    <div>
                    <label className='lefttitleWirelessmic'>
                    เครื่องไมโครโฟนชนิดไร้สาย <select value={wirelessmic} onChange={(e) => setWirelessmic(e.target.value)}>
                    <option value={null}>Please select an option...</option>
                        {machines && machines.length > 0 ? (
                            machines.map(machine => (
                                <option key={machine.id} value={machine.value}>
                                    {machine.value} เครื่อง
                                </option>
                            ))
                        ) : (
                            <option value="">Loading...</option>
                        )}
                    </select>
                    </label>
                        <label className='righttitleVoicerec'>
                    เครื่องบันทึกเสียงจำนวน <select value={voicerec} onChange={(e) => setVoicerec(e.target.value)}>
                    <option value={null}>Please select an option...</option>
                        {machines && machines.length > 0 ? (
                            machines.map(machine => (
                                <option key={machine.id} value={machine.value}>
                                    {machine.value} เครื่อง
                                </option> 
                            ))
                        ) : (
                            <option value="">Loading...</option>
                        )}
                    </select>
                    </label>
                    </div>
                    <div>
                        <label className='lefttitleObjective'>
                    วัตถุประสงค์เพื่อ <input type="text" placeholder='Enter วัตถุประสงค์' onChange={e => setObjective(e.target.value)} />
                    </label>
                    </div>
                    {/* <div>
                    ยืม ณ วันที่<input type="date" />
                    ถึง วันที่<input type="date" />
                    </div> */}
                    <div>
                        <label className='lefttitleStartdate'>
                    ยืม ณ วันที่ <input type="datetime-local" id="datetimeInput" name="datetimeInput" onChange={e => setStartdate(e.target.value)}/>
                    </label>
                    <label className='righttitleEnddate'>
                    ถึง วันที่ <input type="datetime-local" id="datetimeInput" name="datetimeInput" onChange={e => setEnddate(e.target.value)}/>
                    </label>
                    </div>
                    <div>
                        <label className='lefttitleLocation'>
                    สถานที่ <input type="text" placeholder='Enter สถานที่' onChange={e => setLocation(e.target.value)} />
                    </label>
                    </div>
                    <div>
                    <label className='borrowBtn'>
                    <button disabled={machine === ''||location === ''}>ยืม</button>
                    </label>
                    </div>
                </form>
            </div>
        </div>
        รายละเอียด
        <div className='containertable'>
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
                                <td>
  <span style={{ color: new Date(user.enddate) < new Date() ? 'red' : 'green' }}>
    {new Date(user.enddate) < new Date() ? 'เกินกำหนด' : 'อยู่ในกำหนดการยืม'}
  </span>
</td>
                                <td>
                                    <Link to={`/read/${user.id}`} >รายละเอียด</Link>
                                </td>
                            </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
            <div class="bottom-bar">
            <p class="signature">Created by Thanyapoj v1.0</p>
            </div>
            </>
    )
}

export default Table
