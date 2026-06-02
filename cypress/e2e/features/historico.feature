Feature: Histórico de Precios

  Scenario: El usuario accede a la pestaña Histórico y ve el mapa
    Given el usuario navega a la home
    Then hace clic en el enlace "Histórico"
    And debería estar en la página de Histórico
    And debería ver el mapa cargado
    And debería ver el título "Histórico de precios"

  Scenario: El usuario selecciona una estación y ve el histórico de precios
    Given el usuario navega a la página Histórico
    Then hace clic en una estación en el mapa
    And debería ver los detalles de la estación
    And debería ver la sección "Histórico de precios"
    And debería ver una tabla con Gasóleo A
    And debería ver una tabla con Gasolina 95 E5

  Scenario: El usuario ve el botón Predicción IA
    Given el usuario navega a los detalles de una estación desde Histórico
    Then debería ver el botón "Predicción IA"
    And hace clic en el botón "Predicción IA"
    And debería ver un mensaje de predicción
    And el mensaje debería contener el porcentaje de probabilidad
    And el mensaje debería indicar si subirá o bajará el precio

  Scenario: El usuario ve predicción de cambio de precio en 3 días
    Given el usuario navega a los detalles de una estación desde Histórico
    Then hace clic en el botón "Predicción IA"
    And debería ver un mensaje que incluya la estimación de cambio en céntimos
    And el mensaje debería indicar los próximos 3 días
    And debería mostrar si subirá o bajará el precio del gasóleo
