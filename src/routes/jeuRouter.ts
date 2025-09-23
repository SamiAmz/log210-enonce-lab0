import { Router, Request, Response, NextFunction } from 'express';
import { JeuDeDes } from '../core/jeuDeDes';
import { InvalidParameterError } from '../core/errors/invalidParameterError';

export class JeuRouter {
  private _router: Router;
  private _controleurJeu: JeuDeDes;

  get controleurJeu() {
    return this._controleurJeu;
  }

  get router() {
    return this._router;
  }

  constructor() {
    this._controleurJeu = new JeuDeDes();
    this._router = Router();
    this.init();
  }

  public getJoueurs(req: Request, res: Response, next: NextFunction) {
    try {
      const joueurs = this._controleurJeu.joueurs; // déjà un tableau
      const parsedJoueurs = JSON.parse(joueurs);
      res.status(200).json(parsedJoueurs);
    } catch (error) {
      this._errorCode500(error, req, res);
    }
  }

  public redemarrerJeu(req: Request, res: Response, next: NextFunction) {
    try {
      this._controleurJeu.redemarrerJeu();
      req.flash('info', `Le jeu a été redémarré.`);
      res.status(200).json({ message: 'Success' });
    } catch (error) {
      this._errorCode500(error, req, res);
    }
  }

  public demarrerJeu(req: Request, res: Response, next: NextFunction) {
    const nom = req.body.nom;
    try {
      if (!nom) {
        throw new InvalidParameterError('Le paramètre nom est absent');
      }
      const joueur = this._controleurJeu.demarrerJeu(nom);
      const joueurObj = JSON.parse(joueur);
      req.flash('info', `Nouveau jeu pour ${nom}`);
      res.status(201).send({
        message: 'Success',
        status: res.status,
        joueur: joueurObj
      });
    } catch (error) {
      this._errorCode500(error, req, res);
    }
  }

  public jouer(req: Request, res: Response, next: NextFunction) {
    const nom = req.params.nom;
    try {
      const resultat = this._controleurJeu.jouer(nom);
      const resultatObj = JSON.parse(resultat);
      const key = resultatObj.somme <= 10 ? 'win' : 'info';
      req.flash(key, `Résultat pour ${nom}: ${resultatObj.v1} + ${resultatObj.v2} + ${resultatObj.v3} = ${resultatObj.somme}`);
      res.status(200).send({
        message: 'Success',
        status: res.status,
        resultat
      });
    } catch (error) {
      this._errorCode500(error, req, res);
    }
  }

  public terminerJeu(req: Request, res: Response, next: NextFunction) {
    const nom = req.params.nom;
    try {
      const resultat = this._controleurJeu.terminerJeu(nom);
      req.flash('info', `Jeu terminé pour ${nom}`);
      res.status(200).send({
        message: 'Success',
        status: res.status,
        resultat
      });
    } catch (error) {
      this._errorCode500(error, req, res);
    }
  }

  private _errorCode500(error: any, req: Request, res: Response) {
    req.flash('error', error.message);
    res.status(error.code || 500).json({ error: error.toString() });
  }

  init() {
    this._router.post('/demarrerJeu', this.demarrerJeu.bind(this));
    this._router.get('/jouer/:nom', this.jouer.bind(this));
    this._router.get('/terminerJeu/:nom', this.terminerJeu.bind(this));
    this._router.get('/joueurs', this.getJoueurs.bind(this));
    this._router.get('/redemarrerJeu', this.redemarrerJeu.bind(this));
  }
}

export const jeuRoutes = new JeuRouter();
jeuRoutes.init();
