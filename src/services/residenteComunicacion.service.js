const RCRepository = require("../repositories/residenteComunicacion.repositorie");

class ResidenteComunicacionService {
  constructor() {
    this.repository = new RCRepository();
  }

  async create(data) {
    return await this.repository.create(data);
  }

  async get() {
    return await this.repository.get();
  }

  async delete(id) {
    return await this.repository.delete(id);
  }
}

module.exports = ResidenteComunicacionService;
