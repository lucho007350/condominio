class Empleado {
    #idEmpleado = null;
    #nombre = null;
    #apellido = null;
    #cargo = null;
    #documento = null;
    #telefono = null;
    #fechaContratacion = null;
    #salario = null; // ✅ nuevo campo

    constructor(
        idEmpleado = null,
        nombre = null,
        apellido = null,
        cargo = null,
        documento = null,
        telefono = null,
        fechaContratacion = null,
        salario = null // ✅ nuevo parámetro
    ) {
        this.#idEmpleado = idEmpleado;
        this.#nombre = nombre;
        this.#apellido = apellido;
        this.#cargo = cargo;
        this.#documento = documento;
        this.#telefono = telefono;
        this.#fechaContratacion = fechaContratacion;
        this.#salario = salario; // ✅ asignación
    }

    // Getters
    getIdEmpleado() { return this.#idEmpleado; }
    getNombre() { return this.#nombre; }
    getApellido() { return this.#apellido; }
    getCargo() { return this.#cargo; }
    getDocumento() { return this.#documento; }
    getTelefono() { return this.#telefono; }
    getFechaContratacion() { return this.#fechaContratacion; }
    getSalario() { return this.#salario; } // ✅ getter

    // Setters
    setIdEmpleado(idEmpleado) { this.#idEmpleado = idEmpleado; }
    setNombre(nombre) { this.#nombre = nombre; }
    setApellido(apellido) { this.#apellido = apellido; }
    setCargo(cargo) { this.#cargo = cargo; }
    setDocumento(documento) { this.#documento = documento; }
    setTelefono(telefono) { this.#telefono = telefono; }
    setFechaContratacion(fechaContratacion) { this.#fechaContratacion = fechaContratacion; }
    setSalario(salario) { this.#salario = salario; } // ✅ setter

    // Devuelve todos los valores del empleado como un objeto
    getValues() {
        return {
            idEmpleado: this.#idEmpleado,
            nombre: this.#nombre,
            apellido: this.#apellido,
            cargo: this.#cargo,
            documento: this.#documento,
            telefono: this.#telefono,
            fechaContratacion: this.#fechaContratacion,
            salario: this.#salario // ✅ incluir salario
        };
    }
}

module.exports = Empleado;