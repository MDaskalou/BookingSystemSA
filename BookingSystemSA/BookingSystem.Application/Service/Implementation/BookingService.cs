﻿using BookingSystem.Application.DTO;
using BookingSystem.Domain.Entities;
using BookingSystem.Infrastructure.IRepository;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookingSystem.Application.Services
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _repository;

        public BookingService(IBookingRepository repository)
        {
            _repository = repository;
        }

        public async Task<BookingDto> GetBookingByIdAsync(int bookingId)
        {
            var booking = await _repository.GetByIdAsync(bookingId);
            if (booking == null) return null;

            return new BookingDto
            {
                BookingId = booking.BookingId,
                Date = booking.Date,
                PatientId = booking.PatientId,
                TreatmentTypeId = booking.TreatmentTypeId,
                CreatedById = booking.CreatedById,
                CreatedAt = booking.CreatedAt,
                Priority = booking.Priority,
                Status = booking.Status
            };
        }

        public async Task<IEnumerable<BookingDto>> GetAllBookingsAsync()
        {
            var bookings = await _repository.GetAllAsync();
            return bookings.Select(b => new BookingDto
            {
                BookingId = b.BookingId,
                Date = b.Date,
                PatientId = b.PatientId,
                TreatmentTypeId = b.TreatmentTypeId,
                CreatedById = b.CreatedById,
                CreatedAt = b.CreatedAt,
                Priority = b.Priority,
                Status = b.Status
            });
        }

        public async Task<BookingDto> CreateBookingAsync(CreateBookingDto dto)
        {
            var booking = new Booking
            {
                Date = dto.Date,
                PatientId = dto.PatientId,
                TreatmentTypeId = dto.TreatmentTypeId,
                CreatedById = dto.CreatedById,
                CreatedAt = dto.CreatedAt,
                Priority = dto.Priority,
                Status = dto.Status
            };

            await _repository.AddAsync(booking);
            return new BookingDto
            {
                BookingId = booking.BookingId,
                Date = booking.Date,
                PatientId = booking.PatientId,
                TreatmentTypeId = booking.TreatmentTypeId,
                CreatedById = booking.CreatedById,
                CreatedAt = booking.CreatedAt,
                Priority = booking.Priority,
                Status = booking.Status
            };
        }

        public async Task<bool> UpdateBookingAsync(int id, CreateBookingDto dto)
        {
            var booking = await _repository.GetByIdAsync(id);
            if (booking == null) return false;

            booking.Date = dto.Date;
            booking.PatientId = dto.PatientId;
            booking.TreatmentTypeId = dto.TreatmentTypeId;
            booking.CreatedById = dto.CreatedById;
            booking.CreatedAt = dto.CreatedAt;
            booking.Priority = dto.Priority;
            booking.Status = dto.Status;

            await _repository.UpdateAsync(booking);
            return true;
        }

        public async Task<bool> DeleteBookingAsync(int id)
        {
            var booking = await _repository.GetByIdAsync(id);
            if (booking == null) return false;

            await _repository.DeleteAsync(booking);
            return true;
        }
    }
}
