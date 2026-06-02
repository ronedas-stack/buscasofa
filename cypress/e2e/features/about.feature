Feature: About

  Scenario: El usuario ve los nombres del equipo, el número de equipo y las descripciones en About
    Given el usuario navega a la página About
    Then debería ver el número de equipo "5"
    And debería ver "Francisco Manuel Villarraso Macías" en About
    And debería ver "Gabriela Alejandra Loero Rodríguez" en About
    And debería ver "Javier Almagro Camacho" en About
    And debería ver "Miguel Serra Molina" en About
    And debería ver una descripción breve de cada miembro
