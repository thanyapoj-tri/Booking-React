import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './App.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CreatableSelect from "react-select/creatable";

function Table() {
    // const ip = 'localhost';
    const ip = '10.12.3.100';
    const [data, setData] = useState([])
    const [machines, setMachines] = useState([]);
    const [name, setName] = useState('')
    const [machine, setMachine] = useState('ไม่ใช้') // Updated to hold a single value
    const [editID, setEditID] = useState(-1)
    const [identity, setIdentity] = useState('')
    const [department, setDepartment] = useState('')
    const [tel, setTel] = useState('')
    const [stereo, setStereo] = useState('ไม่ใช้')
    const [wirelessmic, setWirelessmic] = useState('ไม่ใช้')
    const [voicerec, setVoicerec] = useState('ไม่ใช้')
    const [objective, setObjective] = useState('')
    const [startdate, setStartdate] = useState('')
    const [enddate, setEnddate] = useState('')
    const [location, setLocation] = useState('')
    const [report, setReport] = useState([]);
    const [selectedOption, setSelectedOption] = useState('ไม่ใช้');

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
    

    const creatableOptions = machines.map(machine => ({
        value: machine.value,
        label: `เครื่อง No. ${machine.value}`,
        id: machine.id
      }));

      const handleCreatableChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        console.log('handleChange', selectedOption);
      };
    
    //   const handleInputChange = (inputValue) => {
    //     console.log('handleInputChange', inputValue);
    //   };

    const handleSubmit = (event) => {
        event.preventDefault();

        const id = report.length + 1;
        axios.post(`http://${ip}:4000/usersreport`
        , {id: 'IT-S002-'+id, name: name,identity: identity,department: department,tel: tel, machine: machine,stereo: stereo,wirelessmic: wirelessmic,voicerec: voicerec ,objective: objective,startdate: startdate,enddate: enddate ,location: location,machinenumber: selectedOption})
            .then(res => {    
                console.log('added user report');
            })
            .catch(er => console.log(er));

        const id2 = data.length + 1;
        axios.post(`http://${ip}:3000/users`
        , {id: 'q-'+id2+name, name: name,identity: identity,department: department,tel: tel, machine: machine,stereo: stereo,wirelessmic: wirelessmic,voicerec: voicerec ,objective: objective,startdate: startdate,enddate: enddate ,location: location,machinenumber: selectedOption})
            .then(res => {    
                console.log('added user');
                window.location.reload(true);
                console.log(`machine num. ${JSON.stringify(selectedOption)} has been borrow`);
                selectedOption.forEach(machine => {
                handleDeleteMachine(machine.id);
            });
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
                            <option value="" selected disabled hidden>Please select an option...</option>
                            <option value="อาจารย์">อาจารย์</option>
                            <option value="บุคลากร">บุคลากร</option>
                            <option value="นักศึกษา">นักศึกษา</option>
                        </select>
                        </label>
                    </div>
                    <div>
                    <label className='lefttitleDepartment'>
                        หน่วยงาน/ภาควิชา <select onChange={(e) => setDepartment(e.target.value)}>
                            <option value="" selected disabled hidden>Please select an option...</option>
                            <option value="ภาควิชาสังคมศาสตร์">ภาควิชาสังคมศาสตร์</option>
                            <option value="ภาควิชาศึกษาศาสตร์">ภาควิชาศึกษาศาสตร์</option>
                            <option value="ภาควิชาสังคมและสุขภาพ">ภาควิชาสังคมและสุขภาพ</option>
                            <option value="ภาควิชามนุษยศาสตร์">ภาควิชามนุษยศาสตร์</option>
                            <option value="งานบริหารทั่วไป">งานบริหารทั่วไป</option>
                            <option value="งานคลังและสินทรัพย์">งานคลังและสินทรัพย์</option>
                            <option value="งานยุทธศาสตร์แผนและงบประมาณ">งานยุทธศาสตร์แผนและงบประมาณ</option>
                            <option value="งานบริหารทรัพยากรบุคคล">งานบริหารทรัพยากรบุคคล</option>
                            <option value="งานบริหารและส่งเสริมการวิจัยและบริการวิชาการ">งานบริหารและส่งเสริมการวิจัยและบริการวิชาการ</option>
                            <option value="งานบริหารการศึกษาและกิจการนักศึกษา">งานบริหารการศึกษาและกิจการนักศึกษา</option>
                            <option value="งานส่งเสริมการศึกษาแบบยืดหยุ่นและพัฒนาทักษะ">งานส่งเสริมการศึกษาแบบยืดหยุ่นและพัฒนาทักษะ</option>
                            <option value="สำนักงานบูรณาการวิชาการเพื่อสังคม">สำนักงานบูรณาการวิชาการเพื่อสังคม</option>
                        </select>
                        </label>
                        <label className='righttitleTel'>
                        โทร <input type="text" placeholder='Enter โทร' onChange={e => setTel(e.target.value)}/>
                        </label>
                    </div>
                    <div>
                    <label className='lefttitleMachine'>
                    Notebookจำนวน <select onChange={(e) => setMachine(e.target.value)}>
                    <option value="ไม่ใช้">ไม่ใช้</option>
                        {machines && machines.length > 0 ? (
                        [
                            <option key="1" value="1 เครื่อง">1 เครื่อง</option>,
                            <option key="2" value="2 เครื่อง">2 เครื่อง</option>,
                            <option key="3" value="3 เครื่อง">3 เครื่อง</option>,
                            <option key="4" value="4 เครื่อง">4 เครื่อง</option>,
                            <option key="5" value="5 เครื่อง">5 เครื่อง</option>,
                            <option key="6" value="6 เครื่อง">6 เครื่อง</option>,
                            <option key="7" value="7 เครื่อง">7 เครื่อง</option>,
                            <option key="8" value="8 เครื่อง">8 เครื่อง</option>,
                            <option key="9" value="9 เครื่อง">9 เครื่อง</option>,
                            <option key="10" value="10 เครื่อง">10 เครื่อง</option>
                        ]
                        ) : (
                            <option value="" selected>Loading...</option>
                        )}
                    </select>
                    </label>
                        <label className='righttitleStereo'>
                    เครื่องเสียงจำนวน <select onChange={(e) => setStereo(e.target.value)}>
                    <option value="ไม่ใช้">ไม่ใช้</option>
                        {machines && machines.length > 0 ? (
                        [
                            <option key="1" value="1 เครื่อง">1 เครื่อง</option>,
                            <option key="2" value="2 เครื่อง">2 เครื่อง</option>,
                            <option key="3" value="3 เครื่อง">3 เครื่อง</option>,
                            <option key="4" value="4 เครื่อง">4 เครื่อง</option>,
                            <option key="5" value="5 เครื่อง">5 เครื่อง</option>,
                            <option key="6" value="6 เครื่อง">6 เครื่อง</option>,
                            <option key="7" value="7 เครื่อง">7 เครื่อง</option>,
                            <option key="8" value="8 เครื่อง">8 เครื่อง</option>,
                            <option key="9" value="9 เครื่อง">9 เครื่อง</option>,
                            <option key="10" value="10 เครื่อง">10 เครื่อง</option>
                        ]
                        ) : (
                            <option value="" selected>Loading...</option>
                        )}
                    </select>
                    
                    </label>
                    </div>
                    <div>
                    <label className='lefttitleWirelessmic'>
                    เครื่องไมโครโฟนชนิดไร้สาย <select onChange={(e) => setWirelessmic(e.target.value)}>
                    <option value="ไม่ใช้">ไม่ใช้</option>
                        {machines && machines.length > 0 ? (
                        [
                            <option key="1" value="1 เครื่อง">1 เครื่อง</option>,
                            <option key="2" value="2 เครื่อง">2 เครื่อง</option>,
                            <option key="3" value="3 เครื่อง">3 เครื่อง</option>,
                            <option key="4" value="4 เครื่อง">4 เครื่อง</option>,
                            <option key="5" value="5 เครื่อง">5 เครื่อง</option>,
                            <option key="6" value="6 เครื่อง">6 เครื่อง</option>,
                            <option key="7" value="7 เครื่อง">7 เครื่อง</option>,
                            <option key="8" value="8 เครื่อง">8 เครื่อง</option>,
                            <option key="9" value="9 เครื่อง">9 เครื่อง</option>,
                            <option key="10" value="10 เครื่อง">10 เครื่อง</option>
                        ]
                        ) : (
                            <option value="" selected>Loading...</option>
                        )}
                    </select>
                    </label>
                        <label className='righttitleVoicerec'>
                    เครื่องบันทึกเสียงจำนวน <select onChange={(e) => setVoicerec(e.target.value)}>
                    <option value="ไม่ใช้">ไม่ใช้</option>
                        {machines && machines.length > 0 ? (
                        [
                            <option key="1" value="1 เครื่อง">1 เครื่อง</option>,
                            <option key="2" value="2 เครื่อง">2 เครื่อง</option>,
                            <option key="3" value="3 เครื่อง">3 เครื่อง</option>,
                            <option key="4" value="4 เครื่อง">4 เครื่อง</option>,
                            <option key="5" value="5 เครื่อง">5 เครื่อง</option>,
                            <option key="6" value="6 เครื่อง">6 เครื่อง</option>,
                            <option key="7" value="7 เครื่อง">7 เครื่อง</option>,
                            <option key="8" value="8 เครื่อง">8 เครื่อง</option>,
                            <option key="9" value="9 เครื่อง">9 เครื่อง</option>,
                            <option key="10" value="10 เครื่อง">10 เครื่อง</option>
                        ]
                        ) : (
                            <option value="" selected>Loading...</option>
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
                    <div className="creatable-select-wrapper">
                    <label >
                    หมายเลขเครื่องNotebook <CreatableSelect className="my-select" classNamePrefix="my-select"
                        options={creatableOptions}
                        onChange={handleCreatableChange}
                        isMulti
                        // styles={colorStyles}
                        value={selectedOption}
                        />
                        </label>
                    </div>
                    <div>
                    <label className='borrowBtn'>
                    <button disabled={selectedOption === ''||enddate === ''}>ยืม</button>
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
            <Link to={`/report/`} className='button'>รวมผู้ใช้</Link>
            <p class="signature">Created by Thanyapoj v1.0</p>
            </div>
            </>
    )
}

export default Table
