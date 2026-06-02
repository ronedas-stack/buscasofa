Feature: Footer

  Scenario: El usuario ve los nombres del equipo en el footer
    Given el usuario navega a la home
    Then debería ver "Francisco Manuel Villarraso Macías" en el footer
    And debería ver "Gabriela Alejandra Loero Rodríguez" en el footer
    And debería ver "Javier Almagro Camacho" en el footer
    And debería ver "Miguel Serra Molina" en el footer
