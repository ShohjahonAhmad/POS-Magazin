export default function getWeekRange(day) {
    const date = new Date(day);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday...
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // shift Sunday back to previous Monday
    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { start: monday, end: sunday };
}
