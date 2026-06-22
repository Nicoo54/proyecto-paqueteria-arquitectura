import { ResolverReclamoUseCase } from '../resolver-reclamo';
import { TicketRepository } from '../../../repositories/ticket-repository';

describe('ResolverReclamoUseCase', () => {
  let mockTicketRepository: jest.Mocked<TicketRepository>;
  let useCase: ResolverReclamoUseCase;

  beforeEach(() => {
    mockTicketRepository = {
      guardar: jest.fn(),
      obtenerPorCodigo: jest.fn(),
      obtenerPendientes: jest.fn(),
      obtenerPorRemitente: jest.fn(),
      obtenerResueltosPorHelper: jest.fn(),
      // @ts-ignore
      obtenerPorCodigo: jest.fn()
    };

    useCase = new ResolverReclamoUseCase(mockTicketRepository);
  });

  it('debería cambiar el estado a RESUELTO cuando se envía conclusión y comentarios', async () => {
    // Arrange
    const ticketEnProceso = {
      codigo_reclamo: 'REC-001',
      codigo_seguimiento: 'TRK-123',
      estado: 'EN_PROGRESO',
    };
    
    // @ts-ignore
    mockTicketRepository.obtenerPorCodigo.mockResolvedValue(ticketEnProceso);
    mockTicketRepository.guardar.mockImplementation(async (ticket) => ticket);

    // Act
    const resultado = await useCase.ejecutar(
      'REC-001', 
      'Se contactó al transportista', 
      'El paquete fue entregado en otra puerta, ya se recuperó.'
    );

    // Assert
    expect(resultado.estado).toBe('RESUELTO'); 
    expect(mockTicketRepository.guardar).toHaveBeenCalledTimes(1);
  });

  it('debería lanzar un error si faltan comentarios de soporte', async () => {
    // Act & Assert
    await expect(
      useCase.ejecutar('REC-001', 'Falsa alarma', '')
    ).rejects.toThrow('La resolución y los comentarios de soporte son obligatorios');
    
    expect(mockTicketRepository.guardar).not.toHaveBeenCalled();
  });
});