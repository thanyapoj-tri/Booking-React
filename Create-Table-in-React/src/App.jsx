import { useState } from 'react'
import './App.css'
import Table from './Table'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Read from './Read'


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Table />}></Route>
        <Route path='/read/:id' element={<Read/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App