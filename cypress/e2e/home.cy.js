/// <reference types="cypress" />
// // Pruebas de la home de la aplicación

describe('Visualización de la home de la aplicación', () => {
    beforeEach(() => {
        cy.visit('/')
            // .wait(4000); // esperar para que lapágina se renderice completmente si la conexión es lenta
    });

    it('El title de la web es Buscasofa', () => {
        cy.title().should('eq', 'Buscasofa');
    });

    it('El usuario ve el título de la aplicación', () => {
        cy.get('h1')
            .should('exist')
            .contains('Buscasofa');
    });

    it('El usuaro ve la descripción de la aplicación en la home', () => {
        cy.get('.description')
            .should('exist')
            .contains('El mejor buscador de precios de combustible de España');
    });

    it('El usuaro ve una sección con el resumen de precios a nivel nacional', () => {
        cy.get('h2.resumen-nacional')
            .should('exist')
            .should('have.text', "Resumen nacional de precios");
        cy.get('table.resumen-nacional')
            .should('exist')
            .find('tbody')
            .find('tr')
            .should('have.length', 2);  // Resumen de dos tipos de combustible

    });


    it('El usuaro ve una sección con el resumen de precios por comunidad autónoma', () => {
        cy.get('h2.resumen-comunidades')
            .should('exist')
            .should('have.text', "Resumen por comunidad autónoma");
        cy.get('table.resumen-comunidades')
            .should('exist')
            .find('tbody')
            .find('tr')
            .should('have.length', 19);  // 19 regiones en las filas

    });
});