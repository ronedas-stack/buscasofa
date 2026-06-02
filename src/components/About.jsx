import React from 'react'
import './About.css'

const About = () => {
    return (
    <div className="about-container">
        <h1>Acerca de nosotros</h1>
        <div id="info">
            <p>Somos el equipo nº 5</p>
            <ul className="about-list">
              <li><strong>Francisco Manuel Villarraso Macías</strong>: Ha creado el GitHub del proyecto, ha eliminado la prueba de quienes somos y ha ayudado a los compañeros en los problemas que se han encontrado en la generación de la aplicación, y ha realizado el push del último punto.</li>
              <li><strong>Gabriela Alejandra Loero Rodríguez</strong>: Ha realizado el componente para la prueba de la sección about, y ha modificado los ficheros correspondientes para que aparezcan los nombres.</li>
              <li><strong>Javier Almagro Camacho</strong>: Ha creado mediante el uso de la IA la última funcionalidad y ha desarrollado la prueba correspondiente con la ayuda del resto de compañeros.</li>
              <li><strong>Miguel Serra Molina</strong>: Ha corregido el resto de problemas que se encontraban en el fichero inicial así como la reparación del notFound.</li>
            </ul>
        </div>
    </div>

    )
}

export default About