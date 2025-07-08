import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import Loading from "../../Componentes/Loading.jsx";
import { FaArrowLeft } from "react-icons/fa";
import { useTheme } from "../Store/theme.jsx";
import styles from "./MealsDetails.module.css";

// Setup Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function MealsDetail() {
  const [meal, setMeal] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { name } = useParams(); // route param from /meals/:name
  const navigate = useNavigate();

  const handleImageError = (e) => {
    e.target.src = "/assets/default-meal.jpg";
  };
  const { theme } = useTheme(); // get current theme

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        // Fetch meal data directly from Supabase
        const { data, error } = await supabase
          .from("foods")
          .select("*")
          .eq("name", decodeURIComponent(name)) // case-sensitive by default
          .single(); // we expect only one match

        if (error) throw error;
        setMeal(data);

        // Get public image URL from Supabase Storage
        if (data.image) {
          const { data: imgData, error: imgError } = supabase.storage
            .from("meal-images") // your bucket name
            .getPublicUrl(data.image); // image filename

          if (imgError) throw imgError;
          setImageUrl(imgData.publicUrl);
        }
      } catch (err) {
        console.error(err.message);
        setError("Meal not found or failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [name]);

  if (loading) return <Loading />;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!meal) return <p>Meal not found.</p>;

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <button className={styles.backButton} onClick={() => navigate("/meals")}>
        <FaArrowLeft /> Back
      </button>
      <h1 className={styles.title}>{meal.name}</h1>
      {imageUrl && (
        <div className={styles.imageContainer}>
          <img
            src={
              meal.image.startsWith("http")
                ? meal.image
                : `https://food-app-d8r3.onrender.com/meals/${meal.image}`
            }
            alt={meal.name}
            className={styles.image}
            onError={handleImageError}
          />
        </div>
      )}

      <p className={styles.description}>{meal.description}</p>
      <p className={styles.price}>Price: ${meal.price}</p>
      <button className={styles.backButton} onClick={() => navigate("/meals")}>
        Back to Meals
      </button>
    </div>
  );
}
