import { findOne } from './user.controller.js';
import { orm } from '../shared/db/orm.js';
import { Request, Response } from 'express';

// Hacemos un "mock" del módulo del ORM.
jest.mock('../shared/db/orm.js', () => ({
  orm: {
    em: {
      findOneOrFail: jest.fn(), // Simulamos la función findOneOrFail
    },
  },
}));

describe('User Controller - findOne', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;

  beforeEach(() => {
    (orm.em.findOneOrFail as jest.Mock).mockClear();

    mockRequest = {
      params: { id: '1' }, // Simulamos que el request viene con el parámetro id=1
    };

    responseJson = jest.fn(); 
    mockResponse = {
      status: jest.fn().mockReturnThis(), 
      json: responseJson, 
    };
  });

  it('should return a user with status 200 if found', async () => {
    // 1. Arrange (Preparar)
    const mockUser = {
      id: 1,
      name: 'Santiago',
      lastName: 'Capriotti',
      email: 'santi@test.com',
    };

    (orm.em.findOneOrFail as jest.Mock).mockResolvedValue(mockUser);

    // 2. Act (Actuar)
    await findOne(mockRequest as Request, mockResponse as Response);

    // 3. Assert (Verificar)
    // Verificamos que el método status fue llamado con 200
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    // Verificamos que el método json fue llamado con los datos del usuario
    expect(responseJson).toHaveBeenCalledWith(mockUser);
    // Verificamos que findOneOrFail fue llamado con los argumentos correctos
    expect(orm.em.findOneOrFail).toHaveBeenCalledWith(
      expect.anything(),
      { id: 1 },
      expect.anything()
    );
  });

  it('should return an error with status 500 if user is not found', async () => {
    // 1. Arrange (Preparar)
    const errorMessage = 'User not found';
    // Configuramos nuestro mock: cuando se llame a findOneOrFail, debe fallar (rechazar la promesa).
    (orm.em.findOneOrFail as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    // 2. Act (Actuar)
    await findOne(mockRequest as Request, mockResponse as Response);

    // 3. Assert (Verificar)
    // Verificamos que el método status fue llamado con 500
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    // Verificamos que el método json fue llamado con el mensaje de error
    expect(responseJson).toHaveBeenCalledWith({ message: errorMessage });
  });
});
