// src/hooks/useMeals.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabaseClient"; // make sure this is configured

export const useMeals = () => {
  return useQuery({
    queryKey: ["meals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("foods")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
};
