// Vous devez insérer les nouveaux tests ici
import { assert } from 'console';
import 'jest-extended';
import request from 'supertest';
import app from '../../src/app'; // ajuste le chemin selon ton projet




//Creation de la suite de tests
describe('GET /api/v1/jeu/redemarrerJeu', () => {

  beforeAll(async () => {
    await request(app).post('/api/v1/jeu/demarrerJeu').send({ nom: 'Alice' });
    await request(app).post('/api/v1/jeu/demarrerJeu').send({ nom: 'Bob' });
  });

it('devrait retourner 200 et du JSON', async () => {
  //Creation de 2 joueurs avant le test 
  const response = await request(app).get('/api/v1/jeu/redemarrerJeu');
  expect(response.status).toBe(200);
  expect(response.headers['content-type']).toMatch(/json/);
});

it('devrait supprimer tous les joueurs', async () => {
  const joueursResponse = await request(app).get('/api/v1/jeu/joueurs');
  expect(joueursResponse.body.length).toBe(0);
});
});
