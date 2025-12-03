const RPPRepository = require("../repositories/residentepago.repositorie");

class ResidentePagoService {
  constructor() {
    this.repository = new RPPRepository();
  }

  // Crear un ResidentePago
  async create(data) {
    return await this.repository.create(data);
  }

  // Obtener todos los registros
  async get() {
    return await this.repository.get();
  }

  // Eliminar un registro por ID
  async delete(id) {
    return await this.repository.delete(id);
  }
}

module.exports = ResidentePagoService;
