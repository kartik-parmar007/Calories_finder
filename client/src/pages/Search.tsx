import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

interface Food {
  id: string;
  name: string;
  calories: number;
}

const API_BASE = import.meta.env.VITE_API_BASE || "https://your-vercel-api-url";

const Search: React.FC = () => {
  const [food, setFood] = useState("");
  const [results, setResults] = useState<Food[]>([]);
  const { getToken, userId } = useAuth();

  const handleSearch = async () => {
    const token = await getToken();
    const res = await axios.get(`${API_BASE}/api/search`, {
      params: { food },
      headers: { Authorization: `Bearer ${token}` }
    });
    setResults(res.data);

    // Save to history
    await axios.post(
      `${API_BASE}/api/history`,
      { food, user_id: userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  return (
    <div>
      <h2>Search Food Calories</h2>
      <input
        value={food}
        onChange={e => setFood(e.target.value)}
        placeholder="Enter food name"
      />
      <button onClick={handleSearch} disabled={!food}>Search</button>
      <ul>
        {results.map(f => (
          <li key={f.id}>{f.name}: {f.calories} kcal</li>
        ))}
      </ul>
    </div>
  );
};

export default Search;