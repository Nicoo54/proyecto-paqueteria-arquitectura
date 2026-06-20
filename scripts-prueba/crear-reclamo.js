async function testearEndpoint() {
  console.log("Enviando petición a /api/soporte...");

  try {
    const respuesta = await fetch("http://localhost:3000/api/soporte", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codigo_seguimiento: "ENV-998877",
        id_remitente: "user_test_123",
        motivo: "Demora en la entrega",
        descripcion_detallada: "El paquete figura en tránsito hace 4 días y no hay actualizaciones en el mapa."
      }),
    });

    const datos = await respuesta.json();

    // Usamos comillas dobles estándar y el signo + para unir el texto
    console.log("\nStatus HTTP: " + respuesta.status);
    console.log("Respuesta del servidor:");
    console.log(JSON.stringify(datos, null, 2));

  } catch (error) {
    console.error("Error al conectar con el servidor: ", error);
  }
}

testearEndpoint();