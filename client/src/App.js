import { Route, Routes, Navigate } from "react-router-dom";
// import Main from "./components/Main";
import Signup from "./components/Singup";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Dashboard from "./components/pages/Dashboard";
import ExpenseForm from "./components/pages/ExpenseForm";

function App() {
	const user = localStorage.getItem("token");

	return (
		<Routes>
			{/* {user && <Route path="/" exact element={<Main />} />} */}
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
			{/* <Route path="/" element={<Navigate replace to="/login" />} /> */}
			<Route path="/" element={<Layout />} >
              {user && <Route index element={<Dashboard />} />}
			  <Route path="/" element={<Navigate replace to="/login" />} />
			  <Route path="/expenses/new" exact element={<ExpenseForm />} />
			</Route>
			
		</Routes>
	);
}

export default App;
