import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

interface HistoryItem {
  id: string;
  food: string;
  searched_at: string;
}

const API_BASE = import.meta.env.VITE_API_BASE || "https://your-vercel-api-url";

const History: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { getToken, userId } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!getToken || !userId) return;
        const token = await getToken();
        const res = await axios.get(`${API_BASE}/api/history`, {
          params: { user_id: userId },
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(res.data);
      } catch (err: any) {
        setError("Failed to fetch history.");
      }
    };
    fetchHistory();
  }, [getToken, userId]);

  return (
    <div>
      <h2>Search History</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <ul>
        {history.map(item => (
          <li key={item.id}>
            {item.food} (searched at {item.searched_at ? new Date(item.searched_at).toLocaleString() : "Unknown"})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;