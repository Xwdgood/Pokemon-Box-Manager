import { useDrag, useDrop } from "react-dnd";
import "./Slot.css";

const ItemType = "POKEMON";

export default function Slot({ pokemon, boxNumber, slotNumber, onSwap }) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: pokemon ? { 
      pokemon, 
      source: { boxNumber, slotNumber }
    } : null,
    canDrag: !!pokemon,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    drop: (item) => {
      if (item.source.boxNumber !== boxNumber || item.source.slotNumber !== slotNumber) {
        onSwap(item.source, { boxNumber, slotNumber });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const ref = (node) => {
    drag(drop(node));
  };

  if (!pokemon) {
    return (
      <div 
        ref={ref} 
        className={`slot empty ${isOver ? 'slot-over' : ''}`}
      ></div>
    );
  }
  
  const imageUrl = pokemon.isShiny ? pokemon.shinyImageUrl : pokemon.normalImageUrl;
  
  return (
    <div 
      ref={ref}
      className={`slot ${isDragging ? 'slot-dragging' : ''} ${isOver ? 'slot-over' : ''}`}
    >
      <img src={imageUrl} alt={pokemon.name} />
      <p>{pokemon.isShiny && '✨'}{pokemon.name}</p>
    </div>
  );
}
