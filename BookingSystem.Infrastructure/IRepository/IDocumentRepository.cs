﻿using BookingSystem.Domain.Entities;

namespace BookingSystem.Infrastructure.IRepository
{
    public interface IDocumentRepository
    {
        Task AddAsync(Document document);
        Task<Document?> GetByIdAsync(int id);
        Task<IEnumerable<Document>> GetAllAsync();
        Task UpdateAsync(Document document);
        Task DeleteAsync(Document document);
    }
}
