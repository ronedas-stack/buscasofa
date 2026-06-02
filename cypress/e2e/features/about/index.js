/// <reference types="Cypress" />
import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

Given('el usuario navega a la página About', () => {
  cy.visit('/about');
});

Then('debería ver el número de equipo {string}', (numero) => {
  cy.contains(new RegExp(`equipo.*${numero}|número.*${numero}|nº.*${numero}`, 'i')).should('exist');
});

Then('debería ver {string} en About', (nombre) => {
  cy.contains(nombre).should('exist');
});

Then('debería ver una descripción breve de cada miembro', () => {
  const nombres = [
    'Francisco Manuel Villarraso Macías',
    'Gabriela Alejandra Loero Rodríguez',
    'Javier Almagro Camacho',
    'Miguel Serra Molina'
  ];

  nombres.forEach((nombre) => {
    cy.contains(nombre).parents('div, section, article, li, p').first().invoke('text').then((texto) => {
      const contenidoExtra = texto.replace(nombre, '').trim();
      expect(contenidoExtra.length).to.be.greaterThan(0);
    });
  });
});
