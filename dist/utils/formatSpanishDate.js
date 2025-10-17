export function formatSpanishDate(dateString) {
    // ✅ CORREGIDO: Crear fecha como local, no UTC
    const parts = dateString.split('-');
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Los meses van de 0-11 en JavaScript
    const day = parseInt(parts[2]);
    // Crear fecha local en lugar de parsear el string directamente
    const date = new Date(year, month, day);
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const dayName = days[date.getDay()];
    const dayNumber = date.getDate().toString();
    const monthName = months[date.getMonth()];
    return [dayName, dayNumber, monthName];
}
