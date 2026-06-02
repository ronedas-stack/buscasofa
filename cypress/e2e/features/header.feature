Feature: Header

  Scenario: El usuario no autenticado ve todos los elementos del Header
    Given el usuario navega a la home
    Then debería ver el logo de la aplicación
    And debería ver el enlace "Buscador"
    And debería ver el enlace "Mapa"
    And debería ver el enlace "Quienes somos"
    And debería ver el enlace "Login"
    And debería ver el enlace "Registro"

