export const calculatefine = (dueDate) => {
    const finePerDay = 5;
    const today = new Date();
    if (today > dueDate) {
        const lateHours = Math.ceil((today - dueDate) / (1000 * 60 * 60));
        const fine = lateHours * finePerDay;
        return fine;
    }
    return 0;
}