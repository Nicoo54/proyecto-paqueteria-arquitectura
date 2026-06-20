import { CrearReclamoUseCase } from '../crear-reclamo';
import { TicketRepository, EnvioValidationRepository } from '../../../repositories/ticket-repository';

describe('CrearReclamoUseCase', () => {
  let mockTicketRepository: jest.Mocked<TicketRepository>;
  let mockEnvioValidationRepository: jest.Mocked<EnvioValidationRepository>;
  let useCase: CrearReclamoUseCase;

  beforeEach(() => {
    mockTicketRepository = {
      guardar: jest.fn(),
      obtenerPorCodigo: jest.fn(),
      obtenerPendientes: jest.fn(),
      obtenerPorRemitente: jest.fn(),
      obtenerResueltosPorHelper: jest.fn(),
      // @ts-ignore - Simulamos el método que falta en la interfaz inicial
      obtenerPorCodigo: jest.fn() 
    };

    mockEnvioValidationRepository = {
      obtenerDetallesBasicos: jest.fn(),
    };

    useCase = new CrearReclamoUseCase(mockTicketRepository, mockEnvioValidationRepository);
  });

  it('debería crear un ticket en estado PENDIENTE si el envío está Entregado', async () => {
    // Arrange
    mockEnvioValidationRepository.obtenerDetallesBasicos.mockResolvedValue({
      estado: 'Entregado',
      remitenteDni: '12345678'
    });

    // Act
    const resultado = await useCase.ejecutar('TRK-123', '12345678', 'Paquete dañado', 'La caja llegó rota');

    // Assert
    expect(resultado.estado).toBe('PENDIENTE'); // Transición inicial [cite: 29]
    expect(resultado.codigo_seguimiento).toBe('TRK-123');
    expect(mockTicketRepository.guardar).toHaveBeenCalledTimes(1);
  });

  it('debería lanzar un error si se intenta abrir un ticket para un envío en estado Buscando', async () => {
    // Arrange: "Buscando" no cumple con RF05 (debe estar Aceptado o superior) 
    mockEnvioValidationRepository.obtenerDetallesBasicos.mockResolvedValue({
      estado: 'Buscando',
      remitenteDni: '12345678'
    });

    // Act & Assert
    await expect(
      useCase.ejecutar('TRK-123', '12345678', 'Duda', 'Quiero cancelar')
    ).rejects.toThrow('Solo se pueden generar reclamos para envíos que ya han sido asignados');

    expect(mockTicketRepository.guardar).not.toHaveBeenCalled();
  });
});