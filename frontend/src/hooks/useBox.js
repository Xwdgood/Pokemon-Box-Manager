import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useBox(boxNumber) {
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [box, setBox] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  async function fetchBox() {
    // TODO Complete this function as per the README instructions
  }

  // TODO Use useEffect to fetch the box data when the component mounts or boxNumber changes

  async function swap(source, target) {
    // TODO Complete this function as per the README instructions
  }

  return { isPending, error, box, hasNext, hasPrevious, swap };
}
