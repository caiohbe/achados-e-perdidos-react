import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./home"
import CssReset from "./assets/cssReset"
import ManageItems from "./manageItems"
import ManageUsers from "./manageUsers"

function App() {
  return (
    <>
      <CssReset />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='manage/item' element={<ManageItems />} />
          <Route path='manage/user' element={<ManageUsers />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
