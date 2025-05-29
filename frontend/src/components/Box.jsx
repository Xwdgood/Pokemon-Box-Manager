import Slot from "./Slot.jsx";
import "./Box.css";

export default function Box({ box }) {
  if (!box) {
    return null;
  }
  
  return (
    <div className="box">
      {box.pokemon.map((pokemon, index) => (
        <Slot key={index} pokemon={pokemon} />
      ))}
    </div>
  );
}
