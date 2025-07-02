import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./home"
import CssReset from "./assets/cssReset"
import ManageUsers from "./manageUsers"
import ManagePlaces from "./managePlaces"
import { useDebounce } from "./home"

function App() {
  return (
    <>
      <CssReset />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='users' element={<ManageUsers />} />
          <Route path='places' element={<ManagePlaces />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
