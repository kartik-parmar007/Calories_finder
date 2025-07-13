import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => (
  <div>
    <h1>Calories Finder</h1>
    <nav>
      <Link to="/search">Search</Link> | <Link to="/history">History</Link>
    </nav>
    <p>Welcome to the Calories Finder app! Use the navigation to search for calories or view your search history.</p>
  </div>
);

export default Home;