import { IniciarGestionReclamoUseCase } from '../iniciar-gestion-reclamo';
import { TicketRepository } from '../../../repositories/ticket-repository';

describe('IniciarGestionReclamoUseCase', () => {
  let mockTicketRepository: jest.Mocked<TicketRepository>;
  let useCase: IniciarGestionReclamoUseCase;

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

    useCase = new IniciarGestionReclamoUseCase(mockTicketRepository);
  });

  it('debería transicionar el ticket a EN_PROGRESO al ser tomado por un Helper', async () => {
    // Arrange
    const ticketMock = {
      codigo_reclamo: 'REC-001',
      codigo_seguimiento: 'TRK-123',
      id_remitente: '12345678',
      motivo: 'Demora',
      estado: 'PENDIENTE',
      created_at: new Date()
    };
    
    // @ts-ignore - Simulamos que el repositorio encuentra el ticket
    mockTicketRepository.obtenerPorCodigo.mockResolvedValue(ticketMock);
    
    // Simulamos que al guardar, devuelve lo que se le pasó
    mockTicketRepository.guardar.mockImplementation(async (ticket) => ticket);

    // Act
    const resultado = await useCase.ejecutar('REC-001', 'HELPER-999');

    // Assert
    expect(resultado.estado).toBe('EN_PROGRESO'); // RN13: Transita a En Proceso [cite: 29]
    expect(mockTicketRepository.guardar).toHaveBeenCalled();
  });

  it('debería lanzar un error si el reclamo no existe', async () => {
    // Arrange: El repositorio no encuentra nada
    // @ts-ignore
    mockTicketRepository.obtenerPorCodigo.mockResolvedValue(null);

    // Act & Assert
    await expect(
      useCase.ejecutar('REC-999', 'HELPER-999')
    ).rejects.toThrow('El reclamo no existe.');
  });
});