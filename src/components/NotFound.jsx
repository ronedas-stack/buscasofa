import './NotFound.css';

function NotFound() {
  return (
    <main className="notfound-page">
      <section className="notfound-content">
        <h1>No hemos encontrado la página que buscas</h1>
        <p>La ruta a la que intentas acceder no existe. Puedes volver a la página principal.</p>
        <a href="/">Volver al inicio</a>
      </section>
    </main>
  )
}

export default NotFound;
