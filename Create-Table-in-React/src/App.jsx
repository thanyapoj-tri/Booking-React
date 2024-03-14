import { useState } from 'react'
import './App.css'
import Table from './Table'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Read from './Read'
import Report from './Report'
import ReportRead from './ReportRead'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Table />}></Route>
        <Route path='/read/:id' element={<Read/>}></Route>
        <Route path='/report/' element={<Report/>}></Route>
        <Route path='/reportread/:id' element={<ReportRead/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App