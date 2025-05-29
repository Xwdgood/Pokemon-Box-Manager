import Slot from "./Slot.jsx";
import "./Box.css";

export default function Box({ box, onSwap }) {
  if (!box) {
    return null;
  }
  
  return (
    <div className="box">
      {box.pokemon.map((pokemon, index) => (
        <Slot 
          key={index} 
          pokemon={pokemon} 
          boxNumber={box.boxNumber}
          slotNumber={index + 1}
          onSwap={onSwap}
        />
      ))}
    </div>
  );
}
