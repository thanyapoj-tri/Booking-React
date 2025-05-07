import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './App.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CreatableSelect from "react-select/creatable";
import { Modal, Button } from '@mui/material';

function Table() {
    // const ip = '10.12.3.100';
    const ip = '10.12.1.71';
    const dbip = '10.12.1.72';
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
    const [pendingData, setPendingData] = useState([]);
    const [staffName, setStaffName] = useState(''); // Staff identifier
    const [phpusers, setPhpusers] = useState([]); // Phpusers
    const [selectedRow, setSelectedRow] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(()=>{
        axios.get(`http://${ip}:3000/users`)
        // axios.get(`http://localhost:3000/users?timestamp=${new Date().getTime()}`)
        .then(res => {
            console.log("API users response:", res.data); // Log the API response
            setData(res.data || []);
        })
        .catch(er => console.log(er));
    }, [])
    useEffect(()=>{
        const interval = setInterval(() => {
        axios.get(`http://${ip}:3000/machines?timestamp=${new Date().getTime()}`)
        // axios.get(`http://localhost:3000/machines`)
        .then(res => {
            console.log("API machines response:", res.data); // Log the API response
            const sortedMachines = res.data.sort((a, b) => a.value - b.value);
            setMachines(sortedMachines);
        })
        .catch(er => console.log(er));
        }, 5000);
        return () => clearInterval(interval);
    }, [])
    useEffect(() => {
        axios.get(`http://${ip}:3000/pending?timestamp=${new Date().getTime()}`)
            .then(res => setPendingData(res.data))
            .catch(er => console.log(er));
    }, []);
    useEffect(()=>{
        axios.get(`http://${ip}:4000/usersreport?timestamp=${new Date().getTime()}`)
        .then(res => setReport(res.data))
        .catch(er => console.log(er));
    }, [])
    useEffect(() => {
        fetchEmployeeData();
        fetch(`http://${ip}:5000/api/data`)
          .then(response => response.json())
          .then(data => setPhpusers(data))
          .catch(error => console.error('Error fetching data:', error));
      }, []);

      const fetchEmployeeData = async () => {
        try {
        // Replace with your actual data fetching logic
        const response = await fetch(`http://${ip}:5000/api/data`); // Example API endpoint
        const data = await response.json();
      
        // if (data.length > 0) {
        //     const employee = data[0]; // Access the first (or desired) employee object
        //     setName(employee.Employee_name);
        //     setIdentity(employee.Position);
        //     setDepartment(employee.Organization);
        //     console.log(data.employee.Employee_name);
        //   } else {
        //     console.error("No employee data found");
        //   }
        } catch (error) {
          console.error("Error fetching employee data:", error);
        }
        
      };
      
    
    //   console.log(phpusers);

    const creatableOptions = machines.map(machine => ({
        value: machine.value,
        label: `เครื่อง No. ${machine.value}`,
        id: machine.id
      }));

      const handleCreatableChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        console.log('handleChange', selectedOption);
      };
    
    
    // const sendLineNotification = async (message) => {
    //     axios.post(`http://${ip}:3001/send-line-notification`, { message })
    //         .then(() => {
    //             console.log('LINE notification sent');
    //         })
    //         .catch(error => {
    //             console.error('Error sending LINE notification:', error);
    //         });
    // };

    const handleSubmit = (event) => {
        event.preventDefault();

        const id = report.length + 1;
        axios.post(`http://${ip}:4000/usersreport`
        , {id: 'IT-S002-'+id, name: name,identity: identity,department: department,tel: tel, machine: machine,stereo: stereo,wirelessmic: wirelessmic,voicerec: voicerec ,objective: objective,startdate: startdate,enddate: enddate ,location: location,machinenumber: selectedOption})
            .then(res => {    
                console.log('added user report');
            })
            .catch(er => console.log(er));

        const id2 = pendingData.length + 1;
        axios.post(`http://${ip}:3000/pending`
            , {id: 'q-'+id2+name, name: name,identity: identity,department: department,tel: tel, machine: machine,stereo: stereo,wirelessmic: wirelessmic,voicerec: voicerec ,objective: objective,startdate: startdate,enddate: enddate ,location: location,machinenumber: selectedOption})
                .then(res => {    
                    console.log('added user report to pending');
                    window.location.reload(true);
                    selectedOption.forEach(machine => {
                        handleDeleteMachine(machine.id);
                    });
                })
                .catch(er => console.log(er));
        // axios.post(`http://${ip}:3000/users`
        // , {id: 'q-'+id2+name, name: name,identity: identity,department: department,tel: tel, machine: machine,stereo: stereo,wirelessmic: wirelessmic,voicerec: voicerec ,objective: objective,startdate: startdate,enddate: enddate ,location: location,machinenumber: selectedOption})
        //     .then(res => {    
        //         console.log('added user');
        //         window.location.reload(true);
        //         console.log(`machine num. ${JSON.stringify(selectedOption)} has been borrow`);
        //         selectedOption.forEach(machine => {
        //         handleDeleteMachine(machine.id);
        //     });
        //     })
        //     .catch(er => console.log(er));
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
    
    const userId = 'Cb2a1552898264bd93d1983061cd67af1'; // Replace with the actual user ID
  // Function to send LINE notification
  const sendLineNotification = async (userId, message) => {
    try {
      await axios.post(`http://${ip}:3050/send-line-message`, { userId, message });
      console.log('LINE notification sent');
    } catch (error) {
      console.error('Error sending LINE notification:', error);
    }
  };
  

    const handleApprove = (pendingId) => {
        const approvedItem = pendingData.find(item => item.id === pendingId);
        const approvedData = {
            ...approvedItem,
            approvedBy: staffName, // Add staff identifier
        };
        axios.post(`http://${ip}:3000/users`, approvedData)
            // .then(() => {
            //     return axios.post(`http://${ip}:4000/usersreport`, approvedData);
            // })
            .then(() => {
                axios.delete(`http://${ip}:3000/pending/${pendingId}`);
            })
            .then(() => {
                console.log('Approved and moved to users');
                setPendingData(pendingData.filter(item => item.id !== pendingId));
                 // Send LINE notification
                sendLineNotification(userId, `มีการยืมโดย ${approvedData.name} จำนวน ${approvedData.machine} has been approved by ${staffName}.`);
                // window.location.reload(true);
            })
            .catch(er => console.log(er));
    };
    
    const handleReject = (pendingId) => {
        // Step 1: Delete the pending item by its ID
        axios.delete(`http://${ip}:3000/pending/${pendingId}`)
            .then(() => {
                console.log('Rejected and removed from pending');
                console.log('Pending Data object:', pendingData); // Log the entire pendingData object
    
                // Step 2: Find the specific pending item by ID to access its machinenumber
                const rejectedItem = pendingData.find(item => item.id === pendingId);
    
                // Step 3: Check if machinenumber exists and is an array
                if (rejectedItem && Array.isArray(rejectedItem.machinenumber)) {
                    rejectedItem.machinenumber.forEach(machine => handleAddMachine(machine)); // Post each machine
                } else {
                    console.log('machinenumber is undefined or not an array');
                }
    
                // Step 4: Remove the pending item from the local state
                setPendingData(pendingData.filter(item => item.id !== pendingId));
            })
            .catch(error => console.log(error));
    };

    const handleEdit = (id) => {
        
    }

    const handleAddMachine = (machine) => {
        console.log(machine, 'this is machine object');
        
        // Step 5: Post the machine back to the machines collection
        axios.post(`http://${ip}:3000/machines`, { value: machine.value, id: machine.id })
            .then(res => {
                console.log(`Added ${machine.label} with id ${machine.id} to machines collection`);
                // Optional: If you need to reload the page or update the state after adding
                // location.reload();
            })
            .catch(error => console.log(error));
    };
    
    const handleOpen = (row) => {
        setSelectedRow(row); // Set the selected row data
        setOpen(true); // Open the modal
      };
    
      const handleClose = () => {
        setOpen(false); // Close the modal
      };

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
                    <label className='lefttitleName' style={{ color: 'black' }}>
                        ชื่อ-นามสกุล <input type="text" placeholder='Enter Name' value={name} onChange={e => setName(e.target.value)} />
                        </label>
                        <label className='righttitleIdentity' style={{ color: 'black' }}>
                        ประเภทบุคคล <select value={identity} onChange={(e) => setIdentity(e.target.value)}>
                            <option value="" selected disabled>Please select an option...</option>
                            <option value="อาจารย์">อาจารย์</option>
                            <option value="บุคลากร">บุคลากร</option>
                            <option value="นักศึกษา">นักศึกษา</option>
                            <option value="อื่นๆ">อื่นๆ</option>
                        </select>
                        </label>
                    </div>
                    <div>
                    <label className='lefttitleDepartment' style={{ color: 'black' }}>
                        หน่วยงาน/ภาควิชา <select onChange={(e) => setDepartment(e.target.value)}>
                            <option value="" selected disabled>Please select an option...</option>
                            <option value="ภาควิชาสังคมศาสตร์">ภาควิชาสังคมศาสตร์</option>
                            <option value="ภาควิชาศึกษาศาสตร์">ภาควิชาศึกษาศาสตร์</option>
                            <option value="ภาควิชาสังคมและสุขภาพ">ภาควิชาสังคมและสุขภาพ</option>
                            <option value="ภาควิชามนุษยศาสตร์">ภาควิชามนุษยศาสตร์</option>
                            <option value="งานบริหารและพัฒนาอย่างยั่งยืน">งานบริหารทั่วไป</option>
                            <option value="งานบริหารคลังและสินทรัพย์">งานคลังและสินทรัพย์</option>
                            <option value="งานยุทธศาสตร์และพัฒนาคุณภาพ">งานยุทธศาสตร์แผนและงบประมาณ</option>
                            <option value="งานบริหารและพัฒนาทรัพยากรบุคคล">งานบริหารทรัพยากรบุคคล</option>
                            <option value="งานวิจัยและบริการวิชาการ">งานบริหารและส่งเสริมการวิจัยและบริการวิชาการ</option>
                            <option value="งานบริหารการศึกษาและนวัตกรรมการเรียนรู้">งานบริหารการศึกษาและนวัตกรรมการเรียนรู้</option>
                            <option value="งานส่งเสริมการศึกษาแบบยืดหยุ่นและพัฒนาทักษะ">งานส่งเสริมการศึกษาแบบยืดหยุ่นและพัฒนาทักษะ</option>
                            <option value="สำนักงานบูรณาการวิชาการเพื่อสังคม">สำนักงานบูรณาการวิชาการเพื่อสังคม</option>
                            <option value="งานวิเทศสัมพันธ์ สื่อสารองค์กร และกิจการนักศึกษา">งานวิเทศสัมพันธ์ สื่อสารองค์กร และกิจการนักศึกษา</option>
                            <option value="งานบัณฑิตศึกษา">งานบัณฑิตศึกษา</option>
                            <option value="เลขาคณบดี">[เลขา]คณบดีและผู้บริหาร</option>
                        </select>
                        </label>
                        <label className='righttitleTel' style={{ color: 'black' }}>
                        โทร <input type="text" placeholder='Enter โทร' onChange={e => setTel(e.target.value)}/>
                        </label>
                    </div>
                    <div>
                    <label className='lefttitleMachine' style={{ color: 'black' }}>
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
                        <label className='righttitleStereo' style={{ color: 'black' }}>
                    เครื่องเสียงจำนวน <select onChange={(e) => setStereo(e.target.value)}>
                    <option value="ไม่ใช้">ไม่ใช้</option>
                        {machines && machines.length > 0 ? (
                        [
                            <option key="1" value="1">1 เครื่อง</option>,
                            <option key="2" value="2">2 เครื่อง</option>,
                            <option key="3" value="3">3 เครื่อง</option>,
                            <option key="4" value="4">4 เครื่อง</option>,
                            <option key="5" value="5">5 เครื่อง</option>,
                            <option key="6" value="6">6 เครื่อง</option>,
                            <option key="7" value="7">7 เครื่อง</option>,
                            <option key="8" value="8">8 เครื่อง</option>,
                            <option key="9" value="9">9 เครื่อง</option>,
                            <option key="10" value="10">10 เครื่อง</option>
                        ]
                        ) : (
                            <option value="" selected>Loading...</option>
                        )}
                    </select>
                    
                    </label>
                    </div>
                    <div>
                    <label className='lefttitleWirelessmic' style={{ color: 'black' }}>
                    เครื่องไมโครโฟนชนิดไร้สาย <select onChange={(e) => setWirelessmic(e.target.value)}>
                    <option value="ไม่ใช้">ไม่ใช้</option>
                        {machines && machines.length > 0 ? (
                        [
                            <option key="1" value="1">1 เครื่อง</option>,
                            <option key="2" value="2">2 เครื่อง</option>,
                            <option key="3" value="3">3 เครื่อง</option>,
                            <option key="4" value="4">4 เครื่อง</option>,
                            <option key="5" value="5">5 เครื่อง</option>,
                            <option key="6" value="6">6 เครื่อง</option>,
                            <option key="7" value="7">7 เครื่อง</option>,
                            <option key="8" value="8">8 เครื่อง</option>,
                            <option key="9" value="9">9 เครื่อง</option>,
                            <option key="10" value="10">10 เครื่อง</option>
                        ]
                        ) : (
                            <option value="" selected>Loading...</option>
                        )}
                    </select>
                    </label>
                        <label className='righttitleVoicerec' style={{ color: 'black' }}>
                    เครื่องบันทึกเสียงจำนวน <select onChange={(e) => setVoicerec(e.target.value)}>
                    <option value="ไม่ใช้">ไม่ใช้</option>
                        {machines && machines.length > 0 ? (
                        [
                            <option key="1" value="1">1 เครื่อง</option>,
                            <option key="2" value="2">2 เครื่อง</option>,
                            <option key="3" value="3">3 เครื่อง</option>,
                            <option key="4" value="4">4 เครื่อง</option>,
                            <option key="5" value="5">5 เครื่อง</option>,
                            <option key="6" value="6">6 เครื่อง</option>,
                            <option key="7" value="7">7 เครื่อง</option>,
                            <option key="8" value="8">8 เครื่อง</option>,
                            <option key="9" value="9">9 เครื่อง</option>,
                            <option key="10" value="10">10 เครื่อง</option>
                        ]
                        ) : (
                            <option value="" selected>Loading...</option>
                        )}
                    </select>
                    </label>
                    </div>
                    <div>
                        <label className='lefttitleObjective' style={{ color: 'black' }}>
                    วัตถุประสงค์เพื่อ <input type="text" placeholder='Enter วัตถุประสงค์' onChange={e => setObjective(e.target.value)} />
                    </label>
                    </div>
                    {/* <div>
                    ยืม ณ วันที่<input type="date" />
                    ถึง วันที่<input type="date" />
                    </div> */}
                    <div>
                        <label className='lefttitleStartdate' style={{ color: 'black' }}>
                    ยืม ณ วันที่ <input type="datetime-local" id="datetimeInput" name="datetimeInput" onChange={e => setStartdate(e.target.value)}/>
                    </label>
                    <label className='righttitleEnddate' style={{ color: 'black' }}>
                    ถึง วันที่ <input type="datetime-local" id="datetimeInput" name="datetimeInput" onChange={e => setEnddate(e.target.value)}/>
                    </label>
                    </div>
                    <div>
                        <label className='lefttitleLocation' style={{ color: 'black' }}>
                    สถานที่ <input type="text" placeholder='Enter สถานที่' onChange={e => setLocation(e.target.value)} />
                    </label>
                    </div>
                    <div className="creatable-select-wrapper">
                    <label style={{ color: 'black' }}>
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
                        <div className="tooltip">
                            <button disabled={name === '' ||identity === ''||department === ''||tel === ''|| machine === ''||stereo === ''||wirelessmic === ''||voicerec === ''||objective === ''||startdate === ''||location === ''||enddate === ''||selectedOption === 'ไม่ใช้' ||selectedOption === ''}>ยืม</button>
                                <span className="tooltiptext">กรอกครบยังสุดสวย</span>
                        </div>
                    </label>
                    </div>
                </form>
            </div>
        </div>
        Pending Approvals
        
        <div className='containertable'>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Staff</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>
                                ชื่อ:
                                    <select value={staffName} onChange={(e) => setStaffName(e.target.value)}>
                                    <option value="" disabled>เจ้าหน้าที่</option>
                                    
                                    <option key="1" value="กนกวรรณ นิ่มทัศนศิริ">กนกวรรณ นิ่มทัศนศิริ</option>
                                    </select>
                            </td>
                            <td>
                                <button onClick={() => handleApprove(item.id)} disabled={staffName === ''}>Approve</button>
                                <button onClick={() => handleReject(item.id)}>Reject</button>
                            </td>
                            <td>
                                <Button variant="contained" onClick={() => handleOpen(item)}>
                                      ดู รายละเอียด
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal open={open} onClose={handleClose}>
                 <div style={{ padding: '20px', background: 'white', borderRadius: '10px' }}>
                    {selectedRow && (
                          <div>
                           <h2>Information for ID: {selectedRow.id}</h2>
                           <p><strong>ชื่อ:</strong> {selectedRow.name}</p>
                           <p><strong>หน่วยงาน:</strong> {selectedRow.department}</p>
                           <p><strong>โทร:</strong> {selectedRow.tel}</p>
                           <p><strong>โน๊ตบุ๊คจำนวน:</strong> {selectedRow.machine}</p>
                           <p><strong>โน๊ตบุ๊คเบอร์:</strong> {Array.isArray(selectedRow.machinenumber) && selectedRow.machinenumber.length > 0 ? selectedRow.machinenumber.map(machine => machine.label).join(', ') : 'ไม่มีข้อมูล'}</p>
                           <p><strong>ประสงค์ยืมวันที่:</strong> {selectedRow.startdate}</p>
                           <p><strong>ใช้เสร็จวันที่:</strong> {selectedRow.enddate}</p>
                       <Button onClick={handleClose}>Close</Button>
                 </div>
          )}
        </div>
      </Modal>
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
