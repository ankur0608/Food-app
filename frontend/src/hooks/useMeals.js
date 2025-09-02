// src/hooks/useMeals.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useMeals = () => {
  return useQuery({
    queryKey: ["meals"],
    queryFn: async () => {
      const res = await axios.get("https://food-app-d8r3.onrender.com/meals");
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    cacheTime: 1000 * 60 * 30, // keep in cache for 30 minutes
    refetchOnWindowFocus: false, // don't refetch every time window is focused
  });
};
