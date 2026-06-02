import FuelMap from './FuelMap';
import './Header.css';

function Historico({ stations }) {
  return (
    <div>
      <section className='station-detail'>
        <h1>Histórico de precios</h1>
        <p>
          Selecciona una estación en el mapa para abrir su detalle y ver el histórico de precios con predicción IA.
        </p>
      </section>
      <FuelMap stations={stations} />
    </div>
  );
}

export default Historico;
