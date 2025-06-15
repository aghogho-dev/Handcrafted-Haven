import { FaStar } from "react-icons/fa";

type StarRatingProps = {
  rating: number;
};

export default function StarRating({ rating }: StarRatingProps) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[...Array(5)].map((_, i) => (
        <FaStar key={i} color={i < Math.round(rating) ? "#facc15" : "#d1d5db"} />
      ))}
    </div>
  );
}
