import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export function useBox(boxNumber) {
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [box, setBox] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  async function fetchBox() {
    try {
      setIsPending(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/api/boxes/${boxNumber}`);
      
      // Set box data
      setBox(response.data);
      
      // Set navigation flags based on response headers
      setHasPrevious(!!response.headers.get("previous-box"));
      setHasNext(!!response.headers.get("next-box"));
      
    } catch (error) {
      setBox(null);
      setHasNext(false);
      setHasPrevious(false);
      setError(error);
    } finally {
      setIsPending(false);
    }
  }

  // Fetch box data when component mounts or boxNumber changes
  useEffect(() => {
    if (boxNumber) {
      fetchBox();
    }
  }, [boxNumber]);

  async function swap(source, target) {
    try {
      const data = {
        swap: {
          source,
          target,
        },
      };
      
      await axios.patch(`${API_BASE_URL}/api/boxes`, data);
      
      // If either source or target box number equals current boxNumber, refresh data
      if (source.boxNumber === parseInt(boxNumber) || target.boxNumber === parseInt(boxNumber)) {
        await fetchBox();
      }
      
    } catch (error) {
      setError(error);
    }
  }

  return { isPending, error, box, hasNext, hasPrevious, swap };
}
