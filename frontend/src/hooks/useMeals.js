// src/hooks/useMeals.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Accepts page, limit, and category as params
export const useMeals = (page = 1, limit = 8, category = "All") => {
  return useQuery({
    queryKey: ["meals", page, limit, category],
    queryFn: async () => {
      const res = await axios.get(
        import.meta.env.VITE_API_URL || "http://localhost:5000/meals",
        {
          params: { page, limit, category },
        }
      );
      return res.data; // { items, totalPages, totalItems, currentPage }
    },
    keepPreviousData: true, // keep old data while fetching new
    staleTime: 1000 * 60 * 5, // cache fresh for 5 minutes
    cacheTime: 1000 * 60 * 30, // keep in cache for 30 minutes
    refetchOnWindowFocus: false, // don't refetch on window focus
  });
};
