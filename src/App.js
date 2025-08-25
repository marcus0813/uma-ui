import Layout from "./components/ui/layout/Layout";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    // <DataProvider>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Login />} />
        <Route path="Register">
          <Route index element={<Register />} />
        </Route>
        <Route path=":id">
          <Route index element={<Profile />} />
        </Route>
        <Route path="*" element={<Login />} />
      </Route>
    </Routes>
    // </DataProvider>
  );
}

export default App;
