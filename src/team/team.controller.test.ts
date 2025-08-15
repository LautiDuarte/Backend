import { remove } from './team.controller.js';

import { orm } from '../shared/db/orm.js';

import { Request, Response } from 'express';

interface TeamRequest extends Request {
  user?: { id: number; name: string; role: 'user' | 'admin' };
}

jest.mock('../shared/db/orm.js', () => ({
  orm: {
    em: {
      findOneOrFail: jest.fn(),
      removeAndFlush: jest.fn(),
    },
  },
}));

describe('Team Controller - remove', () => {
  let mockRequest: Partial<TeamRequest>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseSend: jest.Mock;

  beforeEach(() => {
    (orm.em.findOneOrFail as jest.Mock).mockClear();
    (orm.em.removeAndFlush as jest.Mock).mockClear();

    mockRequest = {
      params: { id: '1' }, // El equipo a borrar es el de id=1
      user: { id: 10, name: 'TestUser', role: 'user' }, // El usuario logueado es el de id=10
    };

    responseJson = jest.fn();
    responseSend = jest.fn();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: responseJson,
      send: responseSend,
    };
  });

  // Test para el caso de éxito (usuario autorizado)
  it('should delete the team and return status 200 if user is the creator', async () => {
    // 1. Arrange (Preparar)
    const mockTeam = {
      id: 1,
      name: 'Team A',
      userCreator: { id: 10 }, // El creador del equipo es el usuario 10 (el mismo que está logueado)
    };
    (orm.em.findOneOrFail as jest.Mock).mockResolvedValue(mockTeam);

    // 2. Act (Actuar)
    await remove(mockRequest as TeamRequest, mockResponse as Response);

    // 3. Assert (Verificar)
    expect(orm.em.findOneOrFail).toHaveBeenCalledWith(
      expect.anything(),
      { id: 1 },
      expect.anything()
    );
    expect(orm.em.removeAndFlush).toHaveBeenCalledWith(mockTeam); // Verificamos que se intentó borrar el equipo
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(responseSend).toHaveBeenCalled(); // Verificamos que se llamó a .send()
  });

  // Test para el caso de fallo (usuario no autorizado)
  it('should return status 403 if user is not the creator', async () => {
    // 1. Arrange (Preparar)
    const mockTeam = {
      id: 1,
      name: 'Team B',
      userCreator: { id: 99 }, // El creador del equipo es el usuario 99 (diferente al logueado)
    };
    (orm.em.findOneOrFail as jest.Mock).mockResolvedValue(mockTeam);

    // 2. Act (Actuar)
    await remove(mockRequest as TeamRequest, mockResponse as Response);

    // 3. Assert (Verificar)
    expect(orm.em.removeAndFlush).not.toHaveBeenCalled(); // Verificamos que NO se intentó borrar
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(responseJson).toHaveBeenCalledWith({
      message: 'You are not authorized to delete this team',
    });
  });

  // Test para el caso de error en la base de datos
  it('should return status 500 if findOneOrFail fails', async () => {
    // 1. Arrange (Preparar)
    const errorMessage = 'Team not found';
    (orm.em.findOneOrFail as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    // 2. Act (Actuar)
    await remove(mockRequest as TeamRequest, mockResponse as Response);

    // 3. Assert (Verificar)
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(responseJson).toHaveBeenCalledWith({ message: errorMessage });
  });
});
