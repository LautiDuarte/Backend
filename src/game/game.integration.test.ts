import request from 'supertest';
import express from 'express';
import { gameRouter } from '../../src/game/game.routes.js';

// 🔑 Mockeamos middlewares de auth para que no bloqueen las requests
jest.mock('../../src/shared/validate-token.js', () => ({
  validateToken: (_req: any, _res: any, next: any) => next(),
}));

jest.mock('../../src/shared/validate-role.js', () => ({
  checkAdmin: (_req: any, _res: any, next: any) => next(),
}));

// 🔑 Mockeamos el ORM
jest.mock('../../src/shared/db/orm.js', () => ({
  orm: {
    em: {
      find: jest.fn(),
    },
  },
}));

import { orm } from '../../src/shared/db/orm.js';

const app = express();
app.use(express.json());
app.use('/api/game', gameRouter);

describe('Integration Test - /api/game', () => {
  beforeEach(() => {
    (orm.em.find as jest.Mock).mockClear();
  });

  it('should return list of games (200)', async () => {
    // Arrange
    const mockGames = [
      { id: 1, name: 'Valorant', description: 'FPS', imageUrl: 'valorant.png' },
      { id: 2, name: 'LoL', description: 'MOBA', imageUrl: 'lol.png' },
    ];
    (orm.em.find as jest.Mock).mockResolvedValue(mockGames);

    // Act
    const res = await request(app).get('/api/game');

    // Assert
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockGames);
    expect(orm.em.find).toHaveBeenCalledWith(
      expect.anything(),
      {},
      { populate: ['gameType', 'competitions'] }
    );
  });

  it('should return 500 if database fails', async () => {
    // Arrange
    (orm.em.find as jest.Mock).mockRejectedValue(new Error('DB error'));

    // Act
    const res = await request(app).get('/api/game');

    // Assert
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'DB error' });
  });
});
