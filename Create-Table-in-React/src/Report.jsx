import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './Report.css'
import { Link } from 'react-router-dom'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);
function report() {
    // const ip = '10.12.3.100';
    const ip = '10.12.1.71';
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10; // Number of rows to display per page
    const [sumreport, setSumreport] = useState("");
    const [machineCount, setMachineCount] = useState(0); // State for machine count
    const [machineLabelCounts, setMachineLabelCounts] = useState({}); // State to hold label counts
    const [stereoCount, setStereoCount] = useState(0);
    const [wirelessMicCount, setWirelessMicCount] = useState(0);
    const [voiceRecCount, setVoiceRecCount] = useState(0);
    const [showLegend, setShowLegend] = useState(false);


    useEffect(()=>{
        axios.get(`http://${ip}:4000/usersreport`)
        .then((res) => {
          const fetchedData = res.data || [];
          setData(fetchedData);
          setSumreport(fetchedData.length); // count All time
        
        const totalMachineCount = fetchedData.reduce((sum, user) => {
          // นับจำนวนโน็ตบุ็ก
          const machineText = user.machine;
          const machineNumber = parseInt(machineText);
          return sum + (isNaN(machineNumber) ? 0 : machineNumber); // If NaN, ignore it
        }, 0);

        setMachineCount(totalMachineCount); // นับเครื่องโน็ตบุ็ก

        const labelCounts = fetchedData.reduce((counts, user) => {
          // sum each machince number
          const machineArray = Array.isArray(user.machinenumber) ? user.machinenumber : [];
          machineArray.forEach(machine => {
            const label = machine.label;
            counts[label] = (counts[label] || 0) + 1; // Increment count or initialize to 1
          });
          return counts;
        }, {});

        setMachineLabelCounts(labelCounts); // นับเลขเครื่อง
        // Set currentPage to the last page
        setCurrentPage(Math.ceil(fetchedData.length / rowsPerPage));
        // นับเครื่องโสต
        let stereoTotal = 0;
        let wirelessMicTotal = 0;
        let voiceRecTotal = 0;

        fetchedData.forEach((user) => {
            stereoTotal += parseInt(user.stereo) || 0;
            wirelessMicTotal += parseInt(user.wirelessmic) || 0;
            voiceRecTotal += parseInt(user.voicerec) || 0;
        });
                setStereoCount(stereoTotal);
                setWirelessMicCount(wirelessMicTotal);
                setVoiceRecCount(voiceRecTotal);
        })
        .catch(er => console.log(er));
    }, [])

    // Calculate total pages
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Get the rows to display for the current page
  const currentRows = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const NotebookchartData = {
    labels: Object.keys(machineLabelCounts),
    datasets: [
      {
        label: 'จำนวนครั้ง',
        data: Object.values(machineLabelCounts), // Usage counts
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
};
const NotebookchartOptions = {
  plugins: {
    legend: {
      display: showLegend, // Show the legend
      position: 'top', // Position: 'top', 'left', 'bottom', 'right'
      labels: {
        boxWidth: 10, // Width of the legend box
        boxHeight: 10, // Height of the legend box (optional)
        padding: 10, // Spacing between the boxes and labels
        font: {
          size: 12, // Font size for the legend text
        },
        color: '#333', // Text color
      },
    },
    datalabels: {
      color: '#fff',
      anchor: 'center',
      align: 'center',
      font: {
        size: 14
      },
      formatter: (value, context) => {
        const total = context.chart.data.datasets[0].data.reduce(
          (acc, curr) => acc + curr,
          0
        );
        const percentage = ((value / total) * 100).toFixed(0);
        return `${percentage}%`;
      },
    },
  },
};

  const AudioequipchartData = {
    labels: ["เครื่องเสียง", "ไมค์ ไร้สาย", "เครื่องบันทึกเสียง"],
    datasets: [
        {
            data: [stereoCount, wirelessMicCount, voiceRecCount],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"], // Colors for each slice
            hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
        }
    ]
};
const AudioequipchartOptions = {
  plugins: {
    datalabels: {
      color: '#fff', // Text color
      anchor: 'center', // Positioning
      align: 'center', // Center the text
      font: {
        size: 14
      },
      formatter: (value, context) => {
        const total = context.chart.data.datasets[0].data.reduce(
          (acc, curr) => acc + curr,
          0
        );
        const percentage = ((value / total) * 100).toFixed(0);
        return `${percentage}%`;
      },
    },
  },
};

  return (
    
    <div>
        <div class="main-container">
            <div class="main-title">
                <h2 >DASHBOARD</h2>
            </div>

            <div class="main-cards">
            <div class="card-report">
                <div class="card-inner">
                    <h3>จำนวนครั้งในการใช้งาน</h3>
                        <span class="material-icons-outlined">inventory_2</span>
                </div>
                <h1>{sumreport}</h1>
            </div>
          
          <div class="card-report">
            <div class="card-inner">
              <h3>จำนวนครั้งการใช้โน็ตบุ็ก</h3>
              <span class="material-icons-outlined">category</span>
            </div>
            <h1>{machineCount}</h1> {/* Display the total machine count */}
          </div>

          <div class="card-report">
            <div class="card-inner">
              <h3>%การใช้เครื่องโน็ตบุ็ก</h3>
              <span class="material-icons-outlined">groups</span>
            </div>
            {/* <ul>
              {Object.entries(machineLabelCounts).map(([label, count]) => (
                <li key={label}>
                  {label}: {count} ครั้ง
                </li>
              ))}
            </ul> */}
            <div><input
            type="checkbox"
            checked={showLegend}
            onChange={(e) => setShowLegend(e.target.checked)}
          />
          รายละเอียด</div>
            <Pie data={NotebookchartData} options={NotebookchartOptions} />
          </div>

          <div class="card-report">
            <div class="card-inner">
              <h3>%การใช้อุปกรณ์โสต</h3>
              <span class="material-icons-outlined">speaker_group</span>
            </div>
            {/* <h3> จำนวนการใช้เครื่องเสียง  {stereoCount}</h3>
              <h3>จำนวนการใช้เครื่องไมโครโฟน {wirelessMicCount}</h3>
                <h3>จำนวนการใช้เครื่องบันทึกเสียง {voiceRecCount}</h3> */}
                <Pie data={AudioequipchartData} options={AudioequipchartOptions} />

          </div>

            </div>
        </div>
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
                        {currentRows.map((user, index) => 
                            (
                            <tr key={index}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.machine} เครื่อง</td>
                                <td>{user.stereo} เครื่อง</td>
                                <td>{user.wirelessmic} เครื่อง</td>
                                <td>{user.voicerec} เครื่อง</td>
                                <td>{new Date(user.enddate) < new Date() ? 'ครบกำหนดประสงค์' : 'อยู่ในกำหนดการยืม'}</td>
                                <td>
                                    <Link to={`/reportread/${user.id}`} >รายละเอียด</Link>
                                </td>
                            </tr>
                            )
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="pagination">
  {[...Array(totalPages).keys()].reverse().map((page) => (
    <button
      key={page}
      onClick={() => handlePageChange(page + 1)}
      className={currentPage === page + 1 ? "active" : ""}
    >
      {page + 1}
    </button>
  ))}
</div>
            </div>
            <div class="bottom-bar">
            <Link to={`/`} className='button'>กลับหน้าหลัก</Link>
            <p class="signature">Created by Thanyapoj v1.0</p>
            </div>
    </div>
  )
}

export default report
