/// <reference types="Cypress" />
import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

Given('el usuario navega a la home', () => {
  cy.visit('/');
});

Then('debería ver el logo de la aplicación', () => {
  cy.get('header img[alt="Logo"]').should('be.visible');
});

Then('debería ver el enlace "Buscador"', () => {
  cy.get('a.buscador').should('be.visible').and('contain', 'Buscador');
});

Then('debería ver el enlace "Mapa"', () => {
  cy.get('a.mapa').should('be.visible').and('contain', 'Mapa');
});

Then('debería ver el enlace "Quienes somos"', () => {
  cy.get('a.about').should('be.visible').and('contain', 'Quienes somos');
});

Then('debería ver el enlace "Login"', () => {
  cy.get('a.login').should('be.visible').and('contain', 'Login');
});

Then('debería ver el enlace "Registro"', () => {
  cy.get('a.registro').should('be.visible').and('contain', 'Registro');
});
