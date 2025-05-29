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
    <div style={{ padding: '20px', minHeight: '100vh' }}>
      <header style={{ 
        textAlign: 'center', 
        marginBottom: '30px', 
        borderBottom: '2px solid #6a4c93', 
        paddingBottom: '15px',
        background: 'linear-gradient(135deg, rgba(42, 42, 62, 0.6), rgba(30, 30, 47, 0.8))',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4), 0 0 30px rgba(106, 76, 147, 0.2)'
      }}>
        <h1 style={{ 
          color: '#ffd700', 
          fontSize: '2.5rem', 
          margin: '10px 0',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.3)',
          fontWeight: 'bold',
          letterSpacing: '2px'
        }}>
          🌙 Wenduo's Dark Pokemon Box Manager ⚡
        </h1>
      </header>
      
      <h2 style={{ 
        textAlign: 'center', 
        color: '#ffffff',
        fontSize: '1.8rem',
        textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
        marginBottom: '25px'
      }}>
        📦 Box #{boxNumber}
      </h2>
      
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button 
          onClick={handlePrevious} 
          disabled={!hasPrevious}
          style={{ 
            marginRight: '15px', 
            padding: '12px 24px',
            background: 'linear-gradient(145deg, #6a4c93, #553a7a)',
            border: '2px solid #ffd700',
            borderRadius: '25px',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: hasPrevious ? 'pointer' : 'not-allowed',
            opacity: hasPrevious ? 1 : 0.5,
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 215, 0, 0.2)',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'
          }}
          onMouseEnter={(e) => {
            if (hasPrevious) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (hasPrevious) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 215, 0, 0.2)';
            }
          }}
        >
          ⬅️ Previous
        </button>
        <button 
          onClick={handleNext} 
          disabled={!hasNext}
          style={{ 
            padding: '12px 24px',
            background: 'linear-gradient(145deg, #6a4c93, #553a7a)',
            border: '2px solid #ffd700',
            borderRadius: '25px',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: hasNext ? 'pointer' : 'not-allowed',
            opacity: hasNext ? 1 : 0.5,
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 215, 0, 0.2)',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'
          }}
          onMouseEnter={(e) => {
            if (hasNext) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (hasNext) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 215, 0, 0.2)';
            }
          }}
        >
          Next ➡️
        </button>
      </div>
      
      {isPending && (
        <p style={{ 
          textAlign: 'center',
          color: '#ffd700',
          fontSize: '18px',
          textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)'
        }}>
          ⚡ Loading...
        </p>
      )}
      
      {error && (
        <p style={{ 
          textAlign: 'center', 
          color: '#ff6b6b',
          fontSize: '16px',
          textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
          background: 'rgba(255, 107, 107, 0.1)',
          padding: '10px',
          borderRadius: '10px',
          border: '1px solid #ff6b6b'
        }}>
          ❌ {error.message}
        </p>
      )}
      
      {box && <Box box={box} onSwap={handleSwap} />}
    </div>
  );
}
