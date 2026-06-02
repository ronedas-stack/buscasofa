describe('Visualización de precios de combustibles en gasolineras españolas', () => {
  beforeEach(() => {
    cy.visit('/lista');
  });

  it('El usuario ve el componente de precios de combustibles', () => {
    cy.contains('Precios de combustibles').should('exist');
  });

  it('La aplicación muestra una tabla con los precios de varias gasolineras', () => {
    cy.intercept('GET', '**/EstacionesTerrestres/**').as('getFuelPrices');
    cy.visit('/');
    cy.wait('@getFuelPrices');
    cy.get('table').should('exist');
    cy.get('tbody tr').should('have.length.greaterThan', 0);
  });

  it('La aplicación muestra un mensaje de error si la API falla', () => {
    cy.intercept('GET', '**/EstacionesTerrestres/**', { statusCode: 500 }).as('getFuelPricesError');
    cy.visit('/');
    cy.wait('@getFuelPricesError');
    cy.contains('Error').should('exist');
  });

  it('El usuario puede ver el nombre, dirección, municipio y precios de cada gasolinera', () => {
    cy.intercept('GET', '**/EstacionesTerrestres/**').as('getFuelPrices');
    cy.visit('/');
    cy.wait('@getFuelPrices');
    cy.get('tbody tr').first().within(() => {
      cy.get('td').eq(0).should('not.be.empty'); // Nombre
      cy.get('td').eq(1).should('not.be.empty'); // Dirección
      cy.get('td').eq(2).should('not.be.empty'); // Municipio
      cy.get('td').eq(3).should('not.be.empty'); // Gasóleo A
      cy.get('td').eq(4).should('not.be.empty'); // Gasolina 95 E5
    });
  });

  it('El usuario ve un mensaje de "Cargando precios..." mientras se descargan los datos', () => {
    cy.intercept('GET', '**/EstacionesTerrestres/**', (req) => {
      // Simula un retraso en la respuesta
      req.on('response', (res) => {
        res.setDelay(1000);
      });
    }).as('getFuelPrices');
    cy.visit('/');
    cy.contains('Cargando...').should('exist');
    cy.wait('@getFuelPrices');
  });
});