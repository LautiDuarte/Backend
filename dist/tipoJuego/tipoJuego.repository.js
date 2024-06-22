import { TipoJuego } from './tipoJuego.entity.js';
const tipoJuegos = [
    new TipoJuego('RPG', 'Role-Play Game', 'f1f5a1e4-ee46-479e-a967-52c57b15e7f4'),
];
export class tipoJuegoRepository {
    findAll() {
        return tipoJuegos;
    }
    findOne(item) {
        return tipoJuegos.find((tipoJuego) => tipoJuego.id === item.id);
    }
    add(item) {
        tipoJuegos.push(item);
        return item;
    }
    update(item) {
        const tipoJuegoIdx = tipoJuegos.findIndex((tipoJuego) => tipoJuego.id === item.id);
        if (tipoJuegoIdx !== -1) {
            tipoJuegos[tipoJuegoIdx] = { ...tipoJuegos[tipoJuegoIdx], ...item };
        }
        return tipoJuegos[tipoJuegoIdx];
    }
    delete(item) {
        const tipoJuegoIdx = tipoJuegos.findIndex((tipoJuego) => tipoJuego.id === item.id);
        if (tipoJuegoIdx !== -1) {
            const deletedTipoJuego = tipoJuegos[tipoJuegoIdx];
            tipoJuegos.splice(tipoJuegoIdx, 1);
            return deletedTipoJuego;
        }
    }
}
//# sourceMappingURL=tipoJuego.repository.js.map