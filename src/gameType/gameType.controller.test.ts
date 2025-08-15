import { findAll } from './gameType.controller.js';
import { orm } from '../shared/db/orm.js';
import { Request, Response } from 'express';

jest.mock('../shared/db/orm.js', () => ({
  orm: {
    em: {
      find: jest.fn(),
    },
  },
}));

describe('GameType Controller - findAll', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;

  beforeEach(() => {
    (orm.em.find as jest.Mock).mockClear();
    mockRequest = {};
    responseJson = jest.fn();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: responseJson,
    };
  });

  it('should return a list of game types with status 200', async () => {
    const mockGameTypes = [
      { id: 1, name: 'Shooter', description: 'Juegos de disparos' },
      { id: 2, name: 'RPG', description: 'Juegos de rol' },
    ];
    (orm.em.find as jest.Mock).mockResolvedValue(mockGameTypes);

    await findAll(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(responseJson).toHaveBeenCalledWith(mockGameTypes);
  });

  it('should return an error with status 500 if the database fails', async () => {
    const errorMessage = 'Database connection lost';
    (orm.em.find as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await findAll(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(responseJson).toHaveBeenCalledWith({ message: errorMessage });
  });
});
