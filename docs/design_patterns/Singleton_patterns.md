
---

 **📜 3️⃣ Singleton_Pattern.md**
📌 **Create inside `docs/design_patterns/`**

```md
# 🔄 Singleton Pattern – Booking System Management

## 📖 Why We Chose Singleton Pattern
In our booking system, we need to **ensure that only one instance of the Booking Manager exists** to prevent duplicate or conflicting bookings.

## 📌 Use Case: Booking Manager
- **Actors:** System, Admin, User.
- **Preconditions:** User requests to book an appointment.
- **Main Flow:**
  1. The user requests an appointment.
  2. The **BookingManager** Singleton instance is accessed.
  3. The booking is processed and stored.
- **Alternate Flow:** If an appointment conflict exists, the user is notified.

## 📝 User Story
*"As a healthcare provider, I want to ensure that no duplicate appointments can be booked for the same slot."*

## 🖥️ Code Example (Singleton Pattern)
```csharp
public class BookingManager
{
    private static BookingManager _instance;
    private static readonly object _lock = new object();

    private BookingManager() { }

    public static BookingManager Instance
    {
        get
        {
            lock (_lock)
            {
                if (_instance == null)
                    _instance = new BookingManager();
                return _instance;
            }
        }
    }

    public void BookAppointment(string patientName, string date)
    {
        Console.WriteLine($"Appointment booked for {patientName} on {date}");
    }
}

// Usage Example
class Program
{
    static void Main()
    {
        BookingManager.Instance.BookAppointment("John Doe", "2024-06-15");
    }
}
