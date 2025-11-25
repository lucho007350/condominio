const FacturaRepository = require("../repositories/factura.repositorie");

class FacturaService {
  constructor() {
    this.repository = new FacturaRepository();
  }

  async create(data) {
    return this.repository.create(data);
  }

  async get() {
    return this.repository.get();
  }

  async getById(id) {
    return this.repository.getById(id);
  }
  
  async getByUnidad(idUnidad) {
    return this.repository.getByUnidad(idUnidad);
  }

  async update(idFactura, data) {
    return this.repository.update(idFactura, data);
  }
  

  async delete(idFactura) {
    return this.repository.delete(idFactura);
  }
}

module.exports = FacturaService;
