import crypto from 'node:crypto';
export class TipoJuego {
    constructor(name, description, id = crypto.randomUUID()) {
        this.name = name;
        this.description = description;
        this.id = id;
    }
}
//# sourceMappingURL=tipoJuego.entity.js.map