import { BrowserRouter, Route, Routes } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Details from "./pages/MovieDetail";
import MovieSearch from "./pages/MovieSearch";
import PopularMovies from "./pages/PopularMovies";
import TrendingMovies from "./pages/TrendingMovies";
import DirectorSearch from "./pages/DirectorSearch";
import HeroSearch from "./pages/HeroSearch";
import HeroineSearch from "./pages/HeroineSearch";
import Search from "./pages/Search";
import GenreSearch from "./pages/GenreSearch";
import LangSearch from "./pages/LangSearch";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import UpdateProfile from "./pages/UpdateProfile";
import ResetPassword from "./components/ResetPassword";
import ReviewRating from "./pages/ReviewRating";
import ContactUs from "./pages/ContactUs";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Welcome/> } />
          <Route path="/register" element={ <SignUp/> } />
          <Route path="/login" element={ <SignIn/> } />
          <Route path="/reset-password/:id" element={ <ResetPassword/> } />
          {/* Protected routes-only after login */}
          <Route path="/home" element={ <ProtectedRoute> <Home/> </ProtectedRoute> } />
          <Route path="/details" element={ <ProtectedRoute> <Details/> </ProtectedRoute> } />
          <Route path="/popular" element={ <ProtectedRoute> <PopularMovies/> </ProtectedRoute> } />
          <Route path="/trending" element={ <ProtectedRoute> <TrendingMovies/> </ProtectedRoute> } />
          <Route path="/search/movie" element={ <ProtectedRoute> <MovieSearch/> </ProtectedRoute> } />
          <Route path="/search/director" element={ <ProtectedRoute> <DirectorSearch/> </ProtectedRoute> } />
          <Route path="/search/hero" element={ <ProtectedRoute> <HeroSearch/> </ProtectedRoute> } />
          <Route path="/search/heroine" element={ <ProtectedRoute> <HeroineSearch/> </ProtectedRoute> } />
          <Route path="/search/genre" element={ <ProtectedRoute> <GenreSearch/> </ProtectedRoute> } />
          <Route path="/search/lang" element={ <ProtectedRoute> <LangSearch/> </ProtectedRoute> } />
          <Route path="/search" element={ <ProtectedRoute> <Search/> </ProtectedRoute> } />
          <Route path="/movie/:id" element={ <ProtectedRoute> <Details/> </ProtectedRoute>  } />
          <Route path="profile/:id" element={ <ProtectedRoute> <ProfilePage/> </ProtectedRoute> } />
          <Route path="/update-profile/:id" element={ <ProtectedRoute> <UpdateProfile/> </ProtectedRoute>} />
          <Route path="/movie/:movieId/review-rating" element={ <ProtectedRoute> <ReviewRating/> </ProtectedRoute> } />
          <Route path="/contact/:id" element={ <ProtectedRoute> <ContactUs/> </ProtectedRoute> } />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
