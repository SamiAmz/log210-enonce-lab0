import 'jest-extended';
import { JeuDeDes } from '../../src/core/jeuDeDes';

describe('JeuDeDesTest', () => {
  let controller: JeuDeDes;

  beforeEach(() => {
    controller = new JeuDeDes();
  });

  it('demarrerJeux et jouer', () => {
    const result = controller.demarrerJeu('yvan');
    expect(result).toEqual("{\"nom\":\"yvan\",\"lancers\":0,\"lancersGagnes\":0}");

    expect(() => controller.demarrerJeu('yvan')).toThrow("Joueur 'yvan' existe déjà.");

    const resultat = JSON.parse(controller.jouer('yvan'));
    expect(resultat.lancers).toEqual(1);
    expect(resultat.v1).toBeWithin(1, 7);
    expect(resultat.v2).toBeWithin(1, 7);
    expect(resultat.v3).toBeWithin(1, 7);
    expect(resultat.somme).toBe(resultat.v1 + resultat.v2 + resultat.v3);

    const somme = controller.brasser();
    expect(somme).toBeWithin(3, 19);

    const joueurs = JSON.parse(controller.joueurs);
    expect(joueurs[0].lancers).toEqual(1);
  });
});
