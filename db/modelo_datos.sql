-- Datos como: Nombre, Apellido, Correo electrónico, Contraseña, foto se guardaran en clerk 
CREATE TABLE Usuario (
    dni VARCHAR(10) PRIMARY KEY,
    clerk_id VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Remitente (
    dni VARCHAR(10) PRIMARY KEY,
    FOREIGN KEY (dni) REFERENCES Usuario(dni)
);


-- Dni del remitente no es PK para que pueda tener varias direcciones.
CREATE TABLE Direccion (
    id_direccion SERIAL PRIMARY KEY,
    remitente_dni VARCHAR(10) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    ciudad VARCHAR(100),
    provincia VARCHAR(100),
    pais VARCHAR(100),
    codigo_postal VARCHAR(20),
    origen_lat DECIMAL(10, 8) NOT NULL,
    origen_lng DECIMAL(10, 8) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (remitente_dni) REFERENCES Remitente(dni) ON DELETE CASCADE
);

CREATE TABLE SoporteTecnico (
    dni VARCHAR(10) PRIMARY KEY,
    FOREIGN KEY (dni) REFERENCES Usuario(dni)
);

CREATE TABLE CategoriaVehiculo (
    nombre_categoria VARCHAR(20) PRIMARY KEY,
    capacidad_maxima DECIMAL(10, 2) NOT NULL
);

-- La patenten no es PK porq puede haber vehiculos sin patente por ej una bicicleta.
CREATE TABLE Vehiculo (
    id SERIAL PRIMARY KEY,
    categoria_id VARCHAR(20) NOT NULL,
    patente VARCHAR(10) UNIQUE,

    FOREIGN KEY (categoria_id) REFERENCES CategoriaVehiculo(nombre_categoria)
);

CREATE TABLE Transportista (
    dni VARCHAR(10) PRIMARY KEY,
    id_vehiculo INTEGER NOT NULL,
    alias_bancario VARCHAR(100) NOT NULL,
    cantidad_resenas INTEGER DEFAULT 0,
    promedio_calificacion DECIMAL(3, 2) DEFAULT 0.00,

    FOREIGN KEY (id_vehiculo) REFERENCES Vehiculo(id),
    FOREIGN KEY (dni) REFERENCES Usuario(dni)
);

CREATE TABLE CategoriaPaquete (
    categoria_paquete VARCHAR(20) PRIMARY KEY,
    peso_maximo DECIMAL(10, 2) NOT NULL,
    multiplicador_costo DECIMAL(10, 2) NOT NULL
);


-- Al area vamos a guardarla como un circulo
CREATE TABLE ZonaCaliente (
    codigo_zona_caliente SERIAL PRIMARY KEY,
    centro_lat DECIMAL(10, 8) NOT NULL,
    centro_lng DECIMAL(10, 8) NOT NULL,
    radio_m DECIMAL(10, 2) NOT NULL,
    multiplicador_precio DECIMAL(10, 2) NOT NULL,
    fecha_vigencia_inicio DATE NOT NULL,
    fecha_vigencia_fin DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Envio (
    codigo_envio SERIAL PRIMARY KEY,
    categoria_paquete VARCHAR(20) NOT NULL,
    dni_remitente VARCHAR(10) NOT NULL,
    dni_transportista VARCHAR(10),
    codigo_zona_caliente INTEGER,
    origen_direccion VARCHAR(255) NOT NULL,
    origen_lat DECIMAL(10, 8) NOT NULL,
    origen_lng DECIMAL(10, 8) NOT NULL,
    destino_direccion VARCHAR(255) NOT NULL,
    destino_lat DECIMAL(10, 8) NOT NULL,
    destino_lng DECIMAL(10, 8) NOT NULL,
    condicion_climatica VARCHAR(50) NOT NULL,
    estado VARCHAR(20) NOT NULL,
    costo DECIMAL(10, 2) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (categoria_paquete) REFERENCES CategoriaPaquete(categoria_paquete),
    FOREIGN KEY (dni_remitente) REFERENCES Remitente(dni),
    FOREIGN KEY (dni_transportista) REFERENCES Transportista(dni),
    FOREIGN KEY (codigo_zona_caliente) REFERENCES ZonaCaliente(codigo_zona_caliente)
);

CREATE TABLE Resena (
    id_resena SERIAL PRIMARY KEY,
    codigo_seguimiento INTEGER NOT NULL,
    puntaje SMALLINT NOT NULL,
    comentario TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (codigo_seguimiento) REFERENCES Envio(codigo_envio)
);

CREATE TABLE Transaccion (
    id_referencia_externa VARCHAR(50) PRIMARY KEY,
    codigo_seguimiento INTEGER NOT NULL,
    monto_total DECIMAL(10, 2) NOT NULL,
    estado_pago VARCHAR(20) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (codigo_seguimiento) REFERENCES Envio(codigo_envio)
);

CREATE TABLE Ticket (
    codigo_reclamo SERIAL PRIMARY KEY,
    codigo_seguimiento INTEGER NOT NULL,
    dni_soporte_tecnico VARCHAR(10),
    motivo TEXT NOT NULL,
    resolucion TEXT,
    estado VARCHAR(20) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (codigo_seguimiento) REFERENCES Envio(codigo_envio),
    FOREIGN KEY (dni_soporte_tecnico) REFERENCES SoporteTecnico(dni)
);

CREATE TABLE Metrica (
    fecha_reporte DATE PRIMARY KEY,
    cantidad_envios_totales INTEGER NOT NULL,
    ganancia_neta_plataforma DECIMAL(10, 2) NOT NULL
);