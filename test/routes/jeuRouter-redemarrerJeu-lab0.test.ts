// Vous devez insérer les nouveaux tests ici
import { assert } from 'console';
import 'jest-extended';
import request from 'supertest';
import app from '../../src/app'; // ajuste le chemin selon ton projet




//Creation de la suite de tests
describe('GET /api/v1/jeu/redemarrerJeu', () => {

  beforeEach(async () => {
    // Clear any existing players before each test
    await request(app).get('/api/v1/jeu/redemarrerJeu');
  });

it('devrait retourner 200 et du JSON', async () => {
  //Creation de 2 joueurs avant le test 
  await request(app).post('/api/v1/jeu/demarrerJeu').send({ nom: 'Alice' });
  await request(app).post('/api/v1/jeu/demarrerJeu').send({ nom: 'Bob' });
  const response = await request(app).get('/api/v1/jeu/redemarrerJeu');
  expect(response.status).toBe(200);
  expect(response.headers['content-type']).toMatch(/json/);
});

it('devrait supprimer tous les joueurs', async () => {
  //Creation de 2 joueurs avant le test 
  await request(app).post('/api/v1/jeu/demarrerJeu').send({ nom: 'Alice' });
  await request(app).post('/api/v1/jeu/demarrerJeu').send({ nom: 'Bob' });
  await request(app).get('/api/v1/jeu/redemarrerJeu');
  const joueursResponse = await request(app).get('/api/v1/jeu/joueurs');
  expect(joueursResponse.body.length).toBe(0);
});

it('devrait retourner 404 pour jouer après redemarrerJeu', async () => {
  //Creation d'un joueur avant le test 
  await request(app).post('/api/v1/jeu/demarrerJeu').send({ nom: 'Alice' });
  await request(app).get('/api/v1/jeu/redemarrerJeu');
  const response = await request(app).get('/api/v1/jeu/jouer/Alice');
  expect(response.status).toBe(404);
});
});
