﻿using BookingSystem.Application.Common;
using BookingSystem.Application.DTO;
using MediatR;

namespace BookingSystem.Application.Commands.DocumentCommand.UpdateDocument;

public record UpdateDocumentCommand(int Id, CreateDocumentDto Dto) : IRequest<OperationResult<bool>>;