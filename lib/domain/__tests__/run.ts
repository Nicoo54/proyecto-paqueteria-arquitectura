import "./vehiculo.test";
import "./transportista.test";
import "./envio.test";
import "./geo.test";
import "./aceptar-envio.test";
import "./actualizar-estado-envio.test";
import "./liquidacion.test";
import "../../application/__tests__/liquidar-pagos-nocturna.test";
import "../../application/__tests__/transportista-use-cases.test";
import { correrTests } from "./_runner";

void correrTests();
