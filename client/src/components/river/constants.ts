export const UPDATE_FREQUENCIES: Record<string, string | null> = {
    "run once": null,
    "once a day": "0 0 * * *",
    "every 12 hours": "0 0/12 * * *",
    "every 8 hours": "0 0/8 * * *",
    "every 6 hours": "0 0/6 * * *",
    "every 4 hours": "0 0/4 * * *",
}
