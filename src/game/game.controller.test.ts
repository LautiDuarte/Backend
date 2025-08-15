import { update } from './game.controller.js';
import { orm } from '../shared/db/orm.js';
import { Request, Response } from 'express';

jest.mock('../shared/db/orm.js', () => ({
  orm: {
    em: {
      getReference: jest.fn(),
      assign: jest.fn(),
      flush: jest.fn(),
    },
  },
}));

describe('Game Controller - update', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;

  beforeEach(() => {
    (orm.em.getReference as jest.Mock).mockClear();
    (orm.em.assign as jest.Mock).mockClear();
    (orm.em.flush as jest.Mock).mockClear();

    mockRequest = {
      params: { id: '1' }, // El juego a actualizar es el de id=1
      body: {
        sanitizedInput: {
          name: 'New Game Name',
          description: 'New Description',
        },
      },
    };

    responseJson = jest.fn();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: responseJson,
    };
  });

  // Test para el caso de éxito
  it('should update the game and return status 200', async () => {
    // 1. Arrange (Preparar)
    const mockGame = { id: 1, name: 'Old Game Name' };
    (orm.em.getReference as jest.Mock).mockReturnValue(mockGame);
    (orm.em.flush as jest.Mock).mockResolvedValue(undefined); // em.flush no devuelve nada

    // 2. Act (Actuar)
    await update(mockRequest as Request, mockResponse as Response);

    // 3. Assert (Verificar)
    expect(orm.em.getReference).toHaveBeenCalledWith(expect.anything(), 1);
    expect(orm.em.assign).toHaveBeenCalledWith(
      mockGame,
      mockRequest.body.sanitizedInput
    );
    expect(orm.em.flush).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });

  // Test para el caso de error
  it('should return status 500 if flush fails', async () => {
    // 1. Arrange (Preparar)
    const errorMessage = 'Error saving to database';
    (orm.em.flush as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // 2. Act (Actuar)
    await update(mockRequest as Request, mockResponse as Response);

    // 3. Assert (Verificar)
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(responseJson).toHaveBeenCalledWith({ message: errorMessage });
  });
});
