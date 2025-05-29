import { useParams, useNavigate } from "react-router-dom";
import { useBox } from "../hooks/useBox.js";
import Box from "./Box.jsx";

export default function BoxPage() {
  const { boxNumber } = useParams();
  const navigate = useNavigate();
  const { box, isPending, hasNext, hasPrevious, error, swap } = useBox(boxNumber);
  
  const handlePrevious = () => {
    const prevBoxNumber = parseInt(boxNumber) - 1;
    navigate(`/boxes/${prevBoxNumber}`);
  };
  
  const handleNext = () => {
    const nextBoxNumber = parseInt(boxNumber) + 1;
    navigate(`/boxes/${nextBoxNumber}`);
  };

  const handleSwap = (source, target) => {
    swap(source, target);
  };
  
  return (
    <div>
      <header style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
        <h1 style={{ color: '#333', fontSize: '2rem', margin: '10px 0' }}>🎮 Wenduo's Pokemon Box Manager</h1>
      </header>
      
      <h2 style={{ textAlign: 'center', color: '#666' }}>Box #{boxNumber}</h2>
      
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button 
          onClick={handlePrevious} 
          disabled={!hasPrevious}
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Previous
        </button>
        <button 
          onClick={handleNext} 
          disabled={!hasNext}
          style={{ padding: '8px 16px' }}
        >
          Next
        </button>
      </div>
      
      {isPending && <p style={{ textAlign: 'center' }}>Loading</p>}
      
      {error && <p style={{ textAlign: 'center', color: 'red' }}>{error.message}</p>}
      
      {box && <Box box={box} onSwap={handleSwap} />}
    </div>
  );
}
