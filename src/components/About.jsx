import React from 'react'
import './About.css'

const About = () => {
    return (
    <div className="about-container">
        <h1>Acerca de nosotros</h1>
        <div id="info">
            <p>Somos el equipo nº 5</p>
            <ul className="about-list">
              <li><strong>Francisco Manuel Villarraso Macías</strong> Ha creado el GitHub del proyecto, ha eliminado la prueba de quienes somos y ha ayudado a los compañeros en los problemas que se han encontrado en la generación de la aplicación, y ha realizado el push del último punto.</li>
              <li><strong>Gabriela Alejandra Loero Rodríguez</strong> Ha realizado el componente para la prueba de la sección Footer, y ha modificado los ficheros correspondientes para que aparezcan los nombres.Y junto con Javier ha realizado el About.</li>
              <li><strong>Javier Almagro Camacho</strong>Creación de la parte del about y ayuda en la última parte.</li>
              <li><strong>Miguel Serra Molina</strong> Ha corregido el resto de problemas que se encontraban en el fichero inicial así como la reparación del notFound.</li>
            </ul>
        </div>
    </div>

    )
}

export default About