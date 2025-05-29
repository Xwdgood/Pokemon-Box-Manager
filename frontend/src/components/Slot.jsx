import "./Slot.css";

export default function Slot({ pokemon }) {
  if (!pokemon) {
    return <div className="slot"></div>;
  }
  
  const imageUrl = pokemon.isShiny ? pokemon.shinyImageUrl : pokemon.normalImageUrl;
  
  return (
    <div className="slot">
      <img src={imageUrl} alt={pokemon.name} />
      <p>{pokemon.isShiny && '✨'}{pokemon.name}</p>
    </div>
  );
}
