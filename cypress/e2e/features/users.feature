Feature: Registro y Login de usuario

  Scenario: Registro exitoso de un nuevo usuario
    Given el usuario navega a la página de registro
    When completa el formulario de registro con datos válidos
    And envía el formulario de registro
    Then ve un mensaje de confirmación de registro

  Scenario: Login exitoso de un usuario registrado
    Given el usuario navega a la página de login
    When completa el formulario de login con credenciales válidas
    And envía el formulario de login
    Then ve un mensaje de bienvenida