import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./home"
import CssReset from "./assets/cssReset"
import ManageItems from "./manageItems"
import ManageUsers from "./manageUsers"
import ManagePlaces from "./managePlaces"

function App() {
  return (
    <>
      <CssReset />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='manage/items' element={<ManageItems />} />
          <Route path='manage/users' element={<ManageUsers />} />
          <Route path='manage/places' element={<ManagePlaces />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
