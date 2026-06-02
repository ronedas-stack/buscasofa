/// <reference types="Cypress" />
import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

// Given steps
Given('el usuario navega a la home', () => {
  cy.visit('/');
});

Given('el usuario navega a la página Histórico', () => {
  cy.visit('/historico');
  cy.get('.leaflet-container', { timeout: 8000 }).should('be.visible');
});

Given('el usuario navega a los detalles de una estación desde Histórico', () => {
  cy.visit('/historico');
  cy.get('.leaflet-container', { timeout: 8000 }).should('be.visible');
  cy.get('.leaflet-marker-icon', { timeout: 8000 }).should('have.length.greaterThan', 1);
  cy.get('.leaflet-marker-icon').eq(1).click({ force: true });
  cy.url().should('include', '/station/');
});

// Then steps
Then('debería estar en la página de Histórico', () => {
  cy.url().should('include', '/historico');
});

Then('debería ver el mapa cargado', () => {
  cy.get('.leaflet-container', { timeout: 8000 }).should('be.visible');
  cy.get('.leaflet-marker-icon', { timeout: 8000 }).should('have.length.greaterThan', 0);
});

Then('debería ver el título "Histórico de precios"', () => {
  cy.contains('h1', 'Histórico de precios').should('be.visible');
});

Then('hace clic en el enlace "Histórico"', () => {
  cy.contains('a', 'Histórico').click({ force: true });
});

Then('hace clic en una estación en el mapa', () => {
  cy.get('.leaflet-marker-icon', { timeout: 8000 }).should('have.length.greaterThan', 1);
  cy.get('.leaflet-marker-icon').eq(1).click({ force: true });
});

Then('debería ver los detalles de la estación', () => {
  cy.contains('h1', 'Detalles de la Estación').should('exist');
  cy.contains('strong', 'Dirección').should('exist');
  cy.contains('strong', 'Municipio').should('exist');
});

Then('debería ver la sección "Histórico de precios"', () => {
  cy.contains('h3', 'Histórico de precios').should('exist');
});

Then('debería ver una tabla con Gasóleo A', () => {
  cy.contains('h4', 'Gasóleo A').should('exist');
  cy.contains('h4', 'Gasóleo A').parent().find('table tbody tr').should('have.length.greaterThan', 0);
});

Then('debería ver una tabla con Gasolina 95 E5', () => {
  cy.contains('h4', 'Gasolina 95 E5').should('exist');
  cy.contains('h4', 'Gasolina 95 E5').parent().find('table tbody tr').should('have.length.greaterThan', 0);
});

Then('debería ver el botón "Predicción IA"', () => {
  cy.get('.prediction-button', { timeout: 10000 }).should('be.visible');
  cy.get('.prediction-button').should('contain', 'Predicción IA').and('not.be.disabled');
});

Then('hace clic en el botón "Predicción IA"', () => {
  cy.get('.prediction-button', { timeout: 10000 }).should('be.visible').and('not.be.disabled').click({ force: true });
});

Then('debería ver un mensaje de predicción', () => {
  cy.get('.prediction-message', { timeout: 10000 }).should('be.visible');
});

Then('el mensaje debería contener el porcentaje de probabilidad', () => {
  cy.get('.prediction-message').invoke('text').should('match', /\d+%/);
});

Then('el mensaje debería indicar si subirá o bajará el precio', () => {
  cy.get('.prediction-message').then(($message) => {
    const text = $message.text();
    expect(text).to.match(/subir|bajar|subirá|bajará/);
  });
});

Then('debería ver un mensaje que incluya la estimación de cambio en céntimos', () => {
  cy.get('.prediction-message').should('contain', 'céntimos');
});

Then('el mensaje debería indicar los próximos 3 días', () => {
  cy.get('.prediction-message').should('contain', '3 días');
});

Then('debería mostrar si subirá o bajará el precio del gasóleo', () => {
  cy.get('.prediction-message').then(($message) => {
    const text = $message.text();
    expect(text).to.match(/gasóleo.*(?:subir|bajar|subirá|bajará)/i);
  });
});
