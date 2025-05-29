import { useParams, useNavigate } from "react-router-dom";
import { useBox } from "../hooks/useBox.js";
import Box from "./Box.jsx";

export default function BoxPage() {
  const { boxNumber } = useParams();
  const navigate = useNavigate();
  const { box, isPending, hasNext, hasPrevious, error } = useBox(boxNumber);
  
  const handlePrevious = () => {
    const prevBoxNumber = parseInt(boxNumber) - 1;
    navigate(`/boxes/${prevBoxNumber}`);
  };
  
  const handleNext = () => {
    const nextBoxNumber = parseInt(boxNumber) + 1;
    navigate(`/boxes/${nextBoxNumber}`);
  };
  
  return (
    <div>
      <h1>Box #{boxNumber}</h1>
      
      <div>
        <button 
          onClick={handlePrevious} 
          disabled={!hasPrevious}
        >
          Previous
        </button>
        <button 
          onClick={handleNext} 
          disabled={!hasNext}
        >
          Next
        </button>
      </div>
      
      {isPending && <p>Loading</p>}
      
      {error && <p>{error.message}</p>}
      
      {box && <Box box={box} />}
    </div>
  );
}
