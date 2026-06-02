Feature: Página no encontrada

    Scenario: El usuario visita una ruta inexistente
        Given el usuario navega a "/ruta-inexistente"
        Then debería ver el texto "No hemos encontrado la página que buscas"