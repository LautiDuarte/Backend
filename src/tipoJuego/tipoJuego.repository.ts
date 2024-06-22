import { Repository } from '../shared/repository.js'
import { TipoJuego } from './tipoJuego.entity.js'

const tipoJuegos = [
  new TipoJuego(
    'RPG',
    'Role-Play Game',
    'f1f5a1e4-ee46-479e-a967-52c57b15e7f4'
  ),
]

export class tipoJuegoRepository implements Repository<TipoJuego> {
  public findAll(): TipoJuego[] | undefined {
    return tipoJuegos
  }

  public findOne(item: { id: string }): TipoJuego| undefined {
    return tipoJuegos.find((tipoJuego) => tipoJuego.id === item.id)
  }

  public add(item: TipoJuego): TipoJuego | undefined {
    tipoJuegos.push(item)
    return item
  }

  public update(item: TipoJuego): TipoJuego | undefined {
    const tipoJuegoIdx = tipoJuegos.findIndex((tipoJuego) => tipoJuego.id === item.id)

    if (tipoJuegoIdx !== -1) {
      tipoJuegos[tipoJuegoIdx] = { ...tipoJuegos[tipoJuegoIdx], ...item }
    }
    return tipoJuegos[tipoJuegoIdx]
  }

  public delete(item: { id: string }): TipoJuego | undefined {
    const tipoJuegoIdx = tipoJuegos.findIndex((tipoJuego) => tipoJuego.id === item.id)

    if (tipoJuegoIdx !== -1) {
      const deletedTipoJuego = tipoJuegos[tipoJuegoIdx]
      tipoJuegos.splice(tipoJuegoIdx, 1)
      return deletedTipoJuego
    }
  }
}
