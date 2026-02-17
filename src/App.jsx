import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Typography from '@mui/material/Typography';
import Home from "./pages/home/home";
import Explore from "./pages/explore/explore";
import Community from './pages/community/community';
import Login from "./pages/login/login";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Signup from "./pages/login/signup";
import RandomRedirect from "./components/randomCommunityBoard";
import CitiesInfo from "./components/citiesInfo.js";
import SingleCityPage from "./pages/explore/singleCityPage.jsx";
import UserAccount from "./pages/account/userAccount.jsx";
import Compare from "./pages/compare/compareCities.jsx";
function App() {

  return (
    <>
      <Router>
        <Navbar />
        <main className="bodyContent">
          <Routes>
            <Route 
            exact path="/"
            element={<Home />}
            />

            <Route 
            exact path="/explore"
            element={<Explore />} />

            <Route 
            exact path="/citydetails/:citySlug"
            element={<SingleCityPage />} />

            <Route
            exact path="/communityboard"
            element={<RandomRedirect CitiesInfo={CitiesInfo} />} />

            <Route 
            exact path="/communityboard/:citySlug"
            element={<Community />} />

            {/* <Route
              path="/account"
              element={
                isLoggedIn ? <Account /> : <Navigate to="/login" />
              }
            /> */}
            {/* can also display username and picture here */}

            <Route 
            exact path="/login" 
            element={<Login />} />

            <Route
            exact path ="/signup"
            element={<Signup />} />

            <Route
            exact path="/account"
            element={<UserAccount />} />

            <Route
            exact path="/compare/:slug1/:slug2"
            element={<Compare />} />

          </Routes>
        </main>

        <Footer />
      </Router>
      
    </>
  )
}

export default App
