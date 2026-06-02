/// <reference types="Cypress" />
import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

Given('el usuario navega a la home', () => {
  cy.visit('/');
});

Then('debería ver {string} en el footer', (nombre) => {
  cy.contains('Miembros del equipo:').parent().should('contain', nombre);
});
