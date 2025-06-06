﻿using BookingSystem.Domain.Entities;
using BookingSystem.Infrastructure.IRepository;
using Microsoft.EntityFrameworkCore;

namespace BookingSystem.Infrastructure.Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly AppDbContext _context;

        public BookingRepository(AppDbContext context)
        {
            _context = context;
        }
        // Hämtar en bokning baserat på ID
        public async Task<Booking> GetByIdAsync(int BookingId)
        {
            return await _context.Bookings
                .Include(b => b.Patient) // om du vill inkludera relaterade entiteter
                .Include(b => b.TreatmentType)
                .Include(b => b.CreatedBy)
                .FirstOrDefaultAsync(b => b.BookingId == BookingId);
        }
        // Hämtar alla bokningar
        public async Task<IEnumerable<Booking>> GetAllAsync()
        {
            return await _context.Bookings
                .Include(b => b.Patient)
                .Include(b => b.TreatmentType)
                .Include(b => b.CreatedBy)
                .ToListAsync();
        }
        // Hämtar bokningar baserat på patientens ID
        public async Task AddAsync(Booking booking)
        {
            await _context.Bookings.AddAsync(booking);
            await _context.SaveChangesAsync();
        }
        //
        public async Task UpdateAsync(Booking booking)
        {
            _context.Bookings.Update(booking);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Booking booking)
        {
            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();
        }
    }
}
